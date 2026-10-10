import { createServer } from "node:net";
import { MongoClient } from "mongodb";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { afterEach, describe, expect, it } from "vitest";
import { createConnector } from "@/lib/mongo-connect";

/** Un puerto libre en el que todavía no escucha nadie */
const freePort = () =>
  new Promise<number>((resolve) => {
    const server = createServer().listen(0, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });

const cleanup: Array<() => Promise<unknown>> = [];
afterEach(async () => {
  for (const fn of cleanup.splice(0)) await fn();
});

/** Cliente apuntando a un puerto sin MongoDB; devuelve también cómo levantar la base en él */
async function clientWithoutDatabase() {
  const port = await freePort();
  const client = new MongoClient(`mongodb://127.0.0.1:${port}/?replicaSet=testset`, {
    serverSelectionTimeoutMS: 1_000,
  });
  cleanup.push(() => client.close());
  const startDatabase = async () => {
    const replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, name: "testset" },
      instanceOpts: [{ port }],
    });
    cleanup.push(() => replSet.stop());
  };
  return { client, startDatabase };
}

describe("createConnector", () => {
  it("documenta el problema: sin reintento, el cliente queda cerrado aunque la base vuelva", async () => {
    const { client, startDatabase } = await clientWithoutDatabase();
    const col = client.db("test").collection("items");

    await expect(col.countDocuments()).rejects.toThrow(/ECONNREFUSED|Server selection/);
    await startDatabase();
    await expect(col.countDocuments()).rejects.toThrow("Topology is closed");
  });

  it("reintenta tras un primer fallo y el mismo cliente (y sus colecciones) vuelve a funcionar", async () => {
    const { client, startDatabase } = await clientWithoutDatabase();
    const connect = createConnector(client);
    const col = client.db("test").collection("items"); // creada antes, como en los repositorios

    await expect(connect()).rejects.toThrow();
    await startDatabase();
    await connect();
    await col.insertOne({ ok: true });
    expect(await col.countDocuments()).toBe(1);
  });

  it("conecta una sola vez aunque se llame en paralelo", async () => {
    const { client, startDatabase } = await clientWithoutDatabase();
    await startDatabase();
    const connect = createConnector(client);
    let connects = 0;
    client.on("topologyOpening", () => connects++);

    await Promise.all(Array.from({ length: 5 }, () => connect()));
    await connect();
    expect(connects).toBe(1);
  });
});

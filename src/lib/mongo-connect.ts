import type { MongoClient } from "mongodb";

/**
 * El driver de MongoDB (v7) deja el cliente cerrado para siempre si su PRIMERA conexión falla:
 * todas las operaciones siguientes lanzan MongoTopologyClosedError aunque la base vuelva.
 * Una vez conectado, en cambio, se recupera solo de las caídas.
 *
 * Esta función conecta de forma explícita una sola vez y, si falla, olvida el intento para que
 * la siguiente llamada lo repita: connect() reabre el MISMO cliente, así que las colecciones
 * creadas antes (repositorios, Better Auth) siguen sirviendo.
 */
export function createConnector(client: MongoClient): () => Promise<void> {
  let pending: Promise<unknown> | null = null;
  return async () => {
    pending ??= client.connect().catch((error: unknown) => {
      pending = null;
      throw error;
    });
    await pending;
  };
}

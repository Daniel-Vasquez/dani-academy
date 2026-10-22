import { chromium, type FullConfig } from "@playwright/test";

/**
 * Calienta el servidor de desarrollo antes de los tests. Con la caché de Vite vacía (siempre en
 * CI), Vite optimiza las dependencias del cliente al arrancar; si la primera página llega antes
 * de que termine, al acabar recarga la página abierta. En CI le pasó al primer test de la
 * batería («Execution context was destroyed… because of a navigation»). Aquí se carga una página
 * y se espera a que pase un rato sin recargas, así ningún test empieza a mitad de esa optimización.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) return;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    let lastNavigation = Date.now();
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) lastNavigation = Date.now();
    });

    for (const path of ["/login", "/registro"]) {
      await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
    }
    // 3 s seguidos sin recargas (como mucho 30 s)
    const deadline = Date.now() + 30_000;
    while (Date.now() - lastNavigation < 3_000 && Date.now() < deadline) {
      await page.waitForTimeout(250);
    }
  } finally {
    await browser.close();
  }
}

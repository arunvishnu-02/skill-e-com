import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const out = process.argv[2] || ".visual";
const b = await chromium.launch();
const shots = [
  ["dashboard-1440", "/#dashboard", 1440, 1052],
  ["orders-1440", "/#orders", 1440, 917],
  ["add-product-1440", "/#products", 1440, 1701],
  ["dashboard-375", "/#dashboard", 375, 1058],
  ["dashboard-820", "/#dashboard", 820, 1100],
];
for (const [name, path, w, h] of shots) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto("http://localhost:4173" + "/?noswitch=1" + path, { waitUntil: "load" });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: false });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(name, "hScroll:", overflow, "errors:", errs.filter((e) => !/fonts\.g|ERR_|Failed to load resource/.test(e)));
  await p.close();
}
await b.close();

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const out = process.argv[2] || ".visual";
const b = await chromium.launch();
for (const t of ["oceanClinic", "verdeFoods"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1052 } });
  await p.goto(`http://localhost:4173/?noswitch=1&theme=${t}#dashboard`);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/theme-${t}.png` });
  await p.close();
}
// modal
let p = await b.newPage({ viewport: { width: 1440, height: 1003 } });
await p.goto("http://localhost:4173/?noswitch=1#inventory");
await p.click("text=+ Restock"); await p.waitForTimeout(300);
await p.screenshot({ path: `${out}/modal-1440.png` });
// notifications
p = await b.newPage({ viewport: { width: 1440, height: 1052 } });
await p.goto("http://localhost:4173/?noswitch=1#dashboard");
await p.click('.cd-header__actions button[aria-label^="Notifications"]'); await p.waitForTimeout(300);
await p.screenshot({ path: `${out}/notifications-1440.png` });
await b.close();

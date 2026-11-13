import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const axe = readFileSync(require.resolve("axe-core/axe.min.js", { paths: ["apps/starter"] }), "utf8");
const b = await chromium.launch();
let total = 0;
for (const theme of ["ak57", "oceanClinic", "verdeFoods"]) {
  for (const [name, hash, w] of [["dashboard", "dashboard", 1440], ["orders", "orders", 1440], ["products", "products", 1440], ["states", "states", 1440], ["dashboard", "dashboard", 375]]) {
    const p = await b.newPage({ viewport: { width: w, height: 1000 } });
    await p.goto(`http://localhost:4173/?noswitch=1&theme=${theme}#${hash}`);
    await p.waitForTimeout(300);
    await p.addScriptTag({ content: axe });
    const r = await p.evaluate(() => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] }));
    const v = r.violations.filter((x) => x.impact === "serious" || x.impact === "critical");
    total += v.length;
    console.log(theme, name, w, "violations:", v.map((x) => `${x.id}(${x.nodes.length}) ${x.nodes[0].target}`));
    await p.close();
  }
}
console.log("TOTAL serious/critical:", total);
await b.close();

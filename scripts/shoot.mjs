// Screenshot pages with the installed Google Chrome via Playwright (no browser download).
// Usage: node scripts/shoot.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = ".impeccable/review";
mkdirSync(out, { recursive: true });

const RESULT_STATE = JSON.stringify({
  state: { propertyType: "landed", postalCode: "757695", roofAreaM2: 120, roofMaterial: "tile", storeys: "3", phase: "three", monthlyBillSgd: 420, retailer: "sp", usagePattern: "daytime", ev: "yes" },
  step: "result",
});
const targets = [
  { name: "home", path: "/" },
  { name: "services", path: "/services" },
  { name: "projects", path: "/projects" },
  { name: "contact", path: "/contact" },
  { name: "calculator", path: "/calculator?postal=757695" },
  { name: "calculator-result", path: "/calculator", seed: RESULT_STATE, viewportOnly: true },
  { name: "home-hero", path: "/", viewportOnly: true },
];
const viewports = [
  { tag: "desktop", width: 1440, height: 900, dpr: 1 },
  { tag: "mobile", width: 390, height: 844, dpr: 2, mobile: true },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const t of targets) {
    if (t.seed) await page.addInitScript((seed) => sessionStorage.setItem("haosolar.calculator.v1", seed), t.seed);
    await page.goto(base + t.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(4500); // let authored motion finish
    await page.screenshot({ path: `${out}/${t.name}-${vp.tag}.png`, fullPage: !t.viewportOnly });
    const overflow = await page.evaluate(() => { window.scrollTo(9999, 0); const x = window.scrollX; window.scrollTo(0, 0); return x; });
    console.log(`${vp.tag} ${t.path} overflow=${overflow}px`);
  }
  if (errors.length) console.log(`${vp.tag} console errors:\n` + errors.join("\n"));
  await ctx.close();
}
await browser.close();

import { test, expect } from "@playwright/test";

test("hard refresh reveals hero copy once without a hydration flash", async ({ page }) => {
  // Delay hydration until the CSS entrance is already underway.
  await page.route("**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await route.continue();
  });
  await page.addInitScript(() => {
    const samples: number[] = [];
    Object.assign(window, { heroOpacitySamples: samples });
    const started = performance.now();
    const sample = () => {
      const copy = document.querySelector(".hero-title-coorg .hero-copy-entry");
      if (copy) {
        const style = getComputedStyle(copy);
        if (style.animationName === "hero-copy-enter") samples.push(Number(style.opacity));
      }
      if (performance.now() - started < 8000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.goto("/", { waitUntil: "networkidle" });
  const copy = page.locator(".hero-title-coorg .hero-copy-entry");
  await expect(copy).toHaveCSS("opacity", "1");
  const samples = await page.evaluate(() => (window as typeof window & { heroOpacitySamples: number[] }).heroOpacitySamples);
  expect(samples.length).toBeGreaterThan(10);
  expect(samples[0]).toBeLessThan(0.1);
  for (let index = 1; index < samples.length; index++) expect(samples[index]).toBeGreaterThanOrEqual(samples[index - 1] - 0.01);
  await page.waitForTimeout(700);
  await expect(copy).toHaveCSS("opacity", "1");
});

test("hero remains readable without JavaScript and with reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".hero-title-coorg .hero-copy-entry")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await context.close();
});

import { test, expect } from "@playwright/test";

test("estate profiles show source acreage and matched photos without prices", async ({ page }) => {
  await page.goto("/estates", { waitUntil: "networkidle" });
  await expect(page.locator("main")).not.toContainText(/₹|per sq ft|crore|lakh|ROI|revenue/i);
  await expect(page.getByRole("heading", { name: "Madikeri Estate", exact: true })).toBeVisible();
  const sln = page.locator("article").filter({ has: page.getByRole("heading", { name: "Madikeri Estate", exact: true }) });
  await expect(sln).toContainText("79.86 acres");
  await sln.getByRole("link", { name: "Discover the estate", exact: true }).click();
  await expect(page).toHaveURL(/\/estates\/madikeri-estate$/);
  await expect(page.locator("main")).toContainText("Netafim");
  await expect(page.locator("main")).not.toContainText(/₹|ROI|revenue/i);
  await expect(page.locator('main img[src*="supplied%2Fsln"]')).toHaveCount(3);
  await page.goto("/estates/villa-pool-cluster", { waitUntil: "networkidle" });
  await expect(page.locator("main")).toContainText("has not yet been confirmed against this exact villa");
  await page.goto("/estates/12-acre-villa", { waitUntil: "networkidle" });
  await expect(page.locator("main")).toContainText("12 acres");
  await expect(page.locator("main img")).toHaveCount(0);
});

test("legacy collection URLs reach the new pages and Home is only active at root", async ({ page }) => {
  for (const [before, after] of [["/farm-management", "/managed-farmlands"], ["/farm-management/arkha-sanctuary", "/managed-farmlands/arkha-sanctuary"], ["/estates/star-woods-estate", "/managed-farmlands/star-woods-estate"], ["/land-and-living", "/gallery"]]) {
    await page.goto(before, { waitUntil: "networkidle" });
    expect(new URL(page.url()).pathname).toBe(after);
    await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Home", exact: true })).not.toHaveAttribute("aria-current", "page");
  }
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
});

test("gallery opens supplied photographs and has twelve captioned images", async ({ page }) => {
  await page.goto("/gallery", { waitUntil: "networkidle" });
  const figures = page.locator("main figure");
  await expect(figures).toHaveCount(12);
  for (const figure of await figures.all()) {
    await expect(figure.locator("figcaption")).not.toBeEmpty();
    const src = await figure.getByRole("link").getAttribute("href");
    expect(src).toMatch(/^\/images\/coorg\/supplied\/.*\.webp$/);
    expect((await page.request.get(src!)).ok()).toBe(true);
  }
  await expect(page.locator('main a[href$="avocado-a.webp"]')).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/PDF|brochure|supplied|AI-generated/i);
});

test("mobile status badges stay inside the card frame throughout its scroll reveal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/managed-farmlands", { waitUntil: "networkidle" });
  const card = page.locator("#completed-projects article").first();
  const link = card.getByRole("link", { name: "Explore Star Woods Estate", exact: true });
  const badge = link.getByText("Completed", { exact: true });
  const top = await link.evaluate((node) => node.getBoundingClientRect().top + scrollY);
  for (const offset of [650, 450, 120]) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top - offset);
    await page.waitForTimeout(900);
    const frame = (await link.boundingBox())!;
    for (const tag of [badge, link.getByText("Sold out", { exact: true })]) {
      const bounds = (await tag.boundingBox())!;
      expect(bounds.y - frame.y).toBeGreaterThanOrEqual(13);
      expect(bounds.y - frame.y).toBeLessThanOrEqual(24);
      expect(bounds.x).toBeGreaterThan(frame.x);
      expect(bounds.x + bounds.width).toBeLessThan(frame.x + frame.width);
      expect(await tag.evaluate((node) => {
        for (let parent = node.parentElement; parent && parent.tagName !== "ARTICLE"; parent = parent.parentElement) {
          if (getComputedStyle(parent).clipPath !== "none") return false;
        }
        return true;
      })).toBe(true);
    }
  }
});

test("hero composition stays centred and complete on short and narrow screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[1600, 700], [1366, 650], [1024, 768], [390, 844], [360, 740]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/", { waitUntil: "networkidle" });
    const hero = (await page.locator(".coorg-hero").boundingBox())!;
    const heading = (await page.locator(".hero-heading-depth").boundingBox())!;
    const support = (await page.locator(".hero-support").boundingBox())!;
    const bottom = (await page.locator(".hero-bottom").boundingBox())!;
    const header = (await page.locator("header").boundingBox())!;
    expect(heading.y).toBeGreaterThan(header.height);
    expect(Math.abs(heading.x + heading.width / 2 - width / 2)).toBeLessThan(2);
    expect(Math.abs(support.x + support.width / 2 - width / 2)).toBeLessThan(2);
    expect(support.y).toBeGreaterThan(heading.y + heading.height);
    expect(support.y + support.height).toBeLessThan(bottom.y);
    expect(bottom.y + bottom.height).toBeLessThanOrEqual(hero.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

import { test, expect } from "@playwright/test";

const estateNames = ["Star Woods Estate", "Star Coffee County", "Star Misty Acres"];

test("completed estates retain their source status and connect to project details", async ({ page }) => {
  await page.goto("/managed-farmlands", { waitUntil: "networkidle" });
  const projects = page.locator("#completed-projects article");
  await expect(projects).toHaveCount(3);
  for (const name of estateNames) {
    const card = projects.filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(card.getByText("Completed", { exact: true })).toBeVisible();
    await expect(card.getByText("Sold out", { exact: true })).toHaveCount(2);
  }
  await expect(page.getByText("Sold out", { exact: true })).toHaveCount(6);
  await projects.first().getByRole("link", { name: "Discover the estate", exact: true }).click();
  await expect(page).toHaveURL(/\/managed-farmlands\/star-woods-estate$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Managed Farmlands", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.locator("h1")).toContainText("Star Woods");
  const paths = await page.locator("img").evaluateAll((images) => images.map((image) => image.getAttribute("src")!));
  for (const path of paths) expect((await page.request.get(path)).ok()).toBe(true);
});

test("ongoing project keeps its actual city and starting price stays in the hero", async ({ page }) => {
  await page.goto("/managed-farmlands", { waitUntil: "networkidle" });
  await expect(page.locator("[data-chapter-hero]")).toContainText("Starting from₹999 per sq ft");
  const project = page.locator("#ongoing-projects article");
  await expect(project.getByRole("heading", { name: "Arkha Sanctuary" })).toHaveCount(1);
  await expect(project.getByText("Ongoing", { exact: true })).toBeVisible();
  await expect(project).toContainText("Bengaluru");
  await expect(project).not.toContainText("₹999");
  await expect(project).not.toContainText("Coorg estate");
  await project.getByRole("link", { name: "Explore the project", exact: true }).click();
  await expect(page).toHaveURL(/\/managed-farmlands\/arkha-sanctuary$/);
  await expect(page.locator("h1")).toContainText("Arkha");
});

test("project pages remain readable at mobile size with reduced motion and reject unknown slugs", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const media: string[] = [];
  page.on("request", (request) => { if (/\.(mp4|webm)(?:\?|$)/.test(request.url())) media.push(request.url()); });
  for (const route of ["/estates", "/managed-farmlands", "/managed-farmlands/star-misty-acres", "/managed-farmlands/arkha-sanctuary", "/estates/sln-plantations", "/estates/12-acre-villa", "/gallery"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    expect(await page.locator("[data-chapter-word]").evaluateAll((words) => words.every((word) => getComputedStyle(word).opacity === "1"))).toBe(true);
  }
  expect(errors).toEqual([]);
  expect(media).toEqual([]);
  const missing = await page.goto("/estates/unknown-estate");
  expect(missing?.status()).toBe(404);
});

test("Managed Farmlands heading and price stay inside the hero at wide and short viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[1920, 900], [1440, 800], [1024, 768], [390, 667]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/managed-farmlands", { waitUntil: "networkidle" });
    const heading = await page.locator("h1").boundingBox();
    const header = await page.locator("header").boundingBox();
    const hero = await page.locator("[data-chapter-hero]").boundingBox();
    const price = await page.locator("[data-chapter-hero] strong").boundingBox();
    expect(heading!.y).toBeGreaterThan(header!.y + header!.height);
    expect(price!.y + price!.height).toBeLessThan(hero!.y + hero!.height - 75);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

test("company icons and custom sharing cards resolve with correct metadata", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const url = await page.locator(selector).getAttribute("content");
    const path = new URL(url!).pathname;
    const response = await page.request.get(path);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  const iconPaths = await page.locator('link[rel="icon"],link[rel="apple-touch-icon"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  expect(iconPaths.length).toBeGreaterThanOrEqual(4);
  for (const path of iconPaths) expect((await page.request.get(path)).ok()).toBe(true);
  const logo = page.locator('header img[alt="Company logo"]');
  expect(await logo.evaluate((image) => getComputedStyle(image.parentElement!).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
});

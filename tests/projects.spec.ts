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

test("Star Garden leads the ongoing collection with its concept image and qualified project details", async ({ page }) => {
  await page.goto("/managed-farmlands", { waitUntil: "networkidle" });
  await expect(page.locator("[data-chapter-hero]")).toContainText("Starting from₹999 per sq ft");
  expect(await page.locator("#ongoing-projects, #completed-projects").evaluateAll((sections) => sections.map((section) => section.id))).toEqual(["ongoing-projects", "completed-projects"]);
  await expect(page.getByRole("navigation", { name: "Project collections" }).getByRole("link").first()).toHaveAttribute("href", "#ongoing-projects");
  const project = page.locator("#ongoing-projects article");
  await expect(project).toHaveCount(1);
  await expect(project.getByRole("heading", { name: "Star Garden", exact: true })).toBeVisible();
  await expect(project.getByText("Ongoing", { exact: true })).toBeVisible();
  await expect(project).toContainText("Madikeri");
  await expect(project).toContainText("10 acres");
  await expect(project.getByText(/AI-generated concept image/i)).toBeVisible();
  await expect(project).not.toContainText("₹999");
  await expect(page.locator("main")).not.toContainText("Arkha");
  await expect(page.locator('a[href*="arkha-sanctuary"]')).toHaveCount(0);
  await project.getByRole("link", { name: "Explore the project", exact: true }).click();
  await expect(page).toHaveURL(/\/managed-farmlands\/star-garden$/);
  await expect(page.locator("h1")).toHaveText(/Star\s*Garden/);
  await expect(page.locator("[data-chapter-hero]").getByText(/AI-generated concept image/i)).toBeVisible();

  const highlights = page.getByRole("region", { name: "Project Highlights", exact: true });
  for (const fact of [/Total area\s*:?\s*10 acres/, /Total plots\s*:?\s*30/, /Premium stream-attached plots\s*:?\s*9/, /Plots sold\s*:?\s*12/, /All internal roads developed with CC roads/, /Partition registration facility available/, /LAP loan.*subject to lender eligibility and approval/]) {
    await expect(highlights).toContainText(fact);
  }
  const amenities = page.getByRole("region", { name: "Premium Amenities", exact: true });
  for (const amenity of [/5,500 sq\. ft\. clubhouse/i, /Community kitchen/, /Dining hall/, /Swimming pool/, /Dense plantation/, /Natural coffee estate surroundings/]) {
    await expect(amenities).toContainText(amenity);
  }
  const location = page.getByRole("region", { name: "Strategic Location", exact: true });
  for (const distance of [/NH 274\s*:?\s*700 metres/, /Madikeri\s*:?\s*9 km/, /Mysore\s*:?\s*110 km/, /Bengaluru\s*:?\s*220 km/]) {
    await expect(location).toContainText(distance);
  }
  const investment = page.getByRole("region", { name: "Investment Potential", exact: true });
  for (const condition of [
    /approximately ₹50,000 per annum.*subject to production and market conditions/i,
    /4BHK villa.*reputed construction partner/,
    /Land investment\s*:?\s*₹1 crore/,
    /Villa construction investment\s*:?\s*₹1 crore/,
    /Approximately 18 months.*subject to occupancy, rental income, market conditions, and project performance/i,
    /All income and ROI figures are projections and are not guaranteed\./,
    /Final returns may vary based on market conditions, operating costs, approvals, construction expenses, and actual revenue\./,
  ]) {
    await expect(investment).toContainText(condition);
  }
  const image = page.locator("[data-chapter-hero] img");
  await expect(image).toHaveCount(1);
  expect((await page.request.get((await image.getAttribute("src"))!)).ok()).toBe(true);
});

test("project pages remain readable at mobile size with reduced motion and reject unknown slugs", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const media: string[] = [];
  page.on("request", (request) => { if (/\.(mp4|webm)(?:\?|$)/.test(request.url())) media.push(request.url()); });
  for (const route of ["/estates", "/managed-farmlands", "/managed-farmlands/star-misty-acres", "/managed-farmlands/star-garden", "/estates/sln-plantations", "/estates/12-acre-villa", "/gallery"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    expect(await page.locator("[data-chapter-word]").evaluateAll((words) => words.every((word) => getComputedStyle(word).opacity === "1"))).toBe(true);
  }
  expect(errors).toEqual([]);
  expect(media).toEqual([]);
  for (const route of ["/estates/unknown-estate", "/managed-farmlands/arkha-sanctuary", "/farm-management/arkha-sanctuary"]) {
    const missing = await page.goto(route);
    expect(missing?.status()).toBe(404);
  }
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

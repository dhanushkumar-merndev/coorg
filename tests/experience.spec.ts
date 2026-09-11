import { test, expect } from "@playwright/test";

const worlds = ["Plantation Estates", "Private Hill Retreats", "Curated Estate Plots", "Forest & Mountain Land", "Countryside Homes"];
let errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/", { waitUntil: "networkidle" });
});
test.afterEach(() => { expect(errors, "No JavaScript or hydration errors").toEqual([]); });

test("semantic page, five worlds and complete still-image paths", async ({ page }) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("COORG");
  await expect(page.locator("[data-world-id]")).toHaveCount(5);
  await expect(page.locator("video")).toHaveCount(0);
  for (const title of worlds) await expect(page.locator("[data-world-id]", { hasText: title })).toHaveCount(1);
  const paths = await page.locator("img").evaluateAll((images) => images.map((image) => image.getAttribute("src")!));
  for (const path of [...new Set(paths)]) expect((await page.request.get(path)).ok()).toBeTruthy();
});

test("carousel wraps, supports keyboard and shows arrows only at the centre", async ({ page }) => {
  await page.getByRole("link", { name: "SCROLL TO DISCOVER", exact: true }).click();
  const next = page.getByRole("button", { name: "Next Coorg world" });
  for (let i = 1; i <= 5; i++) {
    await next.click();
    await expect(page.getByRole("link", { name: `Explore ${worlds[i % 5]}`, exact: true })).toBeVisible();
  }
  await next.press("End");
  await expect(page.getByRole("link", { name: "Explore Countryside Homes", exact: true })).toBeVisible();
  await next.press("ArrowRight");
  await expect(page.getByRole("link", { name: "Explore Plantation Estates", exact: true })).toBeVisible();
  const centre = page.getByRole("link", { name: "Explore Plantation Estates", exact: true });
  await expect(centre.locator("[data-card-arrow]")).toHaveCount(2);
  for (const title of worlds.slice(1)) await expect(page.getByRole("link", { name: `Explore ${title}`, exact: true }).locator("[data-card-arrow]")).toHaveCount(0);
});

test("a side card expands into a modal and returns without a duplicate image", async ({ page }) => {
  await page.getByRole("link", { name: "SCROLL TO DISCOVER", exact: true }).click();
  await page.getByRole("button", { name: "Next Coorg world" }).press("End");
  const plantation = page.getByRole("link", { name: "Explore Plantation Estates", exact: true });
  await plantation.click();
  const detail = page.getByRole("dialog");
  await expect(detail).toBeVisible();
  await expect(page).toHaveURL(/\/#opportunities$/);
  await expect(page.locator('[data-world-id="plantation-estates"]')).not.toBeVisible();
  await expect(detail.locator("img")).toHaveCount(1);
  await page.getByRole("button", { name: "Close world details" }).click();
  await expect(detail).toHaveCount(0);
  await expect(plantation).toBeVisible();
  await expect(plantation).toBeFocused();
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await plantation.click();
  await expect(detail).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(detail).toHaveCount(0);
});

test("horizontal gestures rotate cards; vertical scroll continues down the page", async ({ page }) => {
  await page.getByRole("link", { name: "SCROLL TO DISCOVER", exact: true }).click();
  const active = page.getByRole("link", { name: "Explore Plantation Estates", exact: true });
  await active.hover();
  await page.mouse.wheel(250, 0);
  await expect(page.getByRole("link", { name: "Explore Private Hill Retreats", exact: true })).toBeVisible();
  const y = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 420);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 100);
});

test("dragging a card rotates without accidentally navigating", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: "SCROLL TO DISCOVER", exact: true }).click();
  const active = page.getByRole("link", { name: "Explore Plantation Estates", exact: true });
  await active.scrollIntoViewIfNeeded();
  const box = await active.boundingBox();
  expect(box).not.toBeNull();
  const startX = box!.x + box!.width * 0.7;
  const startY = box!.y + box!.height * 0.45;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX - 130, startY, { steps: 18 });
  await page.mouse.up();
  const next = page.getByRole("link", { name: "Explore Private Hill Retreats", exact: true });
  await expect(next).toBeVisible();
  await page.waitForTimeout(700);
  await expect(page).toHaveURL(/\/#opportunities$/);
  await next.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/\/#opportunities$/);
});

test("enquiry creates a real local download and never submits personal details", async ({ page }) => {
  await page.getByRole("link", { name: "Enquire Privately", exact: true }).first().click();
  await expect(page).toHaveURL(/\/enquiry$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await expect(page.getByLabel("Your name")).toBeVisible();
  await page.getByLabel("Your name").fill("Coorg Visitor");
  await page.getByLabel("Email or phone").fill("visitor@example.com");
  await page.getByRole("combobox", { name: /What draws you here/ }).click();
  await page.getByRole("option", { name: "Countryside Homes" }).click();
  const mutations: string[] = [];
  page.on("request", (request) => { if (request.method() === "POST") mutations.push(request.url()); });
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download my brief" }).click();
  expect((await download).suggestedFilename()).toBe("land-in-coorg-enquiry.txt");
  await expect(page.getByRole("status").filter({ hasText: "No details have been sent" })).toBeVisible();
  expect(mutations).toEqual([]);
});

test("responsive layouts and reduced motion remain accessible without hydration changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
});

test("hero handoff scrolls continuously without a pinned blank interval", async ({ page }) => {
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.evaluate(() => scrollTo({ top: 1200, behavior: "instant" }));
  await expect(page.getByRole("heading", { name: "Find your own kind of quiet." })).toBeInViewport();
});

test("modal enquiry uses fog navigation and releases background focus locks", async ({ page }) => {
  await page.getByRole("link", { name: "SCROLL TO DISCOVER", exact: true }).click();
  await page.getByRole("link", { name: "Explore Plantation Estates", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Enquire about this world" }).click();
  await expect(page).toHaveURL(/\/enquiry$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await page.locator("main").evaluate((main) => (main as HTMLElement).inert)).toBe(false);
  await expect(page.locator("h1")).toBeFocused();
  await page.getByLabel("Your name").fill("Coorg Visitor");
});

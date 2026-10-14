import { test, expect, type Page } from "@playwright/test";

async function openInventory(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/live-inventory", { waitUntil: "networkidle" });
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
}

test("plot suggestions rotate after 30 seconds for Cancel and 10 seconds for outside clicks", async ({ page }) => {
  await openInventory(page);
  const popup = page.getByRole("region", { name: "Plot suggestion", exact: true });
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(10_000);
  await expect(popup).toBeVisible();
  await expect(popup.getByRole("button", { name: "View P01", exact: true })).toBeVisible();
  const first = await popup.innerText();
  await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(29_999);
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(1);
  await expect(popup).toBeVisible();
  expect(await popup.innerText()).not.toBe(first);
  await expect(popup.getByRole("button", { name: "View P29", exact: true })).toBeVisible();
  await page.locator("h1").click();
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(9_999);
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(1);
  await expect(popup).toBeVisible();
  await expect(popup.getByRole("link")).toHaveAttribute("href", /^https:\/\/wa.me\//);
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(29_999);
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(1);
  await expect(popup.getByRole("button", { name: "View P01", exact: true })).toBeVisible();
});

test("suggestions preserve focus and pause during plot details", async ({ page }) => {
  await openInventory(page);
  const picker = page.getByLabel("Find a plot", { exact: true });
  await picker.focus();
  await page.clock.fastForward(10_000);
  const popup = page.getByRole("region", { name: "Plot suggestion", exact: true });
  await expect(picker).toBeFocused();
  await popup.getByRole("button", { name: "View P01", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Plot P01 details" })).toBeVisible();
  await page.clock.fastForward(60_000);
  await expect(popup).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.clock.fastForward(1000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(popup).toHaveCount(0);
  await page.clock.fastForward(10_000);
  await expect(popup.getByRole("button", { name: "View P29", exact: true })).toBeVisible();
});

test("mobile live indicator and suggestion fit the map and stop on another page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openInventory(page);
  await expect(page.getByRole("img", { name: "Live interactive map" })).toBeVisible();
  await page.clock.fastForward(10_000);
  const popup = page.getByRole("region", { name: "Plot suggestion", exact: true });
  await expect(popup).toBeVisible();
  const box = (await popup.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(12);
  expect(box.x + box.width).toBeLessThanOrEqual(378);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.goto("/about");
  await page.clock.fastForward(60_000);
  await expect(popup).toHaveCount(0);
});

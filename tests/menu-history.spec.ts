import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });

test("browser history closes an open mobile menu and restores scrolling", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const openMenu = page.getByRole("button", { name: "Open navigation" });
  await openMenu.click();
  await page.getByRole("dialog", { name: "Navigation" }).getByRole("link", { name: /Gallery/ }).click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");

  await openMenu.click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog", { name: "Navigation" })).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);

  await openMenu.click();
  await page.goForward();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.getByRole("dialog", { name: "Navigation" })).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
});

test("switching to desktop closes the mobile menu and restores navigation", async ({ page }) => {
  await page.goto("/gallery", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole("dialog", { name: "Navigation" })).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

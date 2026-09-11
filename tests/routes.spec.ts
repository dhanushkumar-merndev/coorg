import { test, expect } from "@playwright/test";

const routes = ["/opportunities", "/plantations", "/estates", "/about-coorg", "/enquiry"];
const worlds = ["plantation-estates", "private-hill-retreats", "curated-estate-plots", "forest-mountain-land", "countryside-homes"];

test("every chapter and world supports direct loading with its own content", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const headings = new Set<string>();
  for (const route of [...routes, ...worlds.map((world) => `/opportunities/${world}`)]) {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    headings.add(await page.locator("h1").innerText());
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
    await expect(page.locator("video")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(headings.size).toBe(10);
  expect(errors).toEqual([]);
});

test("fog covers before navigation, releases focus and supports history", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.getByRole("link", { name: "Plantations", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-page-transition", "covering");
  expect(new URL(page.url()).pathname).toBe("/");
  await expect(page).toHaveURL(/\/plantations$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await expect(page.locator("h1")).toBeFocused();
  await expect(nav.getByRole("link", { name: "Plantations", exact: true })).toHaveAttribute("aria-current", "page");
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await nav.getByRole("link", { name: "Estates", exact: true }).click();
  await expect(page).toHaveURL(/\/estates$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await page.goBack();
  await expect(page).toHaveURL(/\/plantations$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await page.goForward();
  await expect(page).toHaveURL(/\/estates$/);
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
});

test("mobile reduced-motion navigation closes the menu and leaves pages usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("dialog", { name: "Navigation" }).getByRole("link", { name: /About Coorg/ }).click();
  await expect(page).toHaveURL(/\/about-coorg$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  for (const route of routes) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  }
});

test("custom enquiry dropdown supports keyboard selection and Escape", async ({ page }) => {
  await page.goto("/enquiry", { waitUntil: "networkidle" });
  const select = page.getByRole("combobox", { name: /What draws you here/ });
  await select.focus();
  await select.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await select.press("End");
  await select.press("Enter");
  await expect(select).toContainText("Countryside Homes");
  await expect(page.locator('input[name="interest"]')).toHaveValue("Countryside Homes");
  await select.press("Enter");
  await select.press("Home");
  await select.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(select).toContainText("Countryside Homes");
  await expect(select).toBeFocused();
  await select.press("Tab");
  await expect(page.getByLabel(/A little more/)).toBeFocused();
});

test("browser Back restores the previous chapter scroll position with motion enabled", async ({ page }) => {
  await page.goto("/plantations", { waitUntil: "networkidle" });
  await page.evaluate(() => scrollTo({ top: 900, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(900);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Estates", exact: true }).click();
  await expect(page).toHaveURL(/\/estates$/);
  await expect(page.locator("[data-page-fog]")).toHaveAttribute("data-phase", "idle");
  await page.goBack();
  await expect(page).toHaveURL(/\/plantations$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(900);
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => scrollY)).toBe(900);
});

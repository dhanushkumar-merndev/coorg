import { test, expect } from "@playwright/test";
import { getDisplayStatuses, recordDemoVisit } from "../src/data/inventory";

test("demo visit sampling shows one partial example per ten visits and never changes real mode", () => {
  let stored: string | null = null;
  const storage = { getItem: () => stored, setItem: (_key: string, value: string) => { stored = value; } };
  const samples = Array.from({ length: 20 }, () => recordDemoVisit(storage, () => 0.5));
  expect(samples.map((id, index) => id ? index + 1 : null).filter(Boolean)).toEqual([6, 16]);
  for (const id of samples) {
    const demo = Object.values(getDisplayStatuses(true, id));
    expect(demo.filter(status => status === "sold")).toHaveLength(2);
    expect(demo.filter(status => status === "partial")).toHaveLength(id ? 1 : 0);
    expect(Object.values(getDisplayStatuses(false, id)).every(status => status === "unconfirmed")).toBe(true);
  }
});

test("demo visit sampling recovers corrupt storage and tolerates denied storage", () => {
  let stored = "{broken json";
  const storage = { getItem: () => stored, setItem: (_key: string, value: string) => { stored = value; } };
  expect(recordDemoVisit(storage, () => 0)).toBe("P01");
  expect(recordDemoVisit(storage, () => 0)).toBeNull();
  expect(recordDemoVisit({ getItem: () => { throw new Error("denied"); }, setItem: () => {} })).toBeNull();
});

test("inventory plan exposes all source plots and keyboard-selected facts", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await page.goto("/live-inventory");
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("Star Gardens");
  await expect(page.locator("[data-plan-plot]")).toHaveCount(46);
  const plot = page.locator('[data-plan-plot="P01"]');
  await plot.focus();
  await plot.press("Enter");
  const details = page.getByRole("dialog", { name: "Plot P01 details" });
  await expect(details).toContainText("8,702");
  await expect(details).toContainText("To be confirmed");
  await expect(details.getByRole("link", { name: /Enquire about P01/ })).toHaveAttribute("href", /P01/);
  await page.keyboard.press("Escape");
  await expect(page.getByText("Demo availability", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Plot details" })).toHaveCount(0);
  await expect(page.locator("[data-plot-list]")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Original PDF|source plan/ })).toHaveCount(0);
});

test("mobile plot drawer closes with Escape and restores focus without loading 3D", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/live-inventory");
  await expect(page.locator("[data-inventory-view] canvas")).toHaveCount(0);
  const plot = page.locator('[data-plan-plot="P01"]');
  await plot.focus();
  await plot.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Plot P01 details" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("8,702");
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(plot).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(errors).toEqual([]);
});

test("desktop 3D supports hover and a centred click-to-open modal", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/live-inventory", { waitUntil: "networkidle" });
  const canvas = page.locator("[data-inventory-view] canvas");
  await expect(canvas).toBeVisible();
  const bounds = (await canvas.boundingBox())!;
  expect(bounds.width).toBeGreaterThan(1350);
  let hit: { x: number; y: number } | null = null;
  for (let row = 2; row < 9 && !hit; row++) {
    for (let column = 2; column < 9 && !hit; column++) {
      const point = { x: bounds.x + bounds.width * column / 10, y: bounds.y + bounds.height * row / 10 };
      await page.mouse.move(point.x, point.y);
      if (await page.locator("[data-plot-hover]").count()) hit = point;
    }
  }
  expect(hit).not.toBeNull();
  const id = await page.locator("[data-plot-hover]").getAttribute("data-plot-hover");
  await page.mouse.click(hit!.x, hit!.y);
  const modal = page.getByRole("dialog", { name: `Plot ${id} details` });
  await expect(modal).toBeVisible();
  await expect(modal.getByRole("heading")).toHaveText(`Plot ${id}`);
  const box = (await modal.boundingBox())!;
  expect(box.width).toBeLessThan(600);
  expect(Math.abs(box.x + box.width / 2 - 720)).toBeLessThan(10);
  await page.keyboard.press("Escape");
  await expect(modal).toHaveCount(0);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await page.getByRole("button", { name: "2D plan", exact: true }).click();
  await expect(canvas).toHaveCount(0);
  await expect(page.locator("[data-plan-plot]")).toHaveCount(46);
  expect(errors).toEqual([]);
});

test("unsupported WebGL falls back and plot picker opens verified source facts", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (kind.startsWith("webgl")) return null;
      return getContext.apply(this, [kind, ...args] as Parameters<typeof getContext>);
    } as typeof getContext;
  });
  await page.goto("/live-inventory");
  await expect(page.locator("[data-inventory-view]")).toHaveAttribute("data-inventory-view", "plan");
  await expect(page.getByText("3D unavailable · interactive 2D plan")).toBeVisible();
  await page.getByLabel("Find a plot", { exact: true }).focus();
  await page.getByLabel("Find a plot", { exact: true }).selectOption("P12");
  const modal = page.getByRole("dialog", { name: "Plot P12 details" });
  await expect(modal).toBeVisible();
  await expect(modal).toContainText("Sold out · demo");
  await expect(modal).toContainText("To be confirmed");
  await page.getByRole("button", { name: "Close plot details" }).click();
  await expect(modal).toHaveCount(0);
  await expect(page.getByLabel("Find a plot", { exact: true })).toBeFocused();
});

test("a plot can be selected on the first click after panning and zooming out", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/live-inventory");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const map = (await page.getByLabel("Interactive Star Gardens plot plan").boundingBox())!;
  await page.mouse.move(map.x + map.width / 2, map.y + map.height / 2);
  await page.mouse.down();
  await page.mouse.move(map.x + map.width / 2 + 60, map.y + map.height / 2 + 35, { steps: 5 });
  await page.mouse.up();
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  await page.locator('[data-plan-plot="P01"] text').click();
  await expect(page.getByRole("dialog", { name: "Plot P01 details" }).getByRole("heading")).toHaveText("Plot P01");
});

test("closing details after a mobile-to-desktop resize restores focus to the plot picker", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/live-inventory");
  const plot = page.locator('[data-plan-plot="P01"]');
  await plot.focus();
  await plot.press("Enter");
  await expect(page.getByRole("dialog", { name: "Plot P01 details" })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator("[data-inventory-view] canvas")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByLabel("Find a plot", { exact: true })).toBeFocused();
});

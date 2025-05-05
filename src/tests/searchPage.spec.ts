import { test, expect } from "@playwright/test";

test.describe("Weather Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/Search");
  });

  test("Page loads with search input and button", async ({ page }) => {
    await expect(page.getByTestId("search-input")).toBeVisible();
    await expect(page.getByTestId("search-button")).toBeVisible();
  });

  test("Can type into input field", async ({ page }) => {
    const input = page.getByTestId("search-input");
    await input.fill("London");
    await expect(input).toHaveValue("London");
  });

  test("Fetches and displays weather data for valid city", async ({ page }) => {
    await page.getByTestId("search-input").fill("Tokyo");
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes("weatherapi") && resp.status() === 200
      ),
      page.getByTestId("search-button").click(),
    ]);

    await expect(page.getByText(/Temperature/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Condition/i)).toBeVisible();
    await expect(page.getByText(/Humidity/i)).toBeVisible();
    await expect(page.getByText(/Wind/i)).toBeVisible();
  });

  test("Shows error on invalid city", async ({ page }) => {
    await page.getByTestId("search-input").fill("InvalidCityXYZ");
    await page.getByTestId("search-button").click();

    await expect(page.getByText("City not found")).toBeVisible({
      timeout: 5000,
    });
  });

  test("Shows loading text during fetch", async ({ page }) => {
    await page.getByTestId("search-input").fill("Tokyo");
    await page.getByTestId("search-button").click();

    await expect(page.getByTestId("loading")).toBeVisible();
  });
});

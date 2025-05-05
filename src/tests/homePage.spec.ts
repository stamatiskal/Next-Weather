import { test, expect } from "@playwright/test";

test("homepage has title and button", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(/Welcome to the Weather App/i);
  await expect(page.locator("p")).toHaveText(
    /Discover real-time weather information for any city in the world./i
  );
});

test("clicking button goes to search page", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Get Started");
  await expect(page).toHaveURL("http://localhost:3000/Search");
});

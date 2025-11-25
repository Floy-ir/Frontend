import { expect, test } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  await expect(page).toHaveTitle(/فلوی | مقایسه بلیط هواپیما/)
})

import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { ProductsPage } from "../../pages/products.page";
import { handleAds, handleGDPR } from "../../utils/ads.handler";

test.describe("Automation Exercise - Products and Search Tests", () => {
  let basePage: BasePage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();

    basePage = new BasePage(page);
    productsPage = new ProductsPage(page);
  });

  test("Test Case 8: Verify All Products and product detail page", async ({ page }) => {
    await basePage.clickProducts();

    await expect(page).toHaveURL(/.*products/);
    await expect(page.getByText(/ALL PRODUCTS/i).first()).toBeVisible();

    await expect(productsPage.productItems.first()).toBeVisible();

    await page.locator('a[href="/product_details/1"]').click();

    await expect(page).toHaveURL(/.*product_details\/1/);

    await expect(page.locator(".product-information h2")).toBeVisible(); // Product Name
    await expect(page.getByText(/Category:/i)).toBeVisible();
    await expect(page.locator(".product-information span span")).toBeVisible(); // Price
    await expect(page.getByText(/Availability:/i)).toBeVisible();
    await expect(page.getByText(/Condition:/i)).toBeVisible();
    await expect(page.getByText(/Brand:/i)).toBeVisible();
  });

  test("Test Case 9: Search Product", async ({ page }) => {
    await basePage.clickProducts();
    await expect(page).toHaveURL(/.*products/);

    const searchString = "Blue Top";
    await productsPage.searchProduct(searchString);
    await expect(page.getByText(/SEARCHED PRODUCTS/i)).toBeVisible();

    const firstProductText = await productsPage.productItems.first().innerText();
    expect(firstProductText.toLowerCase()).toContain(searchString.toLowerCase());
  });

  test("Test Case 18: View Category Products", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /category/i })).toBeVisible();

    await page.locator('a[href="#Women"]').click();
    await page.getByRole("link", { name: /dress/i }).click();
    await expect(page.getByRole("heading", { name: /Women - Dress Products/i })).toBeVisible();

    await page.locator('a[href="#Men"]').click();
    await page.getByRole("link", { name: /jeans/i }).click();
    await expect(page.getByRole("heading", { name: /MEN - JEANS PRODUCTS/i })).toBeVisible();
  });

  test("Test Case 19: View & Cart Brand Products", async ({ page }) => {
    await basePage.clickProducts();
    await expect(page.getByRole("heading", { name: /brands/i })).toBeVisible();

    await page.locator('a[href="/brand_products/Polo"]').click();
    await expect(page).toHaveURL(/.*brand_products\/polo/i);
    await expect(page.getByRole("heading", { name: /Brand - Polo Products/i })).toBeVisible();

    await page.locator('a[href="/brand_products/H&M"]').click();
    await expect(page).toHaveURL(/.*brand_products\/h&m/i);
    await expect(page.getByRole("heading", { name: /Brand - H&M Products/i })).toBeVisible();
  });

  test.only("Test Case 21: Add review on product", async ({ page }) => {
    await basePage.clickProducts();
    await expect(page).toHaveURL(/.*products/);
    await page
      .getByRole("link", { name: /view product/i })
      .first()
      .click();
    await expect(page.getByText(/Write Your Review/i)).toBeVisible();

    await page.locator("input#name").fill("automation");
    await page.locator("input#email").fill("automation@mail.com");
    await page.locator("textarea#review").fill("Review of product");
    await page.getByRole("button", { name: /submit/i }).click();

    await expect(page.getByText(/Thank you for your review./i)).toBeVisible();
  });
});

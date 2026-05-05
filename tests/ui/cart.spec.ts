import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { CartPage } from "../../pages/cart.page";
import { ProductsPage } from "../../pages/products.page";
import { handleAds, handleGDPR } from "../../utils/ads.handler";

test.describe("Cart tests", () => {
  let basePage: BasePage;
  let cartPage: CartPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();

    basePage = new BasePage(page);
    cartPage = new CartPage(page);
    productsPage = new ProductsPage(page);
  });

  test("Test Case 12: Add Products in Cart", async () => {
    await basePage.clickProducts();

    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();

    await productsPage.addProductToCart(2);
    await productsPage.continueShopping();

    await basePage.clickCart();

    await expect(cartPage.productRow(1)).toBeVisible();
    await expect(cartPage.productRow(2)).toBeVisible();
    await expect(cartPage.productQuantity(1)).toHaveText("1");
    await expect(cartPage.productQuantity(2)).toHaveText("1");
  });

  test("Test Case 13: Verify Product quantity in Cart", async ({ page }) => {
    await page.locator('a[href="/product_details/1"]').click();

    await page.locator("#quantity").fill("4");
    await page.locator("button.cart").click();
    await productsPage.continueShopping();
    await basePage.clickCart();

    await expect(cartPage.productQuantity(1)).toHaveText("4");
  });

  test("Test Case 17: Remove Products From Cart", async ({ page }) => {
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();
    await basePage.clickCart();

    await expect(cartPage.productRow(1)).toBeVisible();

    await cartPage.productRemove(1).click();

    await expect(page.getByText(/cart is empty/i)).toBeVisible();
  });
});

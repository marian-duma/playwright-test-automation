import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { CartPage } from "../../pages/cart.page";
import { ProductsPage } from "../../pages/products.page";
import { handleAds, handleGDPR } from "../../utils/ads.handler";
import { LoginPage } from "../../pages/login.page";
import { SignupPage } from "../../pages/signup.page";
import { generateUserData, UserData } from "../../utils/user.generator";

test.describe("Cart tests", () => {
  let basePage: BasePage;
  let cartPage: CartPage;
  let productsPage: ProductsPage;
  let loginPage: LoginPage;
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();

    basePage = new BasePage(page);
    cartPage = new CartPage(page);
    productsPage = new ProductsPage(page);
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
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

  test("Test Case 20: Search Products and Verify Cart After Login", async ({ page }) => {
    const userData: UserData = generateUserData();
    await basePage.clickLogin();
    await loginPage.signup(userData.name, userData.email);
    await signupPage.fillAccountDetails(userData);

    await page.getByRole("link", { name: /continue/i }).click();

    await basePage.logout();

    await basePage.clickProducts();
    await expect(page).toHaveURL(/.*products/);
    const searchString = "Blue Top";
    await productsPage.searchProduct(searchString);

    await expect(page.getByText(/SEARCHED PRODUCTS/i)).toBeVisible();

    const searchResults = page.locator(".product-image-wrapper");
    await expect(searchResults.first()).toBeVisible();

    const addToCartButton = searchResults.first().locator(".add-to-cart").first();
    await addToCartButton.click();
    await productsPage.continueShopping();

    await basePage.clickCart();
    await expect(page.getByText(searchString)).toBeVisible();

    await basePage.clickLogin();
    await loginPage.login(userData.email, userData.password);

    await basePage.clickCart();

    await expect(page.getByText(searchString)).toBeVisible();

    await basePage.deleteAccount();
  });

  test("Test Case 22: Add to cart from Recommended items", async ({ page }) => {
    await page.getByText(/recommended items/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/recommended items/i)).toBeVisible();

    await page.locator(".recommended_items .add-to-cart").first().click();

    await page.getByRole("link", { name: /View Cart/i }).click();
    await expect(page.locator(".cart_description")).toBeVisible();
  });
});

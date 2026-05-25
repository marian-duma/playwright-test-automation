import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { LoginPage } from "../../pages/login.page";
import { SignupPage } from "../../pages/signup.page";
import { ProductsPage } from "../../pages/products.page";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { PaymentPage } from "../../pages/payment.page";
import { UsersApi } from "../../api/users.api";
import { ProductsApi } from "../../api/products.api";
import { generateUserData } from "../../utils/user.generator";
import { handleAds, handleGDPR } from "../../utils/ads.handler";

test.describe("UI & API Combined Integration Suite", () => {
  test.beforeEach("Setup", async ({ page }) => {
    await handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();
  });

  test("Test 1: E2E Purchase Flow", async ({ page, request }) => {
    const user = generateUserData();
    const usersApi = new UsersApi(request);

    const createRes = await usersApi.postCreateUser(user);
    expect(createRes.ok()).toBeTruthy();

    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    await basePage.clickLogin();
    await loginPage.login(user.email, user.password);

    await basePage.clickProducts();
    await productsPage.addProductToCart(1);

    await basePage.clickCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("API generated user checkout test.");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentDetails(user.name, "4111111111111", "123", "12", "2028");
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();

    await usersApi.deleteAccount(user.email, user.password);
  });

  test("Test 2: UI Registration Verified via API", async ({ page, request }) => {
    const user = generateUserData();
    const usersApi = new UsersApi(request);

    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);

    await basePage.clickLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);

    const detailRes = await usersApi.getUserDetailByEmail(user.email);
    expect(detailRes.ok()).toBeTruthy();
    const body = await detailRes.json();
    expect(body.user.name).toBe(user.name);
    expect(body.user.email).toBe(user.email);

    await usersApi.deleteAccount(user.email, user.password);
  });

  test("Test 3: Account Deletion Synchronization", async ({ page, request }) => {
    const user = generateUserData();
    const usersApi = new UsersApi(request);

    await usersApi.postCreateUser(user);

    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);

    await basePage.clickLogin();
    await loginPage.login(user.email, user.password);
    await basePage.deleteAccount();
    await expect(page.getByText(/account deleted/i)).toBeVisible();

    const verifyRes = await usersApi.getUserDetailByEmail(user.email);
    const body = await verifyRes.json();

    expect(body.responseCode).toBe(404);
  });

  test("Test 4: Product Search Consistency", async ({ page, request }) => {
    const searchTerm = "Dress";
    const productsApi = new ProductsApi(request);
    const productsPage = new ProductsPage(page);

    const apiRes = await productsApi.postSearchProduct(searchTerm);
    const apiData = await apiRes.json();
    const apiProductCount = apiData.products.length;

    await productsPage.clickProducts();

    await expect(async () => {
      await productsPage.searchProduct(searchTerm);

      await expect(page.getByRole("heading", { name: /searched products/i })).toBeVisible({
        timeout: 1500,
      });
    }).toPass({ timeout: 10000 });

    await expect(productsPage.productItems).toHaveCount(apiProductCount);
  });

  test("Test 5: API Data Validation in UI Cart", async ({ page, request }) => {
    const productsApi = new ProductsApi(request);

    const apiRes = await productsApi.getAllProducts();
    const apiData = await apiRes.json();
    const firstProduct = apiData.products.find((p: any) => p.id === 1);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.clickProducts();
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();
    await productsPage.clickCart();

    const cartPriceText = await cartPage.productPrice(1).innerText();
    expect(cartPriceText).toContain(firstProduct.price);
  });

  test("Test 6: Invalid Login Alignment (UI Error & API Rejection)", async ({ page, request }) => {
    const fakeEmail = "invalid_email@example.com";
    const fakePassword = "WrongPassword123!";

    const usersApi = new UsersApi(request);

    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    await basePage.clickLogin();
    await loginPage.login(fakeEmail, fakePassword);

    await expect(page.getByText(/your email or password is incorrect/i)).toBeVisible();

    const apiRes = await usersApi.postVerifyLogin(fakeEmail, fakePassword);
    const apiBody = await apiRes.json();
    expect(apiBody.responseCode).toBe(404);
  });

  test("Test 7: Unallowed API Methods Reflect No Changes on UI", async ({ page, request }) => {
    const productsApi = new ProductsApi(request);

    const postProductsRes = await productsApi.postAllProducts();
    const putBrandsRes = await productsApi.putBrandsList();

    const postBody = await postProductsRes.json();
    expect(postBody.responseCode).toBe(405);

    const putBody = await putBrandsRes.json();
    expect(putBody.responseCode).toBe(405);

    const productsPage = new ProductsPage(page);

    const productCount = await productsPage.productItems.count();
    expect(productCount).toBeGreaterThan(0);
  });
});

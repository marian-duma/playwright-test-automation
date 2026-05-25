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
import {
  generatePaymentData,
  generateUserData,
  PaymentData,
  UserData,
} from "../../utils/user.generator";
import { handleAds, handleGDPR } from "../../utils/ads.handler";

test.describe("UI & API Combined Integration Suite", () => {
  let basePage: BasePage;
  let loginPage: LoginPage;
  let signupPage: SignupPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;

  let usersApi: UsersApi;
  let productsApi: ProductsApi;

  let userData: UserData;
  let paymentData: PaymentData;

  test.beforeEach("Setup", async ({ page, request }) => {
    await handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();

    basePage = new BasePage(page);
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);

    usersApi = new UsersApi(request);
    productsApi = new ProductsApi(request);

    userData = generateUserData();
    paymentData = generatePaymentData();
  });

  test("Test 1: E2E Purchase Flow", async ({ page }) => {
    const createRes = await usersApi.postCreateUser(userData);
    expect(createRes.ok()).toBeTruthy();

    await basePage.clickLogin();
    await loginPage.login(userData.email, userData.password);

    await basePage.clickProducts();
    await productsPage.addProductToCart(1);

    await basePage.clickCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("API generated userData checkout test.");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentData(paymentData);
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();

    await usersApi.deleteAccount(userData.email, userData.password);
  });

  test("Test 2: UI Registration Verified via API", async () => {
    await basePage.clickLogin();
    await loginPage.signup(userData.name, userData.email);
    await signupPage.fillAccountDetails(userData);

    const detailRes = await usersApi.getUserDetailByEmail(userData.email);
    expect(detailRes.ok()).toBeTruthy();
    const body = await detailRes.json();
    expect(body.userData.name).toBe(userData.name);
    expect(body.userData.email).toBe(userData.email);

    await usersApi.deleteAccount(userData.email, userData.password);
  });

  test("Test 3: Account Deletion Synchronization", async ({ page }) => {
    await usersApi.postCreateUser(userData);

    await basePage.clickLogin();
    await loginPage.login(userData.email, userData.password);
    await basePage.deleteAccount();
    await expect(page.getByText(/account deleted/i)).toBeVisible();

    const verifyRes = await usersApi.getUserDetailByEmail(userData.email);
    const body = await verifyRes.json();

    expect(body.responseCode).toBe(404);
  });

  test("Test 4: Product Search Consistency", async ({ page }) => {
    const searchTerm = "Dress";
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

  test("Test 5: API Data Validation in UI Cart", async () => {
    const apiRes = await productsApi.getAllProducts();
    const apiData = await apiRes.json();
    const firstProduct = apiData.products.find((p: any) => p.id === 1);

    await productsPage.clickProducts();
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();
    await productsPage.clickCart();

    const cartPriceText = await cartPage.productPrice(1).innerText();
    expect(cartPriceText).toContain(firstProduct.price);
  });

  test("Test 6: Invalid Login Alignment (UI Error & API Rejection)", async ({ page }) => {
    await basePage.clickLogin();
    await loginPage.login("invalid_email@example.com", "WrongPassword123!");

    await expect(page.getByText(/your email or password is incorrect/i)).toBeVisible();

    const apiRes = await usersApi.postVerifyLogin("invalid_email@example.com", "WrongPassword123!");
    const apiBody = await apiRes.json();
    expect(apiBody.responseCode).toBe(404);
  });

  test("Test 7: Unallowed API Methods Reflect No Changes on UI", async () => {
    const postProductsRes = await productsApi.postAllProducts();
    const putBrandsRes = await productsApi.putBrandsList();

    const postBody = await postProductsRes.json();
    expect(postBody.responseCode).toBe(405);

    const putBody = await putBrandsRes.json();
    expect(putBody.responseCode).toBe(405);

    const productCount = await productsPage.productItems.count();
    expect(productCount).toBeGreaterThan(0);
  });
});

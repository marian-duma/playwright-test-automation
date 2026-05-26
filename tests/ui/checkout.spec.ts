import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { LoginPage } from "../../pages/login.page";
import { ProductsPage } from "../../pages/products.page";
import { SignupPage } from "../../pages/signup.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { PaymentPage } from "../../pages/payment.page";
import { generatePaymentData, PaymentData, UserData } from "../../utils/user.generator";
import { generateUserData } from "../../utils/user.generator";
import { handleAds, handleGDPR } from "../../utils/ads.handler";

test.describe("Checkout tests", () => {
  let basePage: BasePage;
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let signupPage: SignupPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;

  let userData: UserData;
  let paymentData: PaymentData;

  test.beforeEach(async ({ page }) => {
    await handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();

    basePage = new BasePage(page);
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    signupPage = new SignupPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);

    userData = generateUserData();
    paymentData = generatePaymentData();
  });

  test.afterEach("Cleanup", async ({ page }) => {
    try {
      await basePage.deleteAccount();
      await expect(page.getByText(/account\s*deleted!/i)).toBeVisible();
      await page.getByRole("link", { name: /continue/i }).click();
    } catch (error) {
      console.log("Cleanup: Skipping logout.");
    }
  });

  test("Test Case 14: Place Order: Register while Checkout", async ({ page }) => {
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();
    await basePage.clickCart();

    await checkoutPage.proceedToCheckout();
    await page.getByRole("link", { name: /Register \/ Login/i }).click();

    await loginPage.signup(userData.name, userData.email);
    await signupPage.fillAccountDetails(userData);

    await expect(page.getByText(/account created!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await basePage.clickCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("Test 14");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentData(paymentData);
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
  });

  test("Test Case 15: Place Order: Register before Checkout", async ({ page }) => {
    await basePage.clickLogin();
    await loginPage.signup(userData.name, userData.email);
    await signupPage.fillAccountDetails(userData);

    await expect(page.getByText(/account created!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();

    await basePage.clickCart();

    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("Test 15");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentData(paymentData);
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
  });

  test("Test Case 16: Place Order: Login before Checkout", async ({ page }) => {
    await basePage.clickLogin();
    await loginPage.signup(userData.name, userData.email);
    await signupPage.fillAccountDetails(userData);

    await expect(page.getByText(/account created!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await basePage.logout();

    await basePage.clickLogin();
    await loginPage.login(userData.email, userData.password);
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();

    await basePage.clickCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("Test 16");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentData(paymentData);
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
  });

  test("Test Case 23: Verify address details in checkout page", async ({ page }) => {
    await basePage.clickLogin();

    await loginPage.signup(userData.name, userData.email);
    await signupPage.fillAccountDetails(userData);
    await page.getByRole("link", { name: /continue/i }).click();

    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await basePage.clickProducts();
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();

    await basePage.clickCart();
    await expect(page).toHaveURL(/.*view_cart/);
    await page.getByText(/Proceed To Checkout/i).click();

    const deliveryAddress = page.locator("#address_delivery");
    await expect(deliveryAddress).toContainText(userData.firstName);
    await expect(deliveryAddress).toContainText(userData.lastName);
    await expect(deliveryAddress).toContainText(userData.address);
    await expect(deliveryAddress).toContainText(userData.city);

    const billingAddress = page.locator("#address_invoice");
    await expect(billingAddress).toContainText(userData.firstName);
    await expect(billingAddress).toContainText(userData.lastName);
    await expect(billingAddress).toContainText(userData.address);
    await expect(billingAddress).toContainText(userData.city);
  });

  test("Test Case 24: Download Invoice after purchase order", async ({ page }) => {
    const userData = generateUserData();
    const paymentData = generatePaymentData();

    await basePage.clickProducts();
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();

    await basePage.clickCart();

    await checkoutPage.proceedToCheckout();
    await page.getByRole("link", { name: /Register \/ Login/i }).click();

    await loginPage.signup(userData.name, userData.email);
    await signupPage.fillAccountDetails(userData);
    await page.getByRole("link", { name: /continue/i }).click();

    await basePage.clickCart();
    await checkoutPage.proceedToCheckout();

    await page.locator(".form-control").fill("Test Case 24");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentData(paymentData);
    await paymentPage.confirmPayment();

    await expect(page.getByText(/Order Placed!/i)).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: /Download Invoice/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("invoice.txt");

    await page.getByRole("link", { name: /continue/i }).click();
  });
});

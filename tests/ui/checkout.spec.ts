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

  const user: UserData = generateUserData();
  const paymentData: PaymentData = generatePaymentData();

  test.beforeEach(async ({ page }) => {
    handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();

    basePage = new BasePage(page);
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    signupPage = new SignupPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);
  });
  test.afterEach("Cleanup", async ({ page }) => {
    await basePage.deleteAccount();
    await expect(page.getByText(/account\s*deleted!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
  });

  test("Test Case 14: Place Order: Register while Checkout", async ({ page }) => {
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();
    await basePage.clickCart();

    await checkoutPage.proceedToCheckout();
    await page.getByRole("link", { name: /Register \/ Login/i }).click();

    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);

    await expect(page.getByText(/account created!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await basePage.clickCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("Test 14");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentDetails(
      paymentData.cardName,
      paymentData.cardNumber,
      paymentData.cvv,
      paymentData.expiryMonth,
      paymentData.expiryYear
    );
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
  });

  test("Test Case 15: Place Order: Register before Checkout", async ({ page }) => {
    await basePage.clickLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);

    await expect(page.getByText(/account created!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();

    await basePage.clickCart();

    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("Test 15");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentDetails(
      paymentData.cardName,
      paymentData.cardNumber,
      paymentData.cvv,
      paymentData.expiryMonth,
      paymentData.expiryYear
    );
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
  });

  test("Test Case 16: Place Order: Login before Checkout", async ({ page }) => {
    await basePage.clickLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);

    await expect(page.getByText(/account created!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await basePage.logout();

    await basePage.clickLogin();
    await loginPage.login(user.email, user.password);
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();

    await basePage.clickCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.enterComment("Test 16");
    await checkoutPage.placeOrder();

    await paymentPage.fillPaymentDetails(
      paymentData.cardName,
      paymentData.cardNumber,
      paymentData.cvv,
      paymentData.expiryMonth,
      paymentData.expiryYear
    );
    await paymentPage.confirmPayment();
    await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
  });
});

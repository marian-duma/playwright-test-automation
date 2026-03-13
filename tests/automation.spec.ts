import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/base.page";
import { LoginPage } from "../pages/login.page";
import { SignupPage, UserData } from "../pages/signup.page";
import { ProductsPage } from "../pages/products.page";
import { CartPage } from "../pages/cart.page";

export const user: UserData = {
  title: "Mr",
  name: "Joe Automation",
  email: `jonathanj${Date.now()}@mail.com`,
  password: "Password123!",
  days: "10",
  months: "May",
  years: "1990",
  firstName: "Joe",
  lastName: "Automation",
  address: "123 Playwright Lane",
  country: "United States",
  state: "Maryland",
  city: "Princess Anne",
  zipcode: "21853",
  mobileNumber: "1234567890",
  newsletter: true,
  optin: true,
};

test.describe("Account creation and deletion", () => {
  test.beforeEach("Setup", async ({ page }) => {
    await page.route("**/*doubleclick.net/**", (route) => route.abort());
    await page.route("**/*googlesyndication.com/**", (route) => route.abort());
    await page.route("**/*google-analytics.com/**", (route) => route.abort());

    await page.goto("/");
    await expect(page).toHaveURL("/");
    const basePage = new BasePage(page);
    await basePage.handleGDPR();
    await basePage.clickLogin();
  });

  test.afterEach("Removal", async ({ page }) => {
    const isLoggedIn = await page.getByText(`Logged in as ${user.name}`).isVisible();
    if (isLoggedIn) {
      const basePage = new BasePage(page);
      const successResponse = await basePage.deleteAccount();
      await expect(successResponse).toBeVisible();
    } else {
      console.log("User not logged in!");
      console.log("End!");
    }
  });

  test("Signup", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /\s*signup\s*/i })).toBeVisible();
    const loginPage = new LoginPage(page);
    await loginPage.signup(user.name, user.email);

    await expect(page.getByRole("heading", { name: /enter account information/i })).toBeVisible();
    const signupPage = new SignupPage(page);
    await signupPage.fillAccountDetails(user);

    await expect(page.getByRole("heading", { name: /account created/i })).toBeVisible();
    // signupPage.clickContinue();
    await page.getByRole("link", { name: /continue/i }).click();
  });
});

test.describe("Authentication", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    await page.route("**/*doubleclick.net/**", (route) => route.abort());
    await page.route("**/*googlesyndication.com/**", (route) => route.abort());
    await page.route("**/*google-analytics.com/**", (route) => route.abort());

    await page.goto("/");
    await expect(page).toHaveURL("/");
    const basePage = new BasePage(page);
    await basePage.handleGDPR();
    await basePage.clickLogin();

    const loginPage = new LoginPage(page);
    await loginPage.signup(user.name, user.email);

    const signupPage = new SignupPage(page);
    await signupPage.fillAccountDetails(user);

    await page.getByRole("link", { name: /continue/i }).click();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.route("**/*doubleclick.net/**", (route) => route.abort());
    await page.route("**/*googlesyndication.com/**", (route) => route.abort());
    await page.route("**/*google-analytics.com/**", (route) => route.abort());

    await page.goto("/");
    await expect(page).toHaveURL("/");

    const basePage = new BasePage(page);
    await basePage.clickLogin();

    const loginPage = new LoginPage(page);
    await loginPage.login(user.email, user.password);

    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const basePage = new BasePage(page);
    const isLoggedIn = await page.getByText(`Logged in as ${user.name}`).isVisible();

    if (isLoggedIn) {
      const basePage = new BasePage(page);
      await basePage.logout();
      await expect(page.getByRole("heading", { name: /\s*signup\s*/i })).toBeVisible();
    } else {
      console.log("User not logged in!");
      console.log("End!");
    }
  });

  test("Add items to cart", async ({ page }) => {
    const basePage = new BasePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await test.step("Add item to cart", async () => {
      await basePage.clickProducts();

      await productsPage.addProductToCart(1);
      await productsPage.continueShopping();

      await productsPage.addProductToCart(2);
      await productsPage.continueShopping();

      await basePage.clickCart();

      await expect(cartPage.productRow(1)).toBeVisible();
      await expect(cartPage.productPrice(1)).toHaveText("Rs. 500");
      await expect(cartPage.productQuantity(1)).toHaveText("1");
      await expect(cartPage.productTotal(1)).toHaveText("Rs. 500");

      await expect(cartPage.productRow(2)).toBeVisible();
      await expect(cartPage.productPrice(2)).toHaveText("Rs. 400");
      await expect(cartPage.productQuantity(2)).toHaveText("1");
      await expect(cartPage.productTotal(2)).toHaveText("Rs. 400");
    });
  });
});

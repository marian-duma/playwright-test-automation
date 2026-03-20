import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { LoginPage } from "../../pages/login.page";
import { SignupPage } from "../../pages/signup.page";
import { generateUserData, UserData } from "../../utils/user.generator";

test.describe("Account creation and deletion", () => {
  let user: UserData;
  test.beforeEach("Setup", async ({ page }) => {
    user = generateUserData();
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
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
    const basePage = new BasePage(page);
    const successResponse = await basePage.deleteAccount();
    await expect(successResponse).toBeVisible();
  });

  test("Signup", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /\s*signup\s*/i })).toBeVisible();
    const loginPage = new LoginPage(page);
    await loginPage.signup(user.name, user.email);

    await expect(page.getByRole("heading", { name: /enter account information/i })).toBeVisible();
    const signupPage = new SignupPage(page);
    await signupPage.fillAccountDetails(user);

    await expect(page.getByRole("heading", { name: /account created/i })).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
  });
});

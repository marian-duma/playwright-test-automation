import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { LoginPage } from "../../pages/login.page";
import { SignupPage } from "../../pages/signup.page";
import { generateUserData } from "../../utils/user.generator";
import { handleGDPR } from "../../utils/ads.handler";
import { handleAds } from "../../utils/ads.handler";
import { ContactPage } from "../../pages/contact.page";

test.describe("Account creation and deletion", () => {
  test.beforeEach("Setup", async ({ page }) => {
    handleAds(page);
    await page.goto("/");
    await expect(page).toHaveURL("https://automationexercise.com/");
    await handleGDPR(page);
  });

  test("Test Case 1: Register User", async ({ page }) => {
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);

    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();

    const user = generateUserData();

    await basePage.clickLogin();
    await expect(page.getByRole("heading", { name: /new user signup!/i })).toBeVisible();

    await loginPage.signup(user.name, user.email);

    await expect(page.getByText(/enter account information/i)).toBeVisible();
    await signupPage.fillAccountDetails(user);

    await expect(page.getByText(/account created!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await basePage.deleteAccount();
    await expect(page.getByText(/account\s*deleted!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
  });

  test("Test Case 2: Login User with correct email and password", async ({ page }) => {
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const user = generateUserData();

    await basePage.clickLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await page.getByRole("link", { name: /continue/i }).click();
    await basePage.logout();

    await basePage.clickLogin();
    await expect(page.getByRole("heading", { name: /login to your account/i })).toBeVisible();

    await loginPage.login(user.email, user.password);
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await basePage.deleteAccount();
    await expect(page.getByText(/account\s*deleted!/i)).toBeVisible();
    await page.getByRole("link", { name: /continue/i }).click();
  });

  test("Test Case 3: Login User with incorrect email and password", async ({ page }) => {
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);

    await basePage.clickLogin();
    await expect(page.getByRole("heading", { name: /login to your account/i })).toBeVisible();

    await loginPage.login("invalid_email@example.com", "WrongPassword123!");
    await expect(page.getByText("Your email or password is incorrect!")).toBeVisible();
  });

  test("Test Case 4: Logout User", async ({ page }) => {
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const user = generateUserData();

    await basePage.clickLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await page.getByRole("link", { name: /continue/i }).click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await basePage.logout();
    await expect(page).toHaveURL(/.*login/);
  });

  test("Test Case 5: Register User with existing email", async ({ page }) => {
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const user = generateUserData();

    await basePage.clickLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await page.getByRole("link", { name: /continue/i }).click();
    await basePage.logout();

    await basePage.clickLogin();
    await expect(page.getByRole("heading", { name: /new user signup!/i })).toBeVisible();

    await loginPage.signup("Another Name", user.email);
    await expect(page.getByText("Email Address already exist!")).toBeVisible();
  });

  // test("Test Case 6: Contact Us Form", async ({ page }) => {
  //   const contactPage = new ContactPage(page);

  //   await contactPage.contactUsButton.click();

  //   await contactPage.fillContactForm(
  //     "Test User",
  //     "test@automation.com",
  //     "Test Subject - Automation",
  //     "Message for testing purposes."
  //   );

  //   await contactPage.uploadFile("test.txt");
  //   page.once("dialog", async (dialog) => {
  //     await dialog.accept();
  //   });

  //   await contactPage.submit();

  //   await expect(
  //     page
  //       .locator(".contact-form")
  //       .getByText(/Success! Your details have been submitted successfully/i)
  //   ).toBeVisible();

  //   await contactPage.returnHome();
  //   await expect(page).toHaveURL("https://automationexercise.com/");
  // });
});

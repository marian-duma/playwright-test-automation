import { test, expect } from "@playwright/test";

const userName = "J. John Johnatan";
const userMail = `jonathanj${Date.now()}@mail.com`;
const userPass = "12345678";

test.describe.configure({ mode: "serial" });

test("Signup and removal", async ({ page }) => {
  await test.step("GPDR", async () => {
    await page.goto("https://automationexercise.com/");
    //GDPR Pop-up
    const consentButton = page.getByRole("button", { name: "Consent" });
    if (await consentButton.isVisible()) {
      await consentButton.click();
    }
  });

  await test.step("Signup", async () => {
    await expect(page).toHaveTitle(/Automation Exercise/);
    await page.getByRole("link", { name: "Signup / Login" }).click();
    await expect(
      page.getByRole("heading", { name: "New User Signup!" })
    ).toBeVisible();
    await page.getByPlaceholder("Name").fill(userName);
    //'Locates' the div with the class signup-form, then locates the input
    //with that exact placeholder that is inside that div.
    //Used this because there are 2 inputs with the same placeholder.
    await page
      .locator(".signup-form")
      .getByPlaceholder("Email Address")
      .fill(userMail);
    await page.getByRole("button", { name: "Signup" }).click();
    await expect(
      page.getByRole("heading", { name: "ENTER ACCOUNT INFORMATION" })
    ).toBeVisible();
  });

  await test.step("Account creation", async () => {
    await page.getByLabel("Mr.").check();
    await page.getByLabel(/^Name/).fill(userName);
    await page.getByLabel("Password").fill(userPass);

    await page.locator("#days").selectOption("10");
    await page.locator("#months").selectOption("May");
    await page.locator("#years").selectOption({ index: 5 });
    await page.locator("#newsletter").check();
    await page.locator("#optin").check();

    await page.getByLabel("First name").fill("J. John");
    await page.getByLabel("Last name").fill("Johnatan");
    await page.locator("#address1").fill("26520 Deal Island Rd");
    await page.getByLabel("Country").selectOption("United States");
    await page.getByLabel("State").fill("Maryland");
    await page.locator("#city").fill("Princess Anne");
    await page.locator("#zipcode").fill("21853");
    await page.getByLabel("Mobile Number").fill("(206) 342-8631");

    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(
      page.getByText("ACCOUNT CREATED!", { exact: false })
    ).toBeVisible();
  });

  // await test.step("Account deletion", async () => {
  //   await page.getByRole("link", { name: /Continue/ }).click();
  //   await expect(page.getByText(`Logged in as ${userName}`)).toBeVisible();

  //   await page.getByRole("link", { name: /Delete Account/ }).click();

  //   await expect(page.getByText("ACCOUNT DELETED!")).toBeVisible();
  //   await page.getByRole("link", { name: /Continue/ }).click();
  // });
});

test("login and add to cart", async ({ page }) => {
  await test.step("GPDR", async () => {
    await page.goto("https://automationexercise.com/");
    //GDPR Pop-up
    const consentButton = page.getByRole("button", { name: "Consent" });
    if (await consentButton.isVisible()) {
      await consentButton.click();
    }
  });
  await test.step("Login", async () => {
    await expect(page).toHaveTitle(/Automation Exercise/);
    await page.getByRole("link", { name: "Signup / Login" }).click();
    await expect(
      page.getByRole("heading", { name: "Login to your account" })
    ).toBeVisible();
    //'Locates' the div with the class login-form, then locates the input
    //with that exact placeholder that is inside that div.
    //Used this because there are 2 inputs with the same placeholder.
    await page
      .locator(".login-form")
      .getByPlaceholder("Email Address")
      .fill(userMail);
    await page.getByPlaceholder("Password").fill(userPass);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(`Logged in as ${userName}`)).toBeVisible();
  });

  await test.step("Add item to cart", async () => {
    await page.getByRole("link", { name: "Products" }).click();
    await page.locator('a.add-to-cart[data-product-id="1"]').first().click();
    await page.getByRole("button", { name: /continue shopping/i }).click();
    await page.locator('a.add-to-cart[data-product-id="2"]').first().click();
    await page.getByRole("link", { name: /view cart/i }).click();
    await expect(page.locator("#product-1")).toBeVisible();
    await expect(page.locator("#product-2")).toBeVisible();
    await expect(page.locator("#product-1 .cart_price")).toHaveText("Rs. 500");
    await expect(page.locator("#product-1 .cart_quantity")).toHaveText("1");
    await expect(page.locator("#product-1 .cart_total")).toHaveText("Rs. 500");
    await expect(page.locator("#product-2 .cart_price")).toHaveText("Rs. 400");
    await expect(page.locator("#product-2 .cart_quantity")).toHaveText("1");
    await expect(page.locator("#product-2 .cart_total")).toHaveText("Rs. 400");
  });
});

test("delete", async ({ page }) => {
  await test.step("GPDR", async () => {
    await page.goto("https://automationexercise.com/");
    //GDPR Pop-up
    const consentButton = page.getByRole("button", { name: "Consent" });
    if (await consentButton.isVisible()) {
      await consentButton.click();
    }
  });
  await test.step("Login", async () => {
    await expect(page).toHaveTitle(/Automation Exercise/);
    await page.getByRole("link", { name: "Signup / Login" }).click();
    await expect(
      page.getByRole("heading", { name: "Login to your account" })
    ).toBeVisible();
    //'Locates' the div with the class login-form, then locates the input
    //with that exact placeholder that is inside that div.
    //Used this because there are 2 inputs with the same placeholder.
    await page
      .locator(".login-form")
      .getByPlaceholder("Email Address")
      .fill(userMail);
    await page.getByPlaceholder("Password").fill(userPass);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(`Logged in as ${userName}`)).toBeVisible();
  });
  await test.step("Account deletion", async () => {
    //await page.getByRole("link", { name: /Continue/ }).click();
    await page.getByRole("link", { name: /Delete Account/ }).click();
    await expect(page.getByText("ACCOUNT DELETED!")).toBeVisible();
    await page.getByRole("link", { name: /Continue/ }).click();
  });
});

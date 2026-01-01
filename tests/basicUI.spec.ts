import { test, expect } from '@playwright/test';

test('signup', async ({ page }) => {
  const userName = 'J. John Johnatan';
  const userMail = 'jonathanj@mail.com';
  
  await page.goto('https://automationexercise.com/');
  
  //GDPR Pop-up
  const consentButton = page.getByRole('button', { name: 'Consent' });
  if (await consentButton.isVisible()) {
      await consentButton.click();
  }

  await expect(page).toHaveTitle(/Automation Exercise/);
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  await page.getByPlaceholder('Name').fill(userName);
  //'Locates' the div with the class signup-form, then locates the input
  //with that exact placeholder that is inside that div.
  //Used this because there are 2 inputs with the same placeholder.
  await page.locator('.signup-form').getByPlaceholder('Email Address').fill(userMail);
  await page.getByRole('button', { name: 'Signup' }).click();
  await expect(page.getByRole('heading', { name:'ENTER ACCOUNT INFORMATION' })).toBeVisible();
  
  await page.getByLabel('Mr.').check();
  await page.getByLabel(/^Name/).fill(userName);
  await page.getByLabel("Password").fill("12345678");

  await page.locator('#days').selectOption('10');
  await page.locator('#months').selectOption('May'); 
  await page.locator('#years').selectOption({ index: 5 });
  await page.locator('#newsletter').check();
  await page.locator('#optin').check();

  await page.getByLabel("First name").fill("J. John");
  await page.getByLabel("Last name").fill("Johnatan");
  await page.locator("#address1").fill("26520 Deal Island Rd");
  await page.getByLabel('Country').selectOption('United States');
  await page.getByLabel("State").fill("Maryland");
  await page.locator("#city").fill("Princess Anne");
  await page.locator("#zipcode").fill("21853");
  await page.getByLabel("Mobile Number").fill("(206) 342-8631");
  
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('ACCOUNT CREATED!', { exact: false })).toBeVisible();
  
  await page.getByRole("link", { name: /Continue/ }).click();
  await expect(page.getByText(`Logged in as ${userName}`)).toBeVisible();

  await page.getByRole("link", { name: /Delete Account/ }).click();
  
  await expect(page.getByText("ACCOUNT DELETED!")).toBeVisible();
  await page.getByRole("link", { name: /Continue/ }).click();
});

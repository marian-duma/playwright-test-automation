import { test, expect } from "@playwright/test";
import { ContactPage } from "../../pages/contact.page";
import { handleAds, handleGDPR } from "../../utils/ads.handler";

test.describe("General UI tests", () => {
  test.beforeEach("Setup", async ({ page }) => {
    await handleAds(page);
    await page.goto("/");
    await handleGDPR(page);
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();
  });

  test("Test Case 6: Contact Us Form", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.contactUsButton.click();

    await contactPage.fillContactForm(
      "Test User",
      "test@automation.com",
      "Test Subject - Automation",
      "Message for testing purposes."
    );

    await contactPage.uploadFile("test.txt");

    await Promise.all([
      page.waitForEvent("dialog").then((dialog) => dialog.accept()),
      contactPage.submit(),
    ]);

    const successBanner = page.locator(".status.alert-success");

    await expect(successBanner).toContainText(
      /Success! Your details have been submitted successfully/i
    );

    await contactPage.returnHome();
    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeVisible();
  });

  test("Test Case 7: Verify Test Cases Page", async ({ page }) => {
    await page
      .locator(".nav")
      .getByRole("link", { name: /test cases/i })
      .click();
    await expect(page.getByRole("heading", { name: /TEST CASES/i })).toBeVisible();
  });

  test("Test Case 10: Verify Subscription in home page", async ({ page }) => {
    await page.locator("#footer").scrollIntoViewIfNeeded();

    await expect(page.getByRole("heading", { name: /Subscription/i })).toBeVisible();

    await page.locator("#susbscribe_email").fill("automation@mail.com");
    await page.locator("#subscribe").click();

    const successMessage = page.locator("#success-subscribe");
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText("You have been successfully subscribed!");
  });

  test("Test Case 11: Verify Subscription in Cart page", async ({ page }) => {
    await page.getByRole("link", { name: "Cart" }).click();
    await page.locator("#footer").scrollIntoViewIfNeeded();

    await expect(page.getByRole("heading", { name: /Subscription/i })).toBeVisible();

    await page.locator("#susbscribe_email").fill("automation@mail.com");
    await page.locator("#subscribe").click();

    const successMessage = page.locator("#success-subscribe");
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText("You have been successfully subscribed!");
  });

  test("Test Case 25: Verify Scroll Up using Arrow button", async ({ page }) => {
    await page.locator("#footer").scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: /Subscription/i })).toBeInViewport();
    await page.locator("#scrollUp").click();

    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeInViewport();
  });

  test("Test Case 26: Verify Scroll Up without Arrow button", async ({ page }) => {
    await page.locator("#footer").scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: /Subscription/i })).toBeVisible();
    await page.locator("#header").scrollIntoViewIfNeeded();

    await expect(page.getByRole("heading", { name: /AutomationExercise/i })).toBeInViewport();
  });
});

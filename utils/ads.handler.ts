import { Page } from "@playwright/test";

export const handleAds = async (page: Page) => {
  await page.route("**/*doubleclick.net/**", (route) => route.abort());
  await page.route("**/*googlesyndication.com/**", (route) => route.abort());
  await page.route("**/*google-analytics.com/**", (route) => route.abort());
  await page.route("**/*googleadservices/**", (route) => route.abort());
};

export const handleGDPR = async (page: Page) => {
  const consentButton = page.getByRole("button", { name: /consent/i });
  if (await consentButton.isVisible({ timeout: 1500 })) {
    console.log("GDPR popup appeared!");
    await consentButton.click();
  }
};

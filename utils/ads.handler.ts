import { Page } from "@playwright/test";

export const handleAds = async (page: Page) => {
  await page.route("**/*doubleclick.net/**", (route) => route.abort());
  await page.route("**/*googlesyndication.com/**", (route) => route.abort());
  await page.route("**/*google-analytics.com/**", (route) => route.abort());
  await page.route("**/*googleadservices/**", (route) => route.abort());
};

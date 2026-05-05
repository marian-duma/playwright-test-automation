import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly proceedToCheckoutButton: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceedToCheckoutButton = page.locator(".check_out");
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole("link", { name: /place order/i });
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async enterComment(comment: string) {
    await this.commentTextarea.fill(comment);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

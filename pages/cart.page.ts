import { Page, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  productRow(productId: number) {
    return this.page.locator(`#product-${productId}`);
  }

  async expectProductVisible(productId: number) {
    await expect(this.productRow(productId)).toBeVisible();
  }

  async expectPrice(productId: number, price: string) {
    await expect(this.productRow(productId).locator(".cart_price")).toHaveText(price);
  }

  async expectQuantity(productId: number, qty: string) {
    await expect(this.productRow(productId).locator(".cart_quantity")).toHaveText(qty);
  }

  async expectTotal(productId: number, total: string) {
    await expect(this.productRow(productId).locator(".cart_total")).toHaveText(total);
  }
}

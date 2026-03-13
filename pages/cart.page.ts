import { Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  productRow(productId: number) {
    return this.page.locator(`#product-${productId}`);
  }

  productPrice(index: number) {
    return this.productRow(index).locator(".cart_price");
  }

  productQuantity(index: number) {
    return this.productRow(index).locator(".cart_quantity");
  }

  productTotal(index: number) {
    return this.productRow(index).locator(".cart_total");
  }
}

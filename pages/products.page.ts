import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProductsPage extends BasePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productItems: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.searchInput = page.getByPlaceholder(/search\s*product/i);
    this.searchButton = page.locator("#submit_search");

    this.productItems = page.locator(".product-image-wrapper");

    this.addToCartButtons = page.locator(".add-to-cart");
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async addProductToCart(index: number) {
    const product = this.productItems.nth(index);

    const addToCart = product.locator(".add-to-cart").first();

    await product.scrollIntoViewIfNeeded();
    await product.hover();

    await addToCart.click({ force: true });
  }

  async continueShopping() {
    const continueButton = this.page.getByRole("button", { name: /continue shopping/i });
    await continueButton.click();
  }
}

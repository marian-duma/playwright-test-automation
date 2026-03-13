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
    // The page contains 2 'Add to cart' buttons for each product.
    // The .first() and the .nth(1).
    // The .first() is invisible until a normal user hovers
    // over the product. It is meant to be used after the slide
    // animation of the card finishes.
    const addToCart = await this.page.locator(`[data-product-id="${index}"]`).first();
    await addToCart.click();
  }

  async continueShopping() {
    const continueButton = this.page.getByRole("button", { name: /continue shopping/i });
    await continueButton.click();
  }
}

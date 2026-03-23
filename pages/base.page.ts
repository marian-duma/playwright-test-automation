import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  readonly homeButton: Locator;
  readonly productsButton: Locator;
  readonly cartButton: Locator;
  readonly loginButton: Locator;
  readonly contactUsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.homeButton = page.getByRole("link", { name: /home/i });
    this.productsButton = page.getByRole("link", { name: /products/i });
    this.cartButton = page.getByRole("link", { name: /cart/i });
    this.loginButton = page.getByRole("link", { name: /signup\s*\/\s*login/i });
    this.contactUsButton = page.getByRole("link", { name: /contact us/i });
  }

  async clickHome() {
    await this.homeButton.click();
  }
  async clickProducts() {
    await this.productsButton.click();
  }

  async clickCart() {
    await this.cartButton.click();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async logout() {
    await this.page.getByRole("link", { name: /logout/i }).click();
  }

  async deleteAccount() {
    await this.page.getByRole("link", { name: /delete\s*account/i }).click();
    return this.page.getByText(/account\s*deleted!/i);
  }
}

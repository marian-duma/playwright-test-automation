import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly emailSignupInput: Locator;
  readonly signupButton: Locator;

  readonly emailLoginInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.nameInput = page.locator('[data-qa="signup-name"]');
    this.emailSignupInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');

    this.emailLoginInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
  }

  async signup(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailSignupInput.fill(email);
    await this.signupButton.click();
  }

  async login(email: string, password: string) {
    await this.emailLoginInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

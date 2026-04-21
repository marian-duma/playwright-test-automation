import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class ContactPage extends BasePage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly uploadFileInput: Locator;
  readonly submitButton: Locator;
  readonly successHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');

    this.successHomeButton = page.locator(".btn-success");
  }

  async fillContactForm(name: string, email: string, subject: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
  }

  async uploadFile(filePath: string) {
    await this.uploadFileInput.setInputFiles(filePath);
  }

  async submit() {
    await this.submitButton.click();
  }

  async returnHome() {
    await this.successHomeButton.click();
  }
}

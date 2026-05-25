import { Page, Locator } from "@playwright/test";
import { PaymentData } from "../utils/user.generator";
export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
  }

  async fillPaymentDetails(name: string, card: string, cvc: string, month: string, year: string) {
    await this.nameOnCardInput.fill(name);
    await this.cardNumberInput.fill(card);
    await this.cvcInput.fill(cvc);
    await this.expiryMonthInput.fill(month);
    await this.expiryYearInput.fill(year);
  }

  async fillPaymentData(paymentData: PaymentData) {
    await this.fillPaymentDetails(
      paymentData.cardName,
      paymentData.cardNumber,
      paymentData.cvv,
      paymentData.expiryMonth,
      paymentData.expiryYear
    );
  }

  async confirmPayment() {
    await this.payButton.click();
  }
}

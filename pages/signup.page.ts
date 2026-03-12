import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export interface UserData {
  title: "Mr" | "Mrs";
  name: string;
  email: string;
  password: string;
  days: string;
  months: string;
  years: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  newsletter?: boolean;
  optin?: boolean;
}

export class SignupPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  async fillAccountDetails(user: UserData) {
    // 1. Radio Buttons (Titles)
    await this.page.locator(`[data-qa="title"] input[value="${user.title}"]`).check();

    // 2. Account Information
    // await this.page.locator('[data-qa="name"]').fill(user.name);
    await this.page.locator('[data-qa="password"]').fill(user.password);

    // 3. Date of Birth Dropdowns
    await this.page.locator('[data-qa="days"]').selectOption(user.days);
    await this.page.locator('[data-qa="months"]').selectOption(user.months);
    await this.page.locator('[data-qa="years"]').selectOption(user.years);

    // 4. Checkboxes (Newsletter & Offers)
    if (user.newsletter) await this.page.getByLabel(/.*newsletter.*/i).check();
    if (user.optin) await this.page.getByLabel(/.*offers.*/i).check();

    // 5. Address Information
    await this.page.locator('[data-qa="first_name"]').fill(user.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(user.lastName);
    await this.page.locator('[data-qa="address"]').fill(user.address);
    await this.page.locator('[data-qa="country"]').selectOption(user.country);
    await this.page.locator('[data-qa="state"]').fill(user.state);
    await this.page.locator('[data-qa="city"]').fill(user.city);
    await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(user.mobileNumber);

    // 6. Submit
    await this.page.locator('[data-qa="create-account"]').click();
  }
}

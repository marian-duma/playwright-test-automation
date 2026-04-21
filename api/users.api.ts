import { APIRequestContext } from "@playwright/test";
import { UserData } from "../utils/user.generator";

export class UsersApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async postCreateUser(user: UserData) {
    return await this.request.post("/api/createAccount", {
      form: {
        title: user.title,
        name: user.name,
        email: user.email,
        password: user.password,
        birth_date: user.days,
        birth_month: user.months,
        birth_year: user.years,
        firstname: user.firstName,
        lastname: user.lastName,
        company: "Test Company Inc",
        address1: user.address,
        address2: "Suite 100",
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobileNumber,
      },
    });
  }
  async postVerifyLogin(email?: string, password?: string) {
    return await this.request.post("/api/verifyLogin", {
      form: {
        ...(email && { email }),
        ...(password && { password }),
      },
    });
  }

  async deleteVerifyLogin() {
    return await this.request.delete("/api/verifyLogin");
  }

  async deleteAccount(email: string, password?: string) {
    return await this.request.delete("/api/deleteAccount", {
      form: {
        email: email,
        ...(password && { password }),
      },
    });
  }

  async putUpdateAccount(user: UserData) {
    return await this.request.put("/api/updateAccount", {
      form: {
        title: user.title,
        name: user.name,
        email: user.email,
        password: user.password,
        birth_date: user.days,
        birth_month: user.months,
        birth_year: user.years,
        firstname: user.firstName,
        lastname: user.lastName,
        company: "Test Company Updated",
        address1: user.address,
        address2: "Suite 200",
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobileNumber,
      },
    });
  }

  async getUserDetailByEmail(email: string) {
    return await this.request.get("/api/getUserDetailByEmail", {
      params: {
        email: email,
      },
    });
  }
}

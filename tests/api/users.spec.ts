import { test, expect } from "@playwright/test";
import { UsersApi } from "../../api/users.api";
import { generateUserData } from "../../utils/user.generator";

test.describe("User Management API", () => {
  test("API 11: Create User Account", async ({ request }) => {
    const userApi = new UsersApi(request);
    const userData = generateUserData();

    const response = await userApi.postCreateUser(userData);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(201);
    expect(body.message).toBe("User created!");
  });
});

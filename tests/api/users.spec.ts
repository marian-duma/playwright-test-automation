import { test, expect } from "@playwright/test";
import { UsersApi } from "../../api/users.api";
import { generateUserData } from "../../utils/user.generator";

test.describe("User Management API", () => {
  let usersApi: UsersApi;
  const mainUser = generateUserData();

  test.beforeEach(async ({ request }) => {
    usersApi = new UsersApi(request);
    await usersApi.postCreateUser(mainUser);
  });

  test("API 7: POST To Verify Login with valid details", async () => {
    const response = await usersApi.postVerifyLogin(mainUser.email, mainUser.password);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User exists!");
  });

  test("API 8: POST To Verify Login without email parameter", async () => {
    const response = await usersApi.postVerifyLogin(undefined, mainUser.password);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe(
      "Bad request, email or password parameter is missing in POST request."
    );
  });

  test("API 9: DELETE To Verify Login", async () => {
    const response = await usersApi.deleteVerifyLogin();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe("This request method is not supported.");
  });

  test("API 10: POST To Verify Login with invalid details", async () => {
    const response = await usersApi.postVerifyLogin(
      "invalid_email@example.com",
      "wrongpassword123"
    );
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe("User not found!");
  });

  test("API 11: POST To Create/Register User Account", async () => {
    const newUser = generateUserData();
    const response = await usersApi.postCreateUser(newUser);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe("User created!");
  });

  test("API 12: DELETE METHOD To Delete User Account", async () => {
    const response = await usersApi.deleteAccount(mainUser.email, mainUser.password);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("Account deleted!");
  });

  test("API 13: PUT METHOD To Update User Account", async () => {
    const updatedUser = { ...mainUser, firstName: "UpdatedFirstName" };
    const response = await usersApi.putUpdateAccount(updatedUser);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User updated!");
  });

  test("API 14: GET user account detail by email", async () => {
    const response = await usersApi.getUserDetailByEmail(mainUser.email);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.user.email).toBe(mainUser.email);
  });
});

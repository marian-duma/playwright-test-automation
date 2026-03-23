import { test, expect } from "@playwright/test";
import { ProductsApi } from "../../api/products.api";

test.describe("Product and Brand API Tests", () => {
  let productsApi: ProductsApi;

  test.beforeEach(async ({ request }) => {
    productsApi = new ProductsApi(request);
  });

  test("API 1: Get All Products list", async () => {
    const response = await productsApi.getAllProducts();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test("API 2: POST To All Products list", async () => {
    const response = await productsApi.postAllProducts();
    const body = await response.json();

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe("This request method is not supported.");
  });

  test("API 3: Get All Brands list", async () => {
    const response = await productsApi.getBrandsList();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test("API 4: PUT To All Brands list", async () => {
    const response = await productsApi.putBrandsList();
    const body = await response.json();

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe("This request method is not supported.");
  });

  test("API 5: POST To Search product", async () => {
    const response = await productsApi.postSearchProduct("top");
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);

    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test("API 6: POST To Search Product without search_product parameter", async () => {
    const response = await productsApi.postSearchProduct();
    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe("Bad request, search_product parameter is missing in POST request.");
  });
});

import { APIRequestContext } from "@playwright/test";

export class ProductsApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getAllProducts() {
    return await this.request.get("/api/productsList");
  }

  async postAllProducts() {
    return await this.request.post("/api/productsList");
  }

  async getBrandsList() {
    return await this.request.get("/api/brandsList");
  }

  async putBrandsList() {
    return await this.request.put("/api/brandsList");
  }

  async postSearchProduct(search_product?: string) {
    return await this.request.post("/api/searchProduct", {
      form: search_product ? { search_product } : {},
    });
  }
}

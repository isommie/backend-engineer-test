import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../src/controllers/productController";
import { Product } from "../../src/models/Product";
import { logger } from "../../src/utils/logger";

jest.mock("../../src/models/Product", () => ({
    Product: {
      create: jest.fn(), // Mock the static create method
      findByIdAndUpdate: jest.fn(), // Mock the static findByIdAndUpdate method for updateProduct
      findByIdAndDelete: jest.fn(), // Mock the static findByIdAndDelete method for deleteProduct
      find: jest.fn(), // Mock the static find method for getAllProducts
      findById: jest.fn(), // Mock the static findById method for getProductById
    },
  }));
  
jest.mock("../../src/utils/logger");

describe("Product Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = { body: {}, params: {} };
    mockRes = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      const products = [{ id: "1", name: "Product A" }, { id: "2", name: "Product B" }];
      (Product.find as jest.Mock).mockResolvedValue(products);

      await getAllProducts(mockReq as Request, mockRes as Response);

      expect(Product.find).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith("Fetching all products");
      expect(logger.log).toHaveBeenCalledWith("Fetched 2 products");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: products });
    });

    it("should handle errors", async () => {
      (Product.find as jest.Mock).mockRejectedValue(new Error("Error fetching products"));

      await getAllProducts(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith("Failed to fetch products");
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Failed to fetch products",
      });
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const product = { id: "1", name: "Product A" };
      mockReq.params = { id: "1" };
      (Product.findById as jest.Mock).mockResolvedValue(product);

      await getProductById(mockReq as Request, mockRes as Response);

      expect(Product.findById).toHaveBeenCalledWith("1");
      expect(logger.log).toHaveBeenCalledWith("Fetching product by ID: 1");
      expect(logger.log).toHaveBeenCalledWith("Fetched product with ID: 1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: product });
    });

    it("should handle product not found", async () => {
      mockReq.params = { id: "1" };
      (Product.findById as jest.Mock).mockResolvedValue(null);

      await getProductById(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith("Product with ID 1 not found");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Product not found",
      });
    });
  });

  describe("createProduct", () => {
    it("should create a product", async () => {
      const productInput = {
        name: "Corn starch",
        price: 29.99,
        description: "A product description",
        category: "maize",
        stock: 100,
      };
  
      const savedProduct = {
        ...productInput,
        _id: "678aec42fda87f5e84ddccf8",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      // Mock Product.create to resolve with the savedProduct
      (Product.create as jest.Mock).mockResolvedValue(savedProduct);
  
      mockReq.body = productInput;
  
      await createProduct(mockReq as Request, mockRes as Response);
  
      console.log("Product.create calls:", (Product.create as jest.Mock).mock.calls);
  
      expect(Product.create).toHaveBeenCalledWith(productInput);
      expect(logger.log).toHaveBeenCalledWith("Creating a new product");
      expect(logger.log).toHaveBeenCalledWith("Created new product with ID: 678aec42fda87f5e84ddccf8");
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: savedProduct,
      });
    });
  
    it("should handle errors", async () => {
      mockReq.body = { name: "Product A" };
  
      // Mock Product.create to reject with an error
      (Product.create as jest.Mock).mockRejectedValue(new Error("Error creating product"));
  
      await createProduct(mockReq as Request, mockRes as Response);
  
      expect(logger.error).toHaveBeenCalledWith("Failed to create a product");
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Failed to create a product",
      });
    });
  });
  

  describe("updateProduct", () => {
    it("should update a product by ID", async () => {
      const updatedProductInput = {
        name: "Updated Product",
        price: 100,
        description: "Updated Description",
        category: "Category A",
        stock: 10,
      };

      const updatedProduct = { ...updatedProductInput, _id: "1" }; // Mock returned document

      mockReq.params = { id: "1" };
      mockReq.body = updatedProductInput;

      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProduct);

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        updatedProductInput,
        { new: true, runValidators: true }
      );
      expect(logger.log).toHaveBeenCalledWith("Updating product with ID: 1");
      expect(logger.log).toHaveBeenCalledWith("Updated product with ID: 1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { ...updatedProductInput, id: "1" }, // API response with `id` instead of `_id`
      });
    });

    it("should handle product not found", async () => {
      mockReq.params = { id: "1" };
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith("Product with ID 1 not found");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Product not found",
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product by ID", async () => {
      const product = { id: "1", name: "Product A" };
      mockReq.params = { id: "1" };
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(product);

      await deleteProduct(mockReq as Request, mockRes as Response);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(logger.log).toHaveBeenCalledWith("Deleting product with ID: 1");
      expect(logger.log).toHaveBeenCalledWith("Deleted product with ID: 1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: "Product deleted successfully",
      });
    });

    it("should handle product not found", async () => {
      mockReq.params = { id: "1" };
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteProduct(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith("Product with ID 1 not found");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Product not found",
      });
    });
  });
});

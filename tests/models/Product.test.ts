import mongoose from "mongoose";
import { Product } from "../../src/models/Product";
import { MongoMemoryServer } from "mongodb-memory-server";
import ValidationError from 'mongoose';

describe("Product Model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { directConnection: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Product.deleteMany(); // Clear data between tests
  });

  it("should save a product with valid fields", async () => {
    const productData = {
      name: "Test Product",
      description: "A test product description",
      price: 10.99,
      category: "Test Category",
      stock: 50,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.description).toBe(productData.description);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.category).toBe(productData.category);
    expect(savedProduct.stock).toBe(productData.stock);
    expect(savedProduct.createdAt).toBeDefined();
    expect(savedProduct.updatedAt).toBeDefined();
  });

  it("should fail to save a product without required fields", async () => {
    const product = new Product({}); // Missing all required fields

    let error: Error | null = null;
    try {
      await product.save();
    } catch (err: any) {
      error = err as Error;
    }
    
    if (error && error instanceof mongoose.Error.ValidationError) {
        const validationError = error as mongoose.Error.ValidationError;
        expect(validationError.name).toBe("ValidationError");
        expect(validationError.errors.name).toBeDefined();
        expect(validationError.errors.price).toBeDefined();
        expect(validationError.errors.category).toBeDefined();
        expect(validationError.errors.stock).toBeDefined();
      }
  });

  it("should fail when price or stock is negative", async () => {
    const productData = {
      name: "Invalid Product",
      description: "This product has invalid fields",
      price: -5.99,
      category: "Test Category",
      stock: -10,
    };
  
    const product = new Product(productData);
  
    let error: Error | null = null;
    try {
      await product.save();
    } catch (err: any) {
      error = err as Error;
    //   console.log("Validation Error:", error);
    }
  
    // Ensure the error is a Mongoose ValidationError
    if (error && error instanceof mongoose.Error.ValidationError) {
      const validationError = error as mongoose.Error.ValidationError;
  
      // Assert the validation error name
      expect(validationError.name).toBe("ValidationError");
  
      // Assert specific field errors exist
      expect(validationError.errors.price).toBeDefined();
      expect(validationError.errors.price.kind).toBe("min");
      expect(validationError.errors.price.message).toBe(
        "Path `price` (-5.99) is less than minimum allowed value (0)."
      );
  
      expect(validationError.errors.stock).toBeDefined();
      expect(validationError.errors.stock.kind).toBe("min");
      expect(validationError.errors.stock.message).toBe(
        "Path `stock` (-10) is less than minimum allowed value (0)."
      );
    } else {
      throw new Error("Expected a validation error but did not get one.");
    }
  });  
});

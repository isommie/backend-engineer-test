"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = require("../../models/Product");
const mongodb_memory_server_1 = require("mongodb-memory-server");
describe("Product Model", () => {
    let mongoServer;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        yield mongoose_1.default.connect(uri, { directConnection: true });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Product_1.Product.deleteMany(); // Clear data between tests
    }));
    it("should save a product with valid fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const productData = {
            name: "Test Product",
            description: "A test product description",
            price: 10.99,
            category: "Test Category",
            stock: 50,
        };
        const product = new Product_1.Product(productData);
        const savedProduct = yield product.save();
        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.name).toBe(productData.name);
        expect(savedProduct.description).toBe(productData.description);
        expect(savedProduct.price).toBe(productData.price);
        expect(savedProduct.category).toBe(productData.category);
        expect(savedProduct.stock).toBe(productData.stock);
        expect(savedProduct.createdAt).toBeDefined();
        expect(savedProduct.updatedAt).toBeDefined();
    }));
    it("should fail to save a product without required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const product = new Product_1.Product({}); // Missing all required fields
        let error = null;
        try {
            yield product.save();
        }
        catch (err) {
            error = err;
        }
        if (error && error instanceof mongoose_1.default.Error.ValidationError) {
            const validationError = error;
            expect(validationError.name).toBe("ValidationError");
            expect(validationError.errors.name).toBeDefined();
            expect(validationError.errors.price).toBeDefined();
            expect(validationError.errors.category).toBeDefined();
            expect(validationError.errors.stock).toBeDefined();
        }
    }));
    it("should fail when price or stock is negative", () => __awaiter(void 0, void 0, void 0, function* () {
        const productData = {
            name: "Invalid Product",
            description: "This product has invalid fields",
            price: -5.99,
            category: "Test Category",
            stock: -10,
        };
        const product = new Product_1.Product(productData);
        let error = null;
        try {
            yield product.save();
        }
        catch (err) {
            error = err;
            //   console.log("Validation Error:", error);
        }
        // Ensure the error is a Mongoose ValidationError
        if (error && error instanceof mongoose_1.default.Error.ValidationError) {
            const validationError = error;
            // Assert the validation error name
            expect(validationError.name).toBe("ValidationError");
            // Assert specific field errors exist
            expect(validationError.errors.price).toBeDefined();
            expect(validationError.errors.price.kind).toBe("min");
            expect(validationError.errors.price.message).toBe("Path `price` (-5.99) is less than minimum allowed value (0).");
            expect(validationError.errors.stock).toBeDefined();
            expect(validationError.errors.stock.kind).toBe("min");
            expect(validationError.errors.stock.message).toBe("Path `stock` (-10) is less than minimum allowed value (0).");
        }
        else {
            throw new Error("Expected a validation error but did not get one.");
        }
    }));
});

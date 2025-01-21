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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../../app"));
const Product_1 = require("../../models/Product");
let mongoServer;
let authToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose_1.default.connection.readyState === 0) {
        yield mongoose_1.default.connect(uri, {});
    }
    const registerResponse = yield (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    });
    if (registerResponse.status === 201) {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123',
        });
        if (loginResponse.body && loginResponse.body.token) {
            authToken = loginResponse.body.token;
        }
        else {
            throw new Error('Auth token not found in login response');
        }
    }
    else {
        throw new Error('User registration failed');
    }
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        yield collections[key].deleteMany({});
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.dropDatabase();
    yield mongoose_1.default.connection.close();
    yield mongoServer.stop();
}));
describe('Product Controller', () => {
    describe('GET /api/products', () => {
        it('should return all products', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Product_1.Product.create({
                name: 'Test Product',
                price: 100,
                description: 'Test product description',
                category: 'Test category',
                stock: 10,
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/products')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        }));
    });
    describe('GET /api/products/:id', () => {
        it('should return a product by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const newProduct = yield Product_1.Product.create({
                name: 'Test Product',
                price: 100,
                description: 'Test description',
                category: 'Test category',
                stock: 10,
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/products/${newProduct._id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data._id).toBe(newProduct.id);
        }));
        it('should return 404 if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidId = new mongoose_1.default.Types.ObjectId();
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/products/${invalidId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product not found');
        }));
    });
    describe('POST /api/products', () => {
        it('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
            const productData = {
                name: 'New Product',
                price: 50,
                description: 'A new product',
                category: 'Category',
                stock: 20,
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(productData);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(productData.name);
        }));
        it('should return 400 for invalid product data', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ price: 50 });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid product data');
        }));
    });
    describe('PUT /api/products/:id', () => {
        it('should update a product by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const newProduct = yield Product_1.Product.create({
                name: 'Old Product',
                price: 80,
                description: 'Old description',
                category: 'Old category',
                stock: 15,
            });
            const updatedData = {
                name: 'Updated Product',
                price: 120,
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/products/${newProduct._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(updatedData.name);
            expect(response.body.data.price).toBe(updatedData.price);
        }));
        it('should return 404 for a non-existent product ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidId = new mongoose_1.default.Types.ObjectId();
            const response = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/products/${invalidId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Updated Product' });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product not found');
        }));
    });
    describe('DELETE /api/products/:id', () => {
        it('should delete a product by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const newProduct = yield Product_1.Product.create({
                name: 'Test Product',
                price: 100,
                description: 'Description',
                category: 'Category',
                stock: 10,
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/products/${newProduct._id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Product deleted successfully');
            const productInDb = yield Product_1.Product.findById(newProduct._id);
            expect(productInDb).toBeNull();
        }));
        it('should return 404 if product does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidId = new mongoose_1.default.Types.ObjectId();
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/products/${invalidId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product not found');
        }));
    });
});

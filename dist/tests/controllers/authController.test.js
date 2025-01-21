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
const User_1 = require("../../models/User");
const hashHelper_1 = require("../../utils/hashHelper");
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Start MongoMemoryServer
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    // Check if Mongoose is already connected
    if (mongoose_1.default.connection.readyState === 0) {
        // Connect to the in-memory database
        yield mongoose_1.default.connect(uri, {});
    }
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clear all collections after each test
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        yield collections[key].deleteMany({});
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Disconnect and stop the MongoMemoryServer
    yield mongoose_1.default.connection.dropDatabase(); // Ensure the database is cleaned up
    yield mongoose_1.default.connection.close();
    yield mongoServer.stop();
}));
describe('Auth Controller', () => {
    describe('POST /register', () => {
        it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register') // Assuming this is the route for user registration
                .send(userData);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.username).toBe(userData.username);
            // Ensure the user was saved in the database
            const userInDb = yield User_1.User.findOne({ email: userData.email });
            expect(userInDb).not.toBeNull();
            expect(userInDb === null || userInDb === void 0 ? void 0 : userInDb.email).toBe(userData.email);
        }));
        it('should return 400 if email is already registered', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            // Create a user
            yield User_1.User.create({
                email: userData.email,
                password: userData.password,
                username: userData.username,
            });
            // Try registering with the same email
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send(userData);
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Email is already registered');
        }));
    });
    describe('POST /login', () => {
        it('should log in an existing user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            // Create a user
            const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(userData.password); // Assuming hashPassword exists
            yield User_1.User.create({
                email: userData.email,
                password: hashedPassword,
                username: userData.username,
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: userData.email,
                password: userData.password,
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        }));
        it('should return 404 for non-existing user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid credentials');
        }));
        it('should return 401 for incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            // Create a user
            const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(userData.password); // Assuming hashPassword exists
            yield User_1.User.create({
                email: userData.email,
                password: hashedPassword,
                username: userData.username,
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: userData.email,
                password: 'wrongpassword',
            });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid credentials');
        }));
    });
    describe('POST /logout', () => {
        it('should log out the user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            // Create and log in a user
            const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(userData.password);
            yield User_1.User.create({
                email: userData.email,
                password: hashedPassword,
                username: userData.username,
            });
            const loginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: userData.email,
                password: userData.password,
            });
            const token = loginResponse.body.token;
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Logged out successfully');
        }));
        it('should return 401 if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.setTimeout(10000); // Set timeout to 10 seconds
            const response = yield (0, supertest_1.default)(app_1.default).post('/api/auth/logout');
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Token not provided');
        }));
    });
    describe('GET /me', () => {
        it('should return user details for an authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            // Create and log in a user
            const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(userData.password);
            const user = yield User_1.User.create({
                email: userData.email,
                password: hashedPassword,
                username: userData.username,
            });
            const loginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: userData.email,
                password: userData.password,
            });
            const token = loginResponse.body.token;
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(user.email);
            expect(response.body.data.username).toBe(user.username);
        }));
        it('should return 401 if the user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/api/auth/me');
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Access denied. No token provided.');
        }));
    });
    describe('PUT /update', () => {
        it('should update user details for an authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            const updatedData = {
                username: 'updatedUser',
            };
            // Create and log in a user
            const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(userData.password);
            const user = yield User_1.User.create({
                email: userData.email,
                password: hashedPassword,
                username: userData.username,
            });
            const loginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: userData.email,
                password: userData.password,
            });
            const token = loginResponse.body.token;
            const response = yield (0, supertest_1.default)(app_1.default)
                .put('/api/auth/update')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.username).toBe(updatedData.username);
        }));
        it('should return 401 if the user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedData = {
                username: 'updatedUser',
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .put('/api/auth/update')
                .send(updatedData);
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Access denied. No token provided.');
        }));
    });
    describe('DELETE /delete', () => {
        it('should delete the user account for an authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            // Create and log in a user
            const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(userData.password);
            yield User_1.User.create({
                email: userData.email,
                password: hashedPassword,
                username: userData.username,
            });
            const loginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: userData.email,
                password: userData.password,
            });
            const token = loginResponse.body.token;
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete('/api/auth/delete')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User account deleted successfully');
            const userInDb = yield User_1.User.findOne({ email: userData.email });
            expect(userInDb).toBeNull();
        }));
        it('should return 401 if the user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).delete('/api/auth/delete');
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Access denied. No token provided.');
        }));
        it('should return 404 if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testUser',
            };
            // Create a user
            const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(userData.password);
            yield User_1.User.create({
                email: userData.email,
                password: hashedPassword,
                username: userData.username,
            });
            // Log in to get a token
            const loginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: userData.email,
                password: userData.password,
            });
            const token = loginResponse.body.token;
            // Delete the user directly from the database
            yield User_1.User.deleteOne({ email: userData.email });
            // Attempt to delete the user via API
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete('/api/auth/delete')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found');
        }));
    });
});

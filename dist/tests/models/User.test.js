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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const User_1 = require("../../models/User");
describe("User Model", () => {
    let mongoServer;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Start in-memory MongoDB server
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        // Connect to the in-memory database
        yield mongoose_1.default.connect(uri, { directConnection: true });
        // Ensure indexes are created
        yield User_1.User.ensureIndexes();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Stop MongoMemoryServer and close the connection
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield mongoServer.stop();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the User collection after each test
        yield User_1.User.deleteMany();
    }));
    it("should save a user with valid fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "securepassword123",
        };
        const user = new User_1.User(userData);
        const savedUser = yield user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
    }));
    it("should fail to save a user without required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: "test@example.com",
        };
        const user = new User_1.User(userData);
        let error = null;
        try {
            yield user.save();
        }
        catch (err) {
            error = err;
        }
        expect(error).not.toBeNull();
        if (error && error instanceof mongoose_1.default.Error.ValidationError) {
            expect(error.errors.username).toBeDefined();
            expect(error.errors.password).toBeDefined();
        }
    }));
    it("should fail to save a user with duplicate username or email", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: "duplicateuser",
            email: "duplicate@example.com",
            password: "password123",
        };
        const user1 = new User_1.User(userData);
        const user2 = new User_1.User(userData);
        yield user1.save();
        let error = null;
        try {
            yield user2.save();
        }
        catch (err) {
            error = err;
        }
        expect(error).not.toBeNull();
        if (error && error instanceof mongoose_1.default.Error) {
            expect(error.message).toContain("duplicate");
        }
    }));
    it("should save email in lowercase format", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: "lowercaseemailuser",
            email: "Test@Example.COM",
            password: "password123",
        };
        const user = new User_1.User(userData);
        const savedUser = yield user.save();
        expect(savedUser.email).toBe("test@example.com");
    }));
});

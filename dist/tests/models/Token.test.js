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
const Token_1 = require("../../models/Token");
describe("Token Model", () => {
    let mongoServer;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Start in-memory MongoDB server
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        // Connect to the in-memory database
        yield mongoose_1.default.connect(uri, { directConnection: true });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Stop MongoMemoryServer and close the connection
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield mongoServer.stop();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the Token collection after each test
        yield Token_1.Token.deleteMany();
    }));
    it("should save a token with valid fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenData = {
            token: "sample_token_123",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        };
        const token = new Token_1.Token(tokenData);
        const savedToken = yield token.save();
        expect(savedToken._id).toBeDefined();
        expect(savedToken.token).toBe(tokenData.token);
        expect(savedToken.expiresAt).toEqual(tokenData.expiresAt);
    }));
    it("should fail to save a token without required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenData = {
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        };
        const token = new Token_1.Token(tokenData);
        let error = null;
        try {
            yield token.save();
        }
        catch (err) {
            error = err;
        }
        expect(error).not.toBeNull();
        if (error && error instanceof mongoose_1.default.Error.ValidationError) {
            expect(error.errors.token).toBeDefined();
        }
    }));
    it("should fail to save a token with an invalid expiresAt date", () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenData = {
            token: "sample_token_123",
            expiresAt: "invalid_date", // Invalid date
        };
        const token = new Token_1.Token(tokenData);
        let error = null;
        try {
            yield token.save();
        }
        catch (err) {
            error = err;
        }
        expect(error).not.toBeNull();
        if (error && error instanceof mongoose_1.default.Error.ValidationError) {
            expect(error.errors.expiresAt).toBeDefined();
        }
    }));
    it("should save and include timestamps", () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenData = {
            token: "sample_token_with_timestamps",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        };
        const token = new Token_1.Token(tokenData);
        const savedToken = yield token.save();
        expect(savedToken.createdAt).toBeDefined();
        expect(savedToken.expiresAt).toBeDefined();
        expect(savedToken.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
        expect(savedToken.expiresAt.getTime()).toBeGreaterThan(Date.now());
    }));
});

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
const database_1 = __importDefault(require("../../config/database"));
jest.mock("mongoose", () => ({
    connect: jest.fn(),
    connection: {
        readyState: 0,
        close: jest.fn(),
    },
}));
describe("Database Connection", () => {
    const mockMongoURI = "mongodb://localhost:27017/test_database";
    beforeAll(() => {
        // Mock environment variable
        process.env.MONGO_URI = mockMongoURI;
    });
    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Ensure Mongoose is disconnected after tests
        yield mongoose_1.default.connection.close();
    }));
    it("should connect to the database successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock successful connection
        mongoose_1.default.connect.mockResolvedValueOnce(true);
        const logSpy = jest.spyOn(console, "log").mockImplementation();
        yield (0, database_1.default)();
        expect(mongoose_1.default.connect).toHaveBeenCalledWith(mockMongoURI);
        expect(mongoose_1.default.connect).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith("MongoDB connection successful");
        logSpy.mockRestore();
    }));
    it("should fail to connect with an invalid URI", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock failed connection
        const mockError = new Error("Invalid MongoDB URI");
        mongoose_1.default.connect.mockRejectedValueOnce(mockError);
        const errorSpy = jest.spyOn(console, "error").mockImplementation();
        const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
            throw new Error("Process exited");
        });
        try {
            yield (0, database_1.default)();
        }
        catch (err) {
            // Process exit is called, so it will throw here
        }
        expect(mongoose_1.default.connect).toHaveBeenCalledWith(mockMongoURI);
        expect(mongoose_1.default.connect).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith("MongoDB connection failed:", mockError);
        errorSpy.mockRestore();
        exitSpy.mockRestore();
    }));
});

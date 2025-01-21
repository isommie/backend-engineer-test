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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the MongoDB URI from environment variables or use the default URI
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/product_test_database";
        // Attempt to connect to the MongoDB database using the specified URI
        yield mongoose_1.default.connect(mongoURI);
        // Log success message upon successful connection
        console.log("MongoDB connection successful");
    }
    catch (error) {
        // Log error message if the connection fails
        console.error("MongoDB connection failed:", error);
        // Exit the process with a failure code
        process.exit(1); // Exit process with failure
    }
});
// Export the connectDB function to use it in other parts of the application
exports.default = connectDB;

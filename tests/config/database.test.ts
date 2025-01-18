import mongoose from "mongoose";
import connectDB from "../../src/config/database";

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

  afterAll(async () => {
    // Ensure Mongoose is disconnected after tests
    await mongoose.connection.close();
  });

  it("should connect to the database successfully", async () => {
    // Mock successful connection
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(true);
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(mockMongoURI);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("MongoDB connection successful");

    logSpy.mockRestore();
  });

  it("should fail to connect with an invalid URI", async () => {
    // Mock failed connection
    const mockError = new Error("Invalid MongoDB URI");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(mockError);

    const errorSpy = jest.spyOn(console, "error").mockImplementation();
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Process exited");
    });

    try {
      await connectDB();
    } catch (err) {
      // Process exit is called, so it will throw here
    }

    expect(mongoose.connect).toHaveBeenCalledWith(mockMongoURI);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      "MongoDB connection failed:",
      mockError
    );

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

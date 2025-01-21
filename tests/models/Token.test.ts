import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Token, IToken } from "../../src/models/Token";

describe("Token Model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(uri, { directConnection: true });
  });

  afterAll(async () => {
    // Stop MongoMemoryServer and close the connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clean up the Token collection after each test
    await Token.deleteMany();
  });

  it("should save a token with valid fields", async () => {
    const tokenData: IToken = {
      token: "sample_token_123",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    } as IToken;

    const token = new Token(tokenData);
    const savedToken = await token.save();

    expect(savedToken._id).toBeDefined();
    expect(savedToken.token).toBe(tokenData.token);
    expect(savedToken.expiresAt).toEqual(tokenData.expiresAt);
  });

  it("should fail to save a token without required fields", async () => {
    const tokenData = {
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    };

    const token = new Token(tokenData);

    let error: Error | null = null;
    try {
      await token.save();
    } catch (err) {
      error = err as mongoose.Error.ValidationError;
    }

    expect(error).not.toBeNull();
    if (error && error instanceof mongoose.Error.ValidationError) {
      expect(error.errors.token).toBeDefined();
    }
  });

  it("should fail to save a token with an invalid expiresAt date", async () => {
    const tokenData = {
      token: "sample_token_123",
      expiresAt: "invalid_date", // Invalid date
    };

    const token = new Token(tokenData);

    let error: Error | null = null;
    try {
      await token.save();
    } catch (err) {
      error = err as mongoose.Error.ValidationError;
    }

    expect(error).not.toBeNull();
    if (error && error instanceof mongoose.Error.ValidationError) {
      expect(error.errors.expiresAt).toBeDefined();
    }
  });

  it("should save and include timestamps", async () => {
    const tokenData: IToken = {
      token: "sample_token_with_timestamps",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    } as IToken;

    const token = new Token(tokenData);
    const savedToken = await token.save();

    expect(savedToken.createdAt).toBeDefined();
    expect(savedToken.expiresAt).toBeDefined();
    expect(savedToken.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(savedToken.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});

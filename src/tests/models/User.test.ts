import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, IUser } from "../../models/User";

describe("User Model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(uri, { directConnection: true });

    // Ensure indexes are created
    await User.ensureIndexes();
  });

  afterAll(async () => {
    // Stop MongoMemoryServer and close the connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clean up the User collection after each test
    await User.deleteMany();
  });

  it("should save a user with valid fields", async () => {
    const userData: IUser = {
      username: "testuser",
      email: "test@example.com",
      password: "securepassword123",
    } as IUser;

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });

  it("should fail to save a user without required fields", async () => {
    const userData = {
      email: "test@example.com",
    };

    const user = new User(userData);

    let error: Error | null = null;
    try {
      await user.save();
    } catch (err) {
      error = err as mongoose.Error.ValidationError;
    }

    expect(error).not.toBeNull();
    if (error && error instanceof mongoose.Error.ValidationError) {
      expect(error.errors.username).toBeDefined();
      expect(error.errors.password).toBeDefined();
    }
  });

  it("should fail to save a user with duplicate username or email", async () => {
    const userData = {
      username: "duplicateuser",
      email: "duplicate@example.com",
      password: "password123",
    };

    const user1 = new User(userData);
    const user2 = new User(userData);

    await user1.save();

    let error: Error | null = null;
    try {
      await user2.save();
    } catch (err) {
      error = err as mongoose.Error.ValidationError;
    }

    expect(error).not.toBeNull();
    if (error && error instanceof mongoose.Error) {
      expect(error.message).toContain("duplicate");
    }
  });

  it("should save email in lowercase format", async () => {
    const userData = {
      username: "lowercaseemailuser",
      email: "Test@Example.COM",
      password: "password123",
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.email).toBe("test@example.com");
  });
});

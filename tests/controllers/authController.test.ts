import { Request, Response } from "express";
import { registerUser, loginUser, getUserDetails, updateUser, deleteUser, logoutUser } from "../../src/controllers/authController";
import { User } from "../../src/models/User";
import { Token } from "../../src/models/Token";
import { hashHelper } from "../../src/utils/hashHelper";
import { jwtHelper } from "../../src/utils/jwtHelper";

jest.mock("../../src/models/User");
jest.mock("../../src/models/Token");
jest.mock("../../src/utils/hashHelper");
jest.mock("../../src/utils/jwtHelper");

// Define a custom interface for the user property in the request
interface MockUser {
    id: string;
    email: string;
}

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = { body: {}, user: { id: "user123", email: "test@example.com" } };
    mockRes = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const hashedPassword = "hashedPassword123";
      const newUser = { _id: "user123", email: "test@example.com", username: "testUser", password: hashedPassword };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (hashHelper.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (User.prototype.save as jest.Mock).mockResolvedValue(newUser);

      mockReq.body = { email: "test@example.com", password: "password123", username: "testUser" };

      await registerUser(mockReq as Request, mockRes as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(hashHelper.hashPassword).toHaveBeenCalledWith("password123");
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: newUser });
    });

    it("should return an error if the email is already registered", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: "test@example.com" });

      mockReq.body = { email: "test@example.com", password: "password123", username: "testUser" };

      await registerUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: "Email is already registered" });
    });
  });

  describe("loginUser", () => {
    it("should log in a user successfully", async () => {
      const user = { _id: "user123", email: "test@example.com", password: "hashedPassword123" };
      const token = "jwtToken123";

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (hashHelper.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtHelper.signToken as jest.Mock).mockReturnValue(token);

      mockReq.body = { email: "test@example.com", password: "password123" };

      await loginUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: true, token });
    });

    it("should return an error for invalid credentials", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      mockReq.body = { email: "test@example.com", password: "password123" };

      await loginUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: "Invalid credentials" });
    });
  });

  describe("getUserDetails", () => {
    it("should return user details", async () => {
      const user = { _id: "user123", email: "test@example.com", username: "testUser" };

      (User.findById as jest.Mock).mockResolvedValue(user);

      await getUserDetails(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: user });
    });

    it("should return an error if user is not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await getUserDetails(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: "User not found" });
    });
  });

  describe("updateUser", () => {
    it("should update user details", async () => {
      const updatedUser = { _id: "user123", email: "updated@example.com", username: "updatedUser" };

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      mockReq.body = { email: "updated@example.com", username: "updatedUser" };

      await updateUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: updatedUser });
    });

    it("should return an error if user is not found", async () => {
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: "User not found" });
    });
  });

  describe("deleteUser", () => {
    it("should delete user account", async () => {
      const user = { _id: "user123", email: "test@example.com", username: "testUser" };

      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(user);

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: true, message: "User account deleted successfully" });
    });

    it("should return an error if user is not found", async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: "User not found" });
    });
  });

  describe("logoutUser", () => {
    it("should log out a user successfully", async () => {
      const token = "jwtToken123";

      mockReq.headers = { authorization: `Bearer ${token}` };

      (Token.create as jest.Mock).mockResolvedValue({ token });

      await logoutUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: true, message: "Logged out successfully" });
    });

    it("should return an error if token is not provided", async () => {
      mockReq.headers = {};

      await logoutUser(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: "Token not provided" });
    });
  });
});

import mongoose from "mongoose"; 
import dotenv from "dotenv"; 

dotenv.config(); 


const connectDB = async (): Promise<void> => {
  try {
    // Get the MongoDB URI from environment variables or use the default URI
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/product_test_database";
    
    // Attempt to connect to the MongoDB database using the specified URI
    await mongoose.connect(mongoURI);
    
    // Log success message upon successful connection
    console.log("MongoDB connection successful");
  } catch (error) {
    // Log error message if the connection fails
    console.error("MongoDB connection failed:", error);
    
    // Exit the process with a failure code
    process.exit(1); // Exit process with failure
  }
};

// Export the connectDB function to use it in other parts of the application
export default connectDB;
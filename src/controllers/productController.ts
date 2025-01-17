import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';

/**
 * Get all products
 */
export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Log a message indicating the start of the operation
    logger.log('Fetching all products');
    // Fetch all products from the database
    const products = await Product.find();
    // Log a message indicating the completion of the operation
    logger.log(`Fetched ${products.length} products`);
    // Return a success response with the list of products
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    // Log an error message indicating the failed operation
    logger.error('Failed to fetch products');
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

/**
 * Get a product by ID
 */
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Log a message indicating the start of the operation
    logger.log(`Fetching product by ID: ${req.params.id}`);
    // Fetch the product using the provided ID from the request parameters
    const product = await Product.findById(req.params.id);
    if (!product) {
      // Log an error message indicating the product was not found
      logger.error(`Product with ID ${req.params.id} not found`);
      // Return an error response with a 404 status code
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    // Log a message indicating the completion of the operation
    logger.log(`Fetched product with ID: ${product.id}`);
    // Return a success response with the product details
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    // Log an error message indicating the failed operation
    logger.error('Failed to fetch a product');
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to fetch a product' });
  }
};

/**
 * Create a new product
 */
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Log a message indicating the start of the operation
    logger.log(`Creating a new product`);
    // Extract product details from the request body
    const { name, price, description, category, stock } = req.body;
    // Create a new product instance
    const product = new Product({ name, price, description, category, stock });
    // Save the new product to the database
    await product.save();
    // Log a message indicating the completion of the operation
    logger.log(`Created new product with ID: ${product.id}`);
    // Return a success response with the created product
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    // Log an error message indicating the failed operation
    logger.error('Failed to create a product');
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to create a product' });
  }
};

/**
 * Update a product by ID
 */
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Log a message indicating the start of the operation
    logger.log(`Updating product with ID: ${req.params.id}`);
    // Extract updated product details from the request body
    const { name, price, description, category, stock } = req.body;
    // Find the product by ID and update its details
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, stock },
      { new: true, runValidators: true } // Return the updated product and run validation on the data
    );
    if (!product) {
      // Log an error message indicating the product was not found
      logger.error(`Product with ID ${req.params.id} not found`);
      // Return an error response with a 404 status code
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    // Log a message indicating the completion of the operation
    logger.log(`Updated product with ID: ${product.id}`);
    // Return a success response with the updated product
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    // Log an error message indicating the failed operation
    logger.error('Failed to update a product');
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to update a product' });
  }
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Log a message indicating the start of the operation
    logger.log(`Deleting product with ID: ${req.params.id}`);
    // Find the product by ID and delete it
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      // Log an error message indicating the product was not found
      logger.error(`Product with ID ${req.params.id} not found`);
      // Return an error response with a 404 status code
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    // Log a message indicating the completion of the operation
    logger.log(`Deleted product with ID: ${product.id}`);
    // Return a success response indicating the product has been deleted
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    // Log an error message indicating the failed operation
    logger.error('Failed to delete the product');
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to delete the product' });
  }
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const Product_1 = require("../models/Product");
const logger_1 = require("../utils/logger");
/**
 * Get all products
 */
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log a message indicating the start of the operation
        logger_1.logger.log('Fetching all products');
        // Fetch all products from the database
        const products = yield Product_1.Product.find();
        // Log a message indicating the completion of the operation
        logger_1.logger.log(`Fetched ${products.length} products`);
        // Return a success response with the list of products
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        // Log an error message indicating the failed operation
        logger_1.logger.error('Failed to fetch products');
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
});
exports.getAllProducts = getAllProducts;
/**
 * Get a product by ID
 */
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log a message indicating the start of the operation
        logger_1.logger.log(`Fetching product by ID: ${req.params.id}`);
        // Fetch the product using the provided ID from the request parameters
        const product = yield Product_1.Product.findById(req.params.id);
        if (!product) {
            // Log an error message indicating the product was not found
            logger_1.logger.error(`Product with ID ${req.params.id} not found`);
            // Return an error response with a 404 status code
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Log a message indicating the completion of the operation
        logger_1.logger.log(`Fetched product with ID: ${product.id}`);
        // Return a success response with the product details
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        // Log an error message indicating the failed operation
        logger_1.logger.error('Failed to fetch a product');
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to fetch a product' });
    }
});
exports.getProductById = getProductById;
/**
 * Create a new product
 */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log a message indicating the start of the operation
        logger_1.logger.log(`Creating a new product`);
        // Extract product details from the request body
        const { name, price, description, category, stock } = req.body;
        // Ensure required fields are present
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product data',
            });
        }
        // Create a new product instance
        const product = new Product_1.Product({ name, price, description, category, stock });
        // Save the new product to the database
        yield product.save();
        // Log a message indicating the completion of the operation
        logger_1.logger.log(`Created new product with ID: ${product.id}`);
        // Return a success response with the created product
        return res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        // Log an error message indicating the failed operation
        logger_1.logger.error('Failed to create a product');
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to create a product' });
    }
});
exports.createProduct = createProduct;
/**
 * Update a product by ID
 */
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log a message indicating the start of the operation
        logger_1.logger.log(`Updating product with ID: ${req.params.id}`);
        // Extract updated product details from the request body
        const { name, price, description, category, stock } = req.body;
        // Find the product by ID and update its details
        const product = yield Product_1.Product.findByIdAndUpdate(req.params.id, { name, price, description, category, stock }, { new: true, runValidators: true } // Return the updated product and run validation on the data
        );
        if (!product) {
            // Log an error message indicating the product was not found
            logger_1.logger.error(`Product with ID ${req.params.id} not found`);
            // Return an error response with a 404 status code
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Log a message indicating the completion of the operation
        logger_1.logger.log(`Updated product with ID: ${product.id}`);
        // Return a success response with the updated product
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        // Log an error message indicating the failed operation
        logger_1.logger.error('Failed to update a product');
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to update a product' });
    }
});
exports.updateProduct = updateProduct;
/**
 * Delete a product by ID
 */
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log a message indicating the start of the operation
        logger_1.logger.log(`Deleting product with ID: ${req.params.id}`);
        // Find the product by ID and delete it
        const product = yield Product_1.Product.findByIdAndDelete(req.params.id);
        if (!product) {
            // Log an error message indicating the product was not found
            logger_1.logger.error(`Product with ID ${req.params.id} not found`);
            // Return an error response with a 404 status code
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Log a message indicating the completion of the operation
        logger_1.logger.log(`Deleted product with ID: ${product.id}`);
        // Return a success response indicating the product has been deleted
        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        // Log an error message indicating the failed operation
        logger_1.logger.error('Failed to delete the product');
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to delete the product' });
    }
});
exports.deleteProduct = deleteProduct;

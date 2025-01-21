"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
/**
 * POST /api/products
 * Protected
 * Description: Create a new product
 */
router.post('/', (0, authMiddleware_1.authenticateToken)('access'), (req, res) => {
    (0, productController_1.createProduct)(req, res);
});
/**
 * GET /api/products
 * Public
 * Description: Get all products
 */
router.get('/', (req, res) => {
    (0, productController_1.getAllProducts)(req, res);
});
/**
 * GET /api/products/:id
 * Public
 * Description: Get a single product by its ID
 */
router.get('/:id', (req, res) => {
    (0, productController_1.getProductById)(req, res);
});
/**
 * PUT /api/products/:id
 * Protected
 * Description: Update a product by its ID
 */
router.put('/:id', (0, authMiddleware_1.authenticateToken)('access'), (req, res) => {
    (0, productController_1.updateProduct)(req, res);
});
/**
 * DELETE /api/products/:id
 * Protected
 * Description: Delete a product by its ID
 */
router.delete('/:id', (0, authMiddleware_1.authenticateToken)('access'), (req, res) => {
    (0, productController_1.deleteProduct)(req, res);
});
exports.default = router;

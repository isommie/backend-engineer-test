import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/productController';

const router = Router();

/**
 * POST /api/products
 * Protected
 * Description: Create a new product
 */
router.post('/', authenticateToken('access'), (req, res) => {
    createProduct(req, res);
});

/**
 * GET /api/products
 * Public
 * Description: Get all products
 */
router.get('/', (req, res) => {
    getAllProducts(req, res);
});

/**
 * GET /api/products/:id
 * Public
 * Description: Get a single product by its ID
 */
router.get('/:id', (req, res) => {
    getProductById(req, res);
});

/**
 * PUT /api/products/:id
 * Protected
 * Description: Update a product by its ID
 */
router.put('/:id', authenticateToken('access'), (req, res) => {
    updateProduct(req, res);
});

/**
 * DELETE /api/products/:id
 * Protected
 * Description: Delete a product by its ID
 */
router.delete('/:id', authenticateToken('access'), (req, res) => {
    deleteProduct(req, res);
});

export default router;
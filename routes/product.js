import express from 'express';
const router = express.Router();
import multer from 'multer';
import productController from '../controllers/productController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
// ========== RUTAS EXISTENTES (CRUD) ==========
router.get('/', productController.listProduct);
router.post('/', upload.single('image'), productController.createProduct);
router.get('/detail/:id', productController.productDetail);
router.delete('/:id', productController.deleteProduct);
router.get('/edit/:id', productController.productEditForm);
router.put('/:id', productController.productEdit);

// ========== NUEVAS RUTAS DE FILTROS Y BÚSQUEDA ==========
router.get('/search', productController.searchProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/price-range', productController.getPriceRange);
router.get('/text-search', productController.searchProductsByText);
router.get('/by-price', productController.getProductsByPriceRange);
router.get('/categories', productController.getCategories);

export default router;
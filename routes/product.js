import express from 'express';
const router = express.Router();
import productController from '../controllers/productController.js';

router.get('/products', productController.listProduct);
router.get('/product/detail/:id', productController.productDetail);
router.get('/product/detail/edit/:id', productController.productEditForm);
router.post('/product/detail/:id', productController.productEdit);
router.post('/products', productController.createProduct);



export default router;
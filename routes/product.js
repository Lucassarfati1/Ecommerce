import express from 'express';
const router = express.Router();
import productController from '../controllers/productController.js';

router.get('/', productController.listProduct);
router.get('/detail/:id', productController.productDetail);
router.get('/detail/edit/:id', productController.productEditForm);
router.post('/detail/:id', productController.productEdit);
router.post('/createProduct', productController.createProduct);
router.delete('/detail/:id', productController.deleteProduct);



export default router;
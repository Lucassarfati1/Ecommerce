const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.listProduct);
router.get('/product/detail/:id', productController.productDetail);
router.get('/product/detail/edit/:id', productController.productEditForm);
router.post('/product/detail/:id', productController.productEdit);
router.post('/products', productController.createProduct);



module.exports = router;
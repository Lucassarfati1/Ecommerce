var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user', userController.registerForm);
router.post('/user', productController.createUser);
router.get('/login', userController.login);
router.post('/product/detail/:id', productController.productEdit);

module.exports = router;

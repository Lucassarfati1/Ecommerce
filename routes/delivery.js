const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Ruta para obtener todas las entregas
router.get('/', deliveryController.getAllDeliveries);

// Ruta para obtener una entrega por su ID
router.get('/:id', deliveryController.getDeliveryById);

// Ruta para crear una nueva entrega
router.post('/', deliveryController.createDelivery);

// Ruta para actualizar una entrega existente
router.put('/:id', deliveryController.updateDelivery);

// Ruta para eliminar una entrega
router.delete('/:id', deliveryController.deleteDelivery);

module.exports = router;

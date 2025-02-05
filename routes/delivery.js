import express from 'express';
import deliveryController from '../controllers/deliveryController.js';

const router = express.Router();

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

export default router;


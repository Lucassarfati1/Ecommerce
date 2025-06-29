import express from 'express';
const router = express.Router();
import orderController from'../controllers/orderController.js';

// Ruta para obtener todos los pagos
router.post('/', orderController.order);

// Ruta para obtener un pago por su ID
//router.get('/:id', payController.getPaymentById);
router.get('/', orderController.orders);
// Ruta para crear un nuevo pago
//router.post('/', payController.createPayment);

// Ruta para actualizar un pago existente
//router.put('/:id', payController.updatePayment);

// Ruta para eliminar un pago
//router.delete('/:id', payController.deletePayment);

export default router;
const express = require('express');
const router = express.Router();
const payController = require('../controllers/payController');

// Ruta para obtener todos los pagos
router.get('/', payController.getAllPayments);

// Ruta para obtener un pago por su ID
router.get('/:id', payController.getPaymentById);

// Ruta para crear un nuevo pago
router.post('/', payController.createPayment);

// Ruta para actualizar un pago existente
router.put('/:id', payController.updatePayment);

// Ruta para eliminar un pago
router.delete('/:id', payController.deletePayment);

module.exports = router;

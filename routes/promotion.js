const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

// Ruta para obtener todas las promociones
router.get('/', promotionController.getAllPromotions);

// Ruta para obtener una promoción por su ID
router.get('/:id', promotionController.getPromotionById);

// Ruta para crear una nueva promoción
router.post('/', promotionController.createPromotion);

// Ruta para actualizar una promoción existente
router.put('/:id', promotionController.updatePromotion);

// Ruta para eliminar una promoción
router.delete('/:id', promotionController.deletePromotion);

module.exports = router;

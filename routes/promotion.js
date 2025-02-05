import express from 'express';
const router = express.Router();
import promotionController from '../controllers/promotionController.js';

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

export default router;

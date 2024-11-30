const { Promotion } = require('../models');

const promotionController = {
  // Obtener todas las promociones
  async getAllPromotions(req, res) {
    try {
      const promotions = await Promotion.findAll();
      res.status(200).json(promotions);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las promociones', details: error.message });
    }
  },

  // Obtener una promoción por su ID
  async getPromotionById(req, res) {
    try {
      const promotion = await Promotion.findByPk(req.params.id);
      if (!promotion) {
        return res.status(404).json({ message: 'Promoción no encontrada' });
      }
      res.status(200).json(promotion);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la promoción', details: error.message });
    }
  },

  // Crear una nueva promoción
  async createPromotion(req, res) {
    try {
      const { percentage } = req.body;

      // Validación simple
      if (!percentage || isNaN(percentage)) {
        return res.status(400).json({ error: 'El campo percentage es obligatorio y debe ser un número' });
      }

      const newPromotion = await Promotion.create({ percentage });
      res.status(201).json(newPromotion);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la promoción', details: error.message });
    }
  },

  // Actualizar una promoción existente
  async updatePromotion(req, res) {
    try {
      const { id } = req.params;
      const { percentage } = req.body;

      const promotion = await Promotion.findByPk(id);
      if (!promotion) {
        return res.status(404).json({ message: 'Promoción no encontrada' });
      }

      // Actualizar los datos
      promotion.percentage = percentage || promotion.percentage;
      await promotion.save();

      res.status(200).json(promotion);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la promoción', details: error.message });
    }
  },

  // Eliminar una promoción
  async deletePromotion(req, res) {
    try {
      const { id } = req.params;
      const promotion = await Promotion.findByPk(id);
      if (!promotion) {
        return res.status(404).json({ message: 'Promoción no encontrada' });
      }

      await promotion.destroy();
      res.status(200).json({ message: 'Promoción eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la promoción', details: error.message });
    }
  }
};

module.exports = promotionController;

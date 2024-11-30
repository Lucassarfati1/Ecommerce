const { Delivery } = require('../models');

const deliveryController = {
  // Obtener todas las entregas
  async getAllDeliveries(req, res) {
    try {
      const deliveries = await Delivery.findAll();
      res.status(200).json(deliveries);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las entregas', details: error.message });
    }
  },

  // Obtener una entrega por su ID
  async getDeliveryById(req, res) {
    try {
      const delivery = await Delivery.findByPk(req.params.id);
      if (!delivery) {
        return res.status(404).json({ message: 'Entrega no encontrada' });
      }
      res.status(200).json(delivery);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la entrega', details: error.message });
    }
  },

  // Crear una nueva entrega
  async createDelivery(req, res) {
    try {
      const { id_user, id_order, time, cost } = req.body;

      // Validación simple
      if (!id_user || !id_order || !time || !cost) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const newDelivery = await Delivery.create({ id_user, id_order, time, cost });
      res.status(201).json(newDelivery);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la entrega', details: error.message });
    }
  },

  // Actualizar una entrega existente
  async updateDelivery(req, res) {
    try {
      const { id } = req.params;
      const { id_user, id_order, time, cost } = req.body;

      const delivery = await Delivery.findByPk(id);
      if (!delivery) {
        return res.status(404).json({ message: 'Entrega no encontrada' });
      }

      // Actualizar los datos
      delivery.id_user = id_user || delivery.id_user;
      delivery.id_order = id_order || delivery.id_order;
      delivery.time = time || delivery.time;
      delivery.cost = cost || delivery.cost;

      await delivery.save();

      res.status(200).json(delivery);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la entrega', details: error.message });
    }
  },

  // Eliminar una entrega
  async deleteDelivery(req, res) {
    try {
      const { id } = req.params;
      const delivery = await Delivery.findByPk(id);
      if (!delivery) {
        return res.status(404).json({ message: 'Entrega no encontrada' });
      }

      await delivery.destroy();
      res.status(200).json({ message: 'Entrega eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la entrega', details: error.message });
    }
  }
};

module.exports = deliveryController;

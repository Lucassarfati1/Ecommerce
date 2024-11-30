const { Pay, Order } = require('../models');

const payController = {
  // Obtener todos los pagos
  async getAllPayments(req, res) {
    try {
      const payments = await Pay.findAll({
        include: { model: Order, as: 'order' } // Incluye la orden asociada
      });
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los pagos', details: error.message });
    }
  },

  // Obtener un pago por su ID
  async getPaymentById(req, res) {
    try {
      const payment = await Pay.findByPk(req.params.id, {
        include: { model: Order, as: 'order' } // Incluye la orden asociada
      });
      if (!payment) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el pago', details: error.message });
    }
  },

  // Crear un nuevo pago
  async createPayment(req, res) {
    try {
      const { id_user, id_order, securityNumber, card, nameCard, maturity } = req.body;

      // Validación simple
      if (!id_user || !id_order || !securityNumber || !card || !nameCard || !maturity) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const newPayment = await Pay.create({ id_user, id_order, securityNumber, card, nameCard, maturity });
      res.status(201).json(newPayment);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el pago', details: error.message });
    }
  },

  // Actualizar un pago existente
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { id_user, id_order, securityNumber, card, nameCard, maturity } = req.body;

      const payment = await Pay.findByPk(id);
      if (!payment) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }

      // Actualizar los datos
      payment.id_user = id_user || payment.id_user;
      payment.id_order = id_order || payment.id_order;
      payment.securityNumber = securityNumber || payment.securityNumber;
      payment.card = card || payment.card;
      payment.nameCard = nameCard || payment.nameCard;
      payment.maturity = maturity || payment.maturity;

      await payment.save();

      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el pago', details: error.message });
    }
  },

  // Eliminar un pago
  async deletePayment(req, res) {
    try {
      const { id } = req.params;
      const payment = await Pay.findByPk(id);
      if (!payment) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }

      await payment.destroy();
      res.status(200).json({ message: 'Pago eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el pago', details: error.message });
    }
  }
};

module.exports = payController;

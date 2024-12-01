const db = require('../../models/index');

const orderController = {

  order: async (req, res) => {
    try {
      // Obtener datos del cuerpo de la solicitud
      const { id, total, discount, products, deliveryTime, deliveryCost } = req.body;

      // 1. Crear la orden principal en la tabla `orders`
      const newOrder = await db.Orden.create({
        id_user: id,
        total: total,
        discount: discount,
      });

      // 2. Crear detalles de la orden en la tabla `orderDetails`
      if (Array.isArray(products) && products.length > 0) {
        const orderDetails = products.map(product => ({
          id_order: newOrder.id,
          id_product: product.id_product,
          quantity: product.quantity,
          unitPrice: product.unitPrice,
          totalCost: product.quantity * product.unitPrice,
        }));

        // Crear todos los detalles de la orden
        await db.OrderDetail.bulkCreate(orderDetails);
      }

      // 3. Crear un envío (Delivery) y asociarlo a la orden creada
      const newDelivery = await db.Delivery.create({
        id_user: id, // El ID del usuario que realiza la orden
        id_order: newOrder.id, // Asociar con la orden recién creada
        time: deliveryTime, // Hora de entrega desde el front-end
        cost: deliveryCost, // Costo de entrega
      });

      // Actualizar la orden con la referencia al envío (id_delivery)
      await newOrder.update({ id_delivery: newDelivery.id });

      res.status(201).json({
        message: 'Orden, detalles y envío creados exitosamente',
        order: newOrder,
        delivery: newDelivery,
      });

    } catch (error) {
      console.error('Error al crear la orden y el envío:', error);
      res.status(500).json({
        message: 'Hubo un error al crear la orden, detalles o el envío',
        error: error.message,
      });
    }
  },
};

module.exports = orderController;

import db from '../models/index.js';

const orderController = {
  orders: async (req,res) =>{

     try {
    const orders = await db.Order.findAll({attributes:['id', 'id_user', 'total','discount', 'id_delivery', 'id_pay' ]});

    return res.json({
      success:true,
      message:'Productos obtenidos exitosamente',
      data: orders
    });
     }catch(error) {
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener productos',
        error: error.message 
      });
    }
  },
  order: async (req, res) => {
    const transaction = await db.sequelize.transaction(); // ⬅️ inicia la transacción
    try {
      const rawBody = Array.isArray(req.body)? req.body[0] : req.body;
      const { id_user, total, discount, products, deliveryTime, deliveryCost, envio, nameCard, cvv,card,maturity } = rawBody;
      console.log("BODY:", req.body);
      console.log("BODY:", rawBody);
      console.log("TYPE:", typeof req.body);
      console.log("TYPE:", typeof rawBody);

      console.log("IS ARRAY?", Array.isArray(req.body));
      console.log("IS ARRAY?", Array.isArray(rawBody));
      // 1. Crear la orden principal
      const newOrder = await db.Order.create({
        id_user: id_user,
        total: total,
        discount: discount,
      }, { transaction });

      // 2. Crear el pago asociado a esa orden
      const newPay = await db.Pay.create({ 
        id_user: id_user,
        id_order: newOrder.id, // ahora sí lo tenés
        securityNumber: cvv,
        card: card,
        nameCard: nameCard,
        maturity: maturity
        // otros campos como amount, method, estadoPago, etc. si aplican
        
      }, { transaction });

      await newOrder.update({ id_pay: newPay.id }, { transaction });
      console.log("req.body completo:", JSON.stringify(req.body, null, 2));
      if (!products) {
        console.warn("❌ La propiedad 'products' no está presente en req.body o viene vacía.");
        } else {
        console.log("✅ Products detectado:", JSON.stringify(products, null, 2));
      }

      // 3. Crear detalles de orden
      console.log("Products:", JSON.stringify(products, null, 2));

      //const productArray = Array.isArray(products) ? products : Object.values(products);
      const productArray = products;
      if (productArray && products.length > 0) {
        const orderDetails = products.map(product => ({
          id_order: newOrder.id,
          id_product: product.id,
          quantity: product.quantity,
          unitPrice: product.price,
          totalCost: product.quantity * product.price,
        }));
        await db.OrderDetail.bulkCreate(orderDetails, { transaction });
      }

      // 4. Si hay envío
      let newDelivery = null;
      if (envio) {
        newDelivery = await db.Delivery.create({
          id_user: id_user,
          id_order: newOrder.id,
          time: deliveryTime,
          cost: deliveryCost,
        }, { transaction });

        await newOrder.update({ id_delivery: newDelivery.id }, { transaction });
      }

      // 5. Confirmar todo
      await transaction.commit();

      return res.status(201).json({
        message: 'Orden, pago y detalles creados exitosamente',
        order: newOrder,
        payment: newPay,
        delivery: newDelivery,
      });
    } catch (error) {
      await transaction.rollback(); // ⬅️ si algo falla, revierte todo
      console.error('Error al crear orden/pago:', error);
      return res.status(500).json({
        message: 'Error al crear orden, pago o envío',
        error: error.message,
      });
    }
  }
};

export default orderController;

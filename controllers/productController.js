import { Product } from '../../models';

const productController = {
  listProduct: async (req, res) => {
    try {
      const products = await Product.findAll();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  createProduct: async (req, res) => {
    const { nombre, brand, unityPrice, id_category, id_promotion } = req.body;

    if (!nombre || !brand || !unityPrice || !id_category) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben ser proporcionados.',
      });
    }

    try {
      const newProduct = await Product.create({
        nombre,
        brand,
        unityPrice,
        id_category,
        id_promotion: id_promotion || null,
      });

      return res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: newProduct,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear el producto',
        error: error.message,
      });
    }
  },

  productDetail: async (req, res) => {
    const productId = req.params.id;

    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el producto con ID ${productId}`,
        });
      }

      return res.json({
        success: true,
        message: 'Producto encontrado',
        data: product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el detalle del producto',
        error: error.message,
      });
    }
  },

  productEditForm: async (req, res) => {
    const id_user = req.params.id;

    try {
      const product = await Product.findByPk(id_user);

      return res.json({
        success: true,
        message: 'Producto encontrado',
        data: product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el formulario de edición',
        error: error.message,
      });
    }
  },

  productEdit: async (req, res) => {
    const productId = req.params.id;
    const { nombre, brand, unityPrice, id_category, id_promotion } = req.body;

    if (!nombre || !brand || !unityPrice || !id_category) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben ser proporcionados.',
      });
    }

    try {
      const [affectedRows] = await Product.update(
        {
          nombre,
          brand,
          unityPrice,
          id_category,
          id_promotion: id_promotion || null,
        },
        {
          where: { id: productId },
        }
      );

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el producto con ID ${productId}`,
        });
      }

      return res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el producto',
        error: error.message,
      });
    }
  },
};

export default productController;

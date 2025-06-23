import db from '../models/index.js';
import { Op } from 'sequelize';
import streamifier from 'streamifier';
import cloudinary from '../utils/cloudinary.js';

const { Product, Category, Promotion } = db; 

const productController = {
  // ========== CRUD EXISTENTE ==========
  
  listProduct: async (req, res) => {
    try {
      const products = await Product.findAll({attributes:['id','nombre','brand','unityPrice','img']});
      return res.json({
        success: true,
        message: 'Productos obtenidos exitosamente',
        data: products
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener productos',
        error: error.message 
      });
    }
  },
createProduct: async (req, res) => {
  const { nombre, brand, unityPrice, id_category, id_promotion } = req.body;
  console.log(req.body);

  if (!nombre || !brand || !unityPrice || !id_category) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos obligatorios deben ser proporcionados.',
    });
  }

  try {
    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageUrl = result.secure_url;
    }

    const newProduct = await Product.create({
      nombre,
      brand,
      unityPrice: parseInt(unityPrice, 10),
      id_category: parseInt(id_category, 10),
      id_promotion: id_promotion ? parseInt(id_promotion, 10) : null,
      img: imageUrl,
    });

    console.log(newProduct);
    return res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct,
    });
  } catch (error) {
    console.error("Error al crear producto:", error); // Agregalo para que veas en consola
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
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: Category,
            as: 'category',
            required: false
          },
          {
            model: Promotion,
            as: 'promotion',
            required: false
          }
        ]
      });

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

  deleteProduct: async (req, res) => {
    const idProduct = req.params.id;
    console.log('ID del producto a eliminar:', idProduct);
    
    try {
      const deletedRows = await Product.destroy({ where: { id: idProduct } });

      if (deletedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el producto con ID ${idProduct}`,
        });
      }

      return res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar el producto',
        error: error.message,
      });
    }
  },

  productEditForm: async (req, res) => {
    const id_user = req.params.id;

    try {
      const product = await Product.findByPk(id_user);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el producto con ID ${id_user}`,
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
        message: 'Error al obtener el formulario de edición',
        error: error.message,
      });
    }
  },

  productEdit: async (req, res) => {
    const productId = req.params.id;
    const { nombre, brand, unityPrice, id_category, id_promotion, condition, img } = req.body;

    if (!nombre || !brand || !unityPrice || !id_category || !img) {
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
          condition: condition || 'nuevo',
          img: img || null,
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

  // ========== NUEVAS FUNCIONES DE FILTROS Y BÚSQUEDA ==========

  // Función principal de búsqueda con todos los filtros
  searchProducts: async (req, res) => {
    try {
      const {
        search,           // Búsqueda por texto
        category,         // ID de categoría
        minPrice,         // Precio mínimo
        maxPrice,         // Precio máximo
        condition,        // Estado: nuevo, usado, reacondicionado
        sortBy = 'nombre', // Campo para ordenar
        sortOrder = 'asc', // Orden: asc o desc
        page = 1,         // Página para paginación
        limit = 20        // Límite de productos por página
      } = req.query;

      // Construir la cláusula WHERE dinámicamente
      let whereClause = {};
      let orderClause = [];

      // 1. Filtro por búsqueda de texto (nombre o marca)
      if (search && search.trim()) {
        whereClause[Op.or] = [
          { nombre: { [Op.iLike]: `%${search.trim()}%` } },
          { brand: { [Op.iLike]: `%${search.trim()}%` } }
        ];
      }

      // 2. Filtro por categoría
      if (category && category !== '') {
        whereClause.id_category = parseInt(category);
      }

      // 3. Filtro por rango de precio
      if (minPrice || maxPrice) {
        whereClause.unityPrice = {};
        if (minPrice && minPrice !== '') {
          whereClause.unityPrice[Op.gte] = parseFloat(minPrice);
        }
        if (maxPrice && maxPrice !== '') {
          whereClause.unityPrice[Op.lte] = parseFloat(maxPrice);
        }
      }

      // 4. Filtro por condición/estado
      if (condition && condition !== '') {
        whereClause.condition = condition;
      }

      // 5. Configurar ordenamiento
      const validSortFields = ['nombre', 'unityPrice', 'brand', 'createdAt', 'updatedAt'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'nombre';
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      orderClause.push([sortField, sortDirection]);

      // 6. Configurar paginación
      const offset = (parseInt(page) - 1) * parseInt(limit);

      console.log('Filtros aplicados:', {
        whereClause,
        orderClause,
        page: parseInt(page),
        limit: parseInt(limit),
        offset
      });

      // 7. Ejecutar la consulta
      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category',
            required: false
          },
          {
            model: Promotion,
            as: 'promotion',
            required: false
          }
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: offset,
        distinct: true
      });

      // 8. Respuesta exitosa
      res.json({
        success: true,
        message: `${count} productos encontrados`,
        data: {
          products: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / parseInt(limit)),
            hasNext: parseInt(page) < Math.ceil(count / parseInt(limit)),
            hasPrev: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Error en searchProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar productos',
        error: error.message
      });
    }
  },

  // Función para obtener productos por categoría específica
  getProductsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 20, sortBy = 'nombre', sortOrder = 'asc' } = req.query;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: 'ID de categoría requerido'
        });
      }

      const whereClause = {
        id_category: parseInt(categoryId)
      };

      const validSortFields = ['nombre', 'unityPrice', 'brand', 'createdAt'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'nombre';
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category',
            required: false
          },
          {
            model: Promotion,
            as: 'promotion',
            required: false
          }
        ],
        order: [[sortField, sortDirection]],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        success: true,
        message: `Productos de la categoría ${categoryId}`,
        data: {
          products: rows,
          categoryId: parseInt(categoryId),
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / parseInt(limit))
          }
        }
      });

    } catch (error) {
      console.error('Error en getProductsByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener productos por categoría',
        error: error.message
      });
    }
  },

  // Función para obtener rango de precios
  getPriceRange: async (req, res) => {
    try {
      const result = await Product.findOne({
        attributes: [
          [db.sequelize.fn('MIN', db.sequelize.col('unityPrice')), 'minPrice'],
          [db.sequelize.fn('MAX', db.sequelize.col('unityPrice')), 'maxPrice']
        ],
        raw: true
      });

      res.json({
        success: true,
        message: 'Rango de precios obtenido',
        data: {
          minPrice: result.minPrice || 0,
          maxPrice: result.maxPrice || 100000
        }
      });

    } catch (error) {
      console.error('Error en getPriceRange:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener rango de precios',
        error: error.message
      });
    }
  },

  // Función para obtener todas las categorías
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        message: 'Categorías obtenidas',
        data: categories
      });

    } catch (error) {
      console.error('Error en getCategories:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener categorías',
        error: error.message
      });
    }
  },

  // Función para filtrar por precio específico
  getProductsByPriceRange: async (req, res) => {
    try {
      const { minPrice, maxPrice } = req.query;

      if (!minPrice && !maxPrice) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere al menos un precio (mínimo o máximo)'
        });
      }

      let whereClause = {};
      
      if (minPrice || maxPrice) {
        whereClause.unityPrice = {};
        if (minPrice) whereClause.unityPrice[Op.gte] = parseFloat(minPrice);
        if (maxPrice) whereClause.unityPrice[Op.lte] = parseFloat(maxPrice);
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category',
            required: false
          },
          {
            model: Promotion,
            as: 'promotion',
            required: false
          }
        ],
        order: [['unityPrice', 'ASC']]
      });

      res.json({
        success: true,
        message: `Productos en rango de precio ${minPrice || 0} - ${maxPrice || '∞'}`,
        data: products
      });

    } catch (error) {
      console.error('Error en getProductsByPriceRange:', error);
      res.status(500).json({
        success: false,
        message: 'Error al filtrar por precio',
        error: error.message
      });
    }
  },

  // Función para buscar por texto
  searchProductsByText: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Término de búsqueda requerido'
        });
      }

      const searchTerm = q.trim();

      const products = await Product.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%${searchTerm}%` } },
            { brand: { [Op.iLike]: `%${searchTerm}%` } }
          ]
        },
        include: [
          {
            model: Category,
            as: 'category',
            required: false
          },
          {
            model: Promotion,
            as: 'promotion',
            required: false
          }
        ],
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        message: `Resultados para: "${searchTerm}"`,
        data: products
      });

    } catch (error) {
      console.error('Error en searchProductsByText:', error);
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda de texto',
        error: error.message
      });
    }
  }
};

export default productController;
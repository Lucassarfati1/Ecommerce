const { Category } = require('../models');

const categoryController = {
  // Obtener todas las categorías
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las categorías', details: error.message });
    }
  },

  // Obtener una categoría por su ID
  async getCategoryById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoría', details: error.message });
    }
  },

  // Crear una nueva categoría
  async createCategory(req, res) {
    try {
      const { nombre } = req.body;

      // Validación simple
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El campo nombre es obligatorio' });
      }

      const newCategory = await Category.create({ nombre });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la categoría', details: error.message });
    }
  },

  // Actualizar una categoría existente
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      // Actualizar los datos
      category.nombre = nombre || category.nombre;
      await category.save();

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la categoría', details: error.message });
    }
  },

  // Eliminar una categoría
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      await category.destroy();
      res.status(200).json({ message: 'Categoría eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la categoría', details: error.message });
    }
  }
};

module.exports = categoryController;

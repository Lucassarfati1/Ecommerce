import db from '../models/index.js';  // Importa el objeto db
const { Category } = db;  // Desestructúralo para obtener Category

// Ahora puedes usar Category en tu controlador
console.log(Category);

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
      const { name, description} = req.body;
      console.log("Recibí un POST con:", req.body);
      // Validación simple
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El campo name es obligatorio' });
      }

      const newCategory = await Category.create({ name, description });
      return res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la categoría', details: error.message });
    }
  },

  // Actualizar una categoría existente
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name,description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      // Actualizar los datos
      category.name = name || category.name;
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
      
      await Category.destroy({ where: { id: id } });
      res.status(200).json({ message: 'Categoría eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la categoría', details: error.message });
    }
  }
};

export default categoryController;
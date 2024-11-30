const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Ruta para obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// Ruta para obtener una categoría por su ID
router.get('/:id', categoryController.getCategoryById);

// Ruta para crear una nueva categoría
router.post('/', categoryController.createCategory);

// Ruta para actualizar una categoría existente
router.put('/:id', categoryController.updateCategory);

// Ruta para eliminar una categoría
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

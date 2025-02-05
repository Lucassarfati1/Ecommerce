import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js'; // Asegúrate de que la extensión .js esté incluida

// Obtener la lista de usuarios
router.get('/', userController.listUser);

// Crear un nuevo usuario
router.post('/user', userController.createUser);

// Obtener el detalle de un usuario por ID
router.get('/:id', userController.userDetail);

// Actualizar un usuario por ID
router.put('/:id', userController.updateUser);

// Eliminar un usuario por ID
router.delete('/:id', userController.deleteUser);

export default router;

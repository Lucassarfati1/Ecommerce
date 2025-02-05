import { Association } from 'sequelize';
import db from '../models/index.js';

const userController = {
  // Obtener todos los usuarios
  listUser: async (req, res) => {
    try {
      const users = await db.User.findAll();
      res.json({
        success: true,
        message: 'Lista de usuarios',
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener la lista de usuarios',
        error: error.message,
      });
    }
  },

  // Crear un nuevo usuario
  createUser: async (req, res) => {
    const { name, lastName, genre, age, phone, email, password } = req.body;

    if (!name || !lastName || !genre || !age || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios.',
      });
    }

    try {
      const newUser = await db.User.create({
        name,
        lastName,
        genre,
        age,
        phone,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear el usuario',
        error: error.message,
      });
    }
  },

  // Obtener el detalle de un usuario por ID
  userDetail: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await db.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el usuario con ID ${userId}`,
        });
      }

      res.json({
        success: true,
        message: 'Usuario encontrado',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el detalle del usuario',
        error: error.message,
      });
    }
  },

  // Actualizar un usuario existente
  updateUser: async (req, res) => {
    const userId = req.params.id;
    const { name, lastName, genre, age, phone, email, password } = req.body;

    try {
      const [rowsUpdated] = await db.User.update(
        { name, lastName, genre, age, phone, email, password },
        { where: { id: userId } },
      );

      if (rowsUpdated === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el usuario con ID ${userId} para actualizar`,
        });
      }

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el usuario',
        error: error.message,
      });
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const rowsDeleted = await db.User.destroy({ where: { id: userId } });

      if (rowsDeleted === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el usuario con ID ${userId} para eliminar`,
        });
      }

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el usuario',
        error: error.message,
      });
    }
  },
};

export default userController;

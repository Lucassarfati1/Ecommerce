const { Association } = require('sequelize');
const db = require('../../models/index');

const userController = {
    // Obtener todos los usuarios
    listUser: (req, res) => {
        User.findAll()
            .then(users => {
                return res.json({
                    success: true,
                    message: 'Lista de usuarios',
                    data: users
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener la lista de usuarios',
                    error: error.message
                });
            });
    },

    // Crear un nuevo usuario
    createUser: (req, res) => {
        const { name, lastName, genre, age, phone, email, password } = req.body;

        if (!name || !lastName || !genre || !age || !phone || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios.'
            });
        }

        User.create({
            name,
            lastName,
            genre,
            age,
            phone,
            email,
            password
        })
            .then(newUser => {
                return res.status(201).json({
                    success: true,
                    message: 'Usuario creado exitosamente',
                    data: newUser
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear el usuario',
                    error: error.message
                });
            });
    },

    // Obtener el detalle de un usuario por ID
    userDetail: (req, res) => {
        const userId = req.params.id;

        User.findByPk(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: `No se encontró el usuario con ID ${userId}`
                    });
                }

                return res.json({
                    success: true,
                    message: 'Usuario encontrado',
                    data: user
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener el detalle del usuario',
                    error: error.message
                });
            });
    },

    // Actualizar un usuario existente
    updateUser: (req, res) => {
        const userId = req.params.id;
        const { name, lastName, genre, age, phone, email, password } = req.body;

        User.update(
            { name, lastName, genre, age, phone, email, password },
            { where: { id: userId } }
        )
            .then(([rowsUpdated]) => {
                if (rowsUpdated === 0) {
                    return res.status(404).json({
                        success: false,
                        message: `No se encontró el usuario con ID ${userId} para actualizar`
                    });
                }

                return res.json({
                    success: true,
                    message: 'Usuario actualizado exitosamente'
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el usuario',
                    error: error.message
                });
            });
    },

    // Eliminar un usuario
    deleteUser: (req, res) => {
        const userId = req.params.id;

        User.destroy({ where: { id: userId } })
            .then(rowsDeleted => {
                if (rowsDeleted === 0) {
                    return res.status(404).json({
                        success: false,
                        message: `No se encontró el usuario con ID ${userId} para eliminar`
                    });
                }

                return res.json({
                    success: true,
                    message: 'Usuario eliminado exitosamente'
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar el usuario',
                    error: error.message
                });
            });
    }
};
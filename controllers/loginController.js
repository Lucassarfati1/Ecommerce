const { Association } = require('sequelize');
import {db} from '../../models/index.js';

const loginController = {
    login: (req,res) => {

    },
    register: (req,res) => {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const nuevoUsuario = {
            name: name,
            email: email,
            password: password
          };
        db.User.create(nuevoUsuario)
        .then(usuarioCreado => {
        console.log('Usuario creado:', usuarioCreado);
        res.status(201).json(usuarioCreado);
        })
        .catch(error => {
        console.error('Error al crear el usuario:', error);
        });
        },
}
export default loginController;
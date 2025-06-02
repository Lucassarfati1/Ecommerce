import db from "../models/index.js"
import bcrypt from "bcryptjs" // Cambiado de 'bcrypt' a 'bcryptjs'
import jwt from "jsonwebtoken"

const userController = {
  // ========== CRUD EXISTENTE ==========

  // Obtener todos los usuarios
  listUser: async (req, res) => {
    try {
      const users = await db.User.findAll({
        attributes: { exclude: ["password"] }, // No devolver contraseñas
      })
      res.json({
        success: true,
        message: "Lista de usuarios",
        data: users,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener la lista de usuarios",
        error: error.message,
      })
    }
  },

  // Crear un nuevo usuario
  createUser: async (req, res) => {
    const { name, lastName, genre, age, phone,address, email, password } = req.body

    if (!name || !lastName || !genre || !age || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
      })
    }

    try {
      // Verificar si el email ya existe
      const existingUser = await db.User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado",
        })
      }

      // Encriptar contraseña
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const newUser = await db.User.create({
        name,
        lastName,
        genre,
        age,
        phone,
        address,
        email,
        password: hashedPassword,
      })

      // No devolver la contraseña
      const userResponse = { ...newUser.toJSON() }
      delete userResponse.password

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: userResponse,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al crear el usuario",
        error: error.message,
      })
    }
  },

  // Obtener el detalle de un usuario por ID
  userDetail: async (req, res) => {
    const userId = req.params.id

    try {
      const user = await db.User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el usuario con ID ${userId}`,
        })
      }

      res.json({
        success: true,
        message: "Usuario encontrado",
        data: user,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el detalle del usuario",
        error: error.message,
      })
    }
  },

  // Actualizar un usuario existente
  updateUser: async (req, res) => {
    const userId = req.params.id
    const { name, lastName, genre, age, phone, address, email, password } = req.body

    try {
      const updateData = { name, lastName, genre, age, phone,address, email }

      // Si se proporciona nueva contraseña, encriptarla
      if (password) {
        const saltRounds = 10
        updateData.password = await bcrypt.hash(password, saltRounds)
      }

      const [rowsUpdated] = await db.User.update(updateData, { where: { id: userId } })

      if (rowsUpdated === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el usuario con ID ${userId} para actualizar`,
        })
      }

      res.json({
        success: true,
        message: "Usuario actualizado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el usuario",
        error: error.message,
      })
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res) => {
    const userId = req.params.id

    try {
      const rowsDeleted = await db.User.destroy({ where: { id: userId } })

      if (rowsDeleted === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el usuario con ID ${userId} para eliminar`,
        })
      }

      res.json({
        success: true,
        message: "Usuario eliminado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar el usuario",
        error: error.message,
      })
    }
  },

  // ========== NUEVAS FUNCIONES DE AUTENTICACIÓN ==========

  // Login de usuario
  login: async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son obligatorios",
      })
    }

    try {
      // Buscar usuario por email
      const user = await db.User.findOne({ where: { email } })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        })
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        })
      }

      // Generar JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET || "tu_clave_secreta_temporal_cambiar_en_produccion",
        { expiresIn: "24h" },
      )

      // Respuesta sin contraseña
      const userResponse = { ...user.toJSON() }
      delete userResponse.password

      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          user: userResponse,
          token: token,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error en el login",
        error: error.message,
      })
    }
  },

  // Registro de usuario
  register: async (req, res) => {
    const { name, lastName, genre, age, address, email, password, confirmPassword } = req.body

    // Validaciones
    if (!name || !lastName || !genre || !age || !address || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Las contraseñas no coinciden",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      })
    }

    try {
      // Verificar si el email ya existe
      const existingUser = await db.User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado",
        })
      }

      // Encriptar contraseña
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Crear usuario
      const newUser = await db.User.create({
        name,
        lastName,
        genre,
        age,
        phone: "", // Campo opcional
        address,
        email,
        password: hashedPassword,
      })

      // Generar JWT token
      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        process.env.JWT_SECRET || "tu_clave_secreta_temporal_cambiar_en_produccion",
        { expiresIn: "24h" },
      )

      // Respuesta sin contraseña
      const userResponse = { ...newUser.toJSON() }
      delete userResponse.password

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: {
          user: userResponse,
          token: token,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al registrar usuario",
        error: error.message,
      })
    }
  },

  // Verificar token
  verifyToken: async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "tu_clave_secreta_temporal_cambiar_en_produccion")

      const user = await db.User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        })
      }

      res.json({
        success: true,
        message: "Token válido",
        data: { user },
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Token inválido",
        error: error.message,
      })
    }
  },

  // Logout (opcional - principalmente para limpiar tokens del lado del cliente)
  logout: async (req, res) => {
    res.json({
      success: true,
      message: "Logout exitoso",
    })
  },
}

export default userController

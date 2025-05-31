import express from "express"
import userController from "../controllers/userController.js"

const router = express.Router()

// ========== RUTAS EXISTENTES (CRUD) ==========
router.get("/", userController.listUser)
router.post("/", userController.createUser)
router.get("/:id", userController.userDetail)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

// ========== NUEVAS RUTAS DE AUTENTICACIÓN ==========
router.post("/login", userController.login)
router.post("/register", userController.register)
router.get("/verify-token", userController.verifyToken)
router.post("/logout", userController.logout)

export default router
const express = require("express");
const usuarioRoutes = express.Router();

const controller = require("../controllers/usuario.controller.js");

// Obtener TODOS
usuarioRoutes.get("/", controller.getUsuarios);

// Obtener por ID
usuarioRoutes.get("/:id", controller.getUsuarioById);

// Agregar usuario POST
usuarioRoutes.post("/", controller.createUsuario);

// Actualizar usuario PUT
usuarioRoutes.put("/:id", controller.updateUsuario);

// Eliminar usuario DELETE
usuarioRoutes.delete("/:id", controller.deleteUsuario);

module.exports = usuarioRoutes;

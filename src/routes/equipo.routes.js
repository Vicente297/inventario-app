const express = require("express");
const equipoRoutes = express.Router();

const controller = require("../controllers/equipo.controller.js");

// Obtener TODOS
equipoRoutes.get("/", controller.getEquipos);

// Obtener por ID
equipoRoutes.get("/:id", controller.getEquipoById);

// Agregar Equipo POST
equipoRoutes.post("/", controller.createEquipo);

// Actualizar Equipo PUT
equipoRoutes.put("/:id", controller.updateEquipo);

// Eliminar Equipo DELETE
equipoRoutes.delete("/:id", controller.deleteEquipo);

module.exports = equipoRoutes;

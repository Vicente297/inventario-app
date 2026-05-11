const express = require("express");
const asignacionRoutes = express.Router();

const controller = require("../controllers/asignacion.controller.js");

// Obtener TODOS
asignacionRoutes.get("/", controller.getAsignaciones);

// Obtener por ID
asignacionRoutes.get("/:id", controller.getAsignacionById);

// Agregar asignacion POST
asignacionRoutes.post("/", controller.createAsignacion);

// Actualizar asignacion PUT
asignacionRoutes.put("/:id", controller.updateAsignacion);

// Eliminar asignacion DELETE
asignacionRoutes.delete("/:id", controller.deleteAsignacion);

module.exports = asignacionRoutes;

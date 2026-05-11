const express = require("express");
const tecnicoRoutes = express.Router();

const controller = require("../controllers/tecnico.controller.js");

// Obtener TODOS
tecnicoRoutes.get("/", controller.getTecnicos);

// Obtener por ID
tecnicoRoutes.get("/:id", controller.getTecnicoById);

// Agregar Tecnico POST
tecnicoRoutes.post("/", controller.createTecnico);

// Actualizar Tecnico PUT
tecnicoRoutes.put("/:id", controller.updateTecnico);

// Eliminar Tecnico DELETE
tecnicoRoutes.delete("/:id", controller.deleteTecnico);

module.exports = tecnicoRoutes;

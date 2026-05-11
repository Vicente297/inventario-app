const express = require("express");
const authRoutes = express.Router();

const controller = require("../controllers/auth.controller");

authRoutes.post("/login", controller.login);

module.exports = authRoutes;

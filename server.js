const express = require("express");
const cors = require("cors");
const pool = require("./src/config/db");

const asignacionRoutes = require("./src/routes/asignacion.routes");
const equipoRoutes = require("./src/routes/equipo.routes");
const tecnicoRoutes = require("./src/routes/tecnicos.routes");
const usuarioRoutes = require("./src/routes/usuario.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.use("/api/asignaciones", asignacionRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/tecnicos", tecnicoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});

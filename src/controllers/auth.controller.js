const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const SECRET = "clave";

const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const result = await db.query(
      "SELECT * FROM usuarios_login WHERE usuario = $1",
      [usuario],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Usuario incorrecto",
      });
    }
    const user = result.rows[0];

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: user.id_usuario_login,
        rol: user.rol,
      },
      SECRET,
      {
        expiresIn: "8h",
      },
    );
    res.json({ token, rol: user.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error servidor" });
  }
};

module.exports = {
  login,
};

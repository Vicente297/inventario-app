const db = require("../config/db");

// Obtener TODOS
const getUsuarios = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.email,
        tu.num_telefono AS telefono,
        u.id_departamento,
        d.nombre_departamento,
        u.direccion,
        u.cargo
      FROM usuario u
      JOIN departamento d 
        ON u.id_departamento = d.id_departamento
      LEFT JOIN telefonousuario tu 
        ON u.id_usuario = tu.id_usuario
      ORDER BY u.id_usuario ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Obtener por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.email,
        tu.num_telefono,
        u.id_departamento,
        d.nombre_departamento,
        u.direccion,
        u.cargo
      FROM usuario u
      JOIN departamento d 
        ON u.id_departamento = d.id_departamento
      LEFT JOIN telefonousuario tu 
        ON u.id_usuario = tu.id_usuario
      WHERE u.id_usuario = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

// Crear usuario POST
const createUsuario = async (req, res) => {
  const { nombre, email, id_departamento, direccion, cargo, telefono } =
    req.body;

  try {
    const result = await db.query(
      `INSERT INTO usuario (nombre, email, id_departamento, direccion, cargo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, email, id_departamento, direccion, cargo],
    );

    const usuario = result.rows[0];

    if (telefono) {
      await db.query(
        `INSERT INTO telefonousuario (num_telefono, id_usuario)
         VALUES ($1, $2)`,
        [telefono, usuario.id_usuario],
      );
    }

    res.status(201).json({ ...usuario, telefono });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// Actualizar usuario PUT
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, id_departamento, direccion, cargo, telefono } =
    req.body;

  try {
    const updateOp = await db.query(
      `UPDATE usuario
       SET nombre = $1,
           email = $2,
           id_departamento = $3,
           direccion = $4,
           cargo = $5
       WHERE id_usuario = $6
       RETURNING *`,
      [nombre, email, id_departamento, direccion, cargo, id],
    );

    if (updateOp.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const telExiste = await db.query(
      `SELECT * FROM telefonousuario WHERE id_usuario = $1`,
      [id],
    );

    if (telefono) {
      if (telExiste.rows.length > 0) {
        await db.query(
          `UPDATE telefonousuario 
           SET num_telefono = $1
           WHERE id_usuario = $2`,
          [telefono, id],
        );
      } else {
        await db.query(
          `INSERT INTO telefonousuario (num_telefono, id_usuario)
           VALUES ($1, $2)`,
          [telefono, id],
        );
      }
    }

    res.json({ ...updateOp.rows[0], telefono });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario DELETE
const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM telefonousuario WHERE id_usuario = $1", [id]);

    const result = await db.query("DELETE FROM usuario WHERE id_usuario = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};

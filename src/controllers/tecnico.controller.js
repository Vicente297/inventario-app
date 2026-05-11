const db = require("../config/db");

// Obtener TODOS
const getTecnicos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        t.id_tecnico,
        t.nombre,
        t.email,
        tt.num_telefono AS telefono
      FROM tecnico t
      LEFT JOIN TelefonoTecnico tt 
        ON t.id_tecnico = tt.id_tecnico
      ORDER BY t.id_tecnico ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error al obtener todos los tecnicos");
  }
};

// Obtener por ID
const getTecnicoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT 
      t.id_tecnico,
      t.nombre,
      t.email,
      tt.num_telefono
      FROM tecnico t
      LEFT JOIN TelefonoTecnico tt 
      ON t.id_tecnico = tt.id_tecnico
      WHERE t.id_tecnico = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tecnico no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tecnico" });
  }
};

// Agregar Tecnico POST
const createTecnico = async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    const result = await db.query(
      `
      INSERT INTO tecnico (nombre, email) 
      VALUES ($1, $2) 
      RETURNING *
      `,
      [nombre, email],
    );

    const tecnico = result.rows[0];

    if (telefono) {
      await db.query(
        `INSERT INTO telefonotecnico (num_telefono, id_tecnico)
         VALUES ($1, $2)`,
        [telefono, tecnico.id_tecnico],
      );
    }

    res.status(201).json({ ...tecnico, telefono });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al agregar el tecnico");
  }
};

// Actualizar Tecnico PUT
const updateTecnico = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;

  try {
    const updateOp = await db.query(
      `UPDATE tecnico 
       SET nombre = $1, 
       email = $2
       WHERE id_tecnico = $3
       RETURNING *`,
      [nombre, email, id],
    );
    if (updateOp.rows.length === 0) {
      return res.status(404).json({ message: "Técnico no encontrado" });
    }

    const telExiste = await db.query(
      `SELECT * FROM telefonotecnico WHERE id_tecnico = $1`,
      [id],
    );

    if (telefono) {
      if (telExiste.rows.length > 0) {
        await db.query(
          `UPDATE telefonotecnico 
           SET num_telefono = $1
           WHERE id_tecnico = $2`,
          [telefono, id],
        );
      } else {
        await db.query(
          `INSERT INTO telefonotecnico (num_telefono, id_tecnico)
           VALUES ($1, $2)`,
          [telefono, id],
        );
      }
    }

    res.json({ ...updateOp.rows[0], telefono });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar técnico" });
  }
};

// Borrar Tecnico DELETE
const deleteTecnico = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM telefonotecnico WHERE id_tecnico = $1", [id]);

    const deleteOp = await db.query(
      "DELETE FROM tecnico WHERE id_tecnico = $1",
      [id],
    );

    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ message: "Tecnico no encontrado" });
    }

    res.json({ message: "Técnico eliminado" });
  } catch (err) {
    res.status(500).send("Error al eliminar al tecnico");
  }
};

module.exports = {
  getTecnicos,
  getTecnicoById,
  createTecnico,
  updateTecnico,
  deleteTecnico,
};

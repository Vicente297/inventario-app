const db = require("../config/db");

// Obtener TODOS
const getAsignaciones = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.id_asignacion,
        e.serie,
        u.nombre AS nombre_usuario,
        t.nombre AS nombre_tecnico,
        TO_CHAR(a.fecha_entrega, 'DD-MM-YYYY') AS fecha_entrega,
        TO_CHAR(a.fecha_recepcion, 'DD-MM-YYYY') AS fecha_recepcion
      FROM Asignacion a
      JOIN Equipo e ON a.id_equipo = e.id_equipo
      JOIN Usuario u ON a.id_usuario = u.id_usuario
      JOIN Tecnico t ON a.id_tecnico = t.id_tecnico
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener las asignaciones");
  }
};

// Obtener por ID
const getAsignacionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT
      a.id_asignacion,

      e.tipo_equipo,
      m.nombre_modelo,
      e.serie,
      e.procesador,
      e.ram,
      e.disco,
      so.nombre || ' ' || so.version AS sistema_operativo,

      u.nombre AS nombre_usuario,
      u.cargo,
      d.nombre_departamento AS departamento,
      u.direccion,

      t.nombre AS nombre_tecnico,

      TO_CHAR(a.fecha_entrega, 'DD-MM-YYYY') AS fecha_entrega,
      TO_CHAR(a.fecha_recepcion, 'DD-MM-YYYY') AS fecha_recepcion
      
      FROM Asignacion a
      JOIN Equipo e
      ON a.id_equipo = e.id_equipo
      JOIN ModeloEquipo m
      ON e.id_modelo = m.id_modelo
      LEFT JOIN SistemaOperativo so
      ON e.id_sistema_operativo = so.id_sistema_operativo
      JOIN Usuario u 
      ON a.id_usuario = u.id_usuario
      JOIN Departamento d 
      ON u.id_departamento = d.id_departamento
      JOIN Tecnico t
      ON a.id_tecnico = t.id_tecnico
      WHERE a.id_asignacion = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la asignación" });
  }
};

// Crear asignación
const createAsignacion = async (req, res) => {
  try {
    const {
      id_equipo,
      id_usuario,
      id_tecnico,
      fecha_entrega,
      fecha_recepcion,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO Asignacion (
        id_equipo,
        id_usuario,
        id_tecnico,
        fecha_entrega,
        fecha_recepcion
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [
        id_equipo,
        id_usuario,
        id_tecnico,
        fecha_entrega,
        fecha_recepcion || null,
      ],
    );
    res.status(201).json({
      message: "Asignación creada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la asignación" });
  }
};

// Actualizar asignación
const updateAsignacion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_equipo,
      id_usuario,
      id_tecnico,
      fecha_entrega,
      fecha_recepcion,
    } = req.body;

    const result = await db.query(
      `
      UPDATE Asignacion
      SET
        id_equipo = $1,
        id_usuario = $2,
        id_tecnico = $3,
        fecha_entrega = $4,
        fecha_recepcion = $5
      WHERE id_asignacion = $6
      RETURNING *
    `,
      [
        id_equipo,
        id_usuario,
        id_tecnico,
        fecha_entrega,
        fecha_recepcion || null,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Asignación no encontrada",
      });
    }
    res.json({
      message: "Asignación actualizada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la asignación" });
  }
};

// Eliminar asignación
const deleteAsignacion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      DELETE FROM Asignacion
      WHERE id_asignacion = $1
    `,
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }
    res.json({ message: "Asignación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la asignación" });
  }
};

module.exports = {
  getAsignaciones,
  getAsignacionById,
  createAsignacion,
  updateAsignacion,
  deleteAsignacion,
};

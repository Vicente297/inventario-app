const db = require("../config/db");

// Obtener TODOS
const getEquipos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.id_equipo,
        e.tipo_equipo,
        e.id_modelo,
        m.nombre_modelo,
        e.serie,
        e.procesador,
        e.ram,
        e.disco,
        e.id_sistema_operativo,
        so.nombre || ' ' || so.version AS sistema_operativo,
        e.id_estado,
        es.nombre_estado,
        e.factura,
        e.id_proveedor,
        p.nombre_proveedor,
        TO_CHAR(e.fecha_entrega_proveedor,'YYYY-MM-DD') AS fecha_entrega_proveedor,
        e.valor,
        e.garantia,
        TO_CHAR(e.termino_garantia,'YYYY-MM-DD') AS termino_garantia,
        e.comentario
      FROM Equipo e
      JOIN ModeloEquipo m
        ON e.id_modelo = m.id_modelo
      JOIN EstadoEquipo es
        ON e.id_estado = es.id_estado
      JOIN Proveedor p
        ON e.id_proveedor = p.id_proveedor
      LEFT JOIN SistemaOperativo so
        ON e.id_sistema_operativo = so.id_sistema_operativo
      ORDER BY e.id_equipo ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener equipos" });
  }
};

// Obtener por ID
const getEquipoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        e.id_equipo,
        e.tipo_equipo,
        e.id_modelo,
        m.nombre_modelo,
        e.serie,
        e.procesador,
        e.ram,
        e.disco,
        e.id_sistema_operativo,
        so.nombre || ' ' || so.version AS sistema_operativo,
        e.id_estado,
        es.nombre_estado,
        e.factura,
        e.id_proveedor,
        p.nombre_proveedor,
        TO_CHAR(e.fecha_entrega_proveedor,'YYYY-MM-DD') AS fecha_entrega_proveedor,
        e.valor,
        e.garantia,
        TO_CHAR(e.termino_garantia,'YYYY-MM-DD') AS termino_garantia,
        e.comentario
      FROM Equipo e
      JOIN ModeloEquipo m
        ON e.id_modelo = m.id_modelo
      JOIN EstadoEquipo es
        ON e.id_estado = es.id_estado
      JOIN Proveedor p
        ON e.id_proveedor = p.id_proveedor
      LEFT JOIN SistemaOperativo so
        ON e.id_sistema_operativo = so.id_sistema_operativo
      WHERE e.id_equipo = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el equipo" });
  }
};

// Agregar Equipo POST
const createEquipo = async (req, res) => {
  try {
    const {
      tipo_equipo,
      id_modelo,
      serie,
      procesador,
      ram,
      disco,
      id_sistema_operativo,
      id_estado,
      factura,
      id_proveedor,
      fecha_entrega_proveedor,
      valor,
      garantia,
      termino_garantia,
      comentario,
    } = req.body;

    const serieExistente = await db.query(
      `
      SELECT id_equipo
      FROM Equipo
      WHERE serie = $1
      `,
      [serie],
    );

    if (serieExistente.rows.length > 0) {
      return res.status(400).json({
        message: "El número de serie ya existe",
      });
    }

    const result = await db.query(
      `
      INSERT INTO Equipo (
        tipo_equipo,
        id_modelo,
        serie,
        procesador,
        ram,
        disco,
        id_sistema_operativo,
        id_estado,
        factura,
        id_proveedor,
        fecha_entrega_proveedor,
        valor,
        garantia,
        termino_garantia,
        comentario
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
      `,
      [
        tipo_equipo,
        id_modelo,
        serie,
        procesador,
        ram,
        disco,
        id_sistema_operativo,
        id_estado,
        factura,
        id_proveedor,
        fecha_entrega_proveedor,
        valor,
        garantia,
        termino_garantia,
        comentario,
      ],
    );
    res.status(201).json({ message: "Equipo creado", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear equipo" });
  }
};

// Actualizar Equipo PUT
const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tipo_equipo,
      id_modelo,
      serie,
      procesador,
      ram,
      disco,
      id_sistema_operativo,
      id_estado,
      factura,
      id_proveedor,
      fecha_entrega_proveedor,
      valor,
      garantia,
      termino_garantia,
      comentario,
    } = req.body;

    const serieExistente = await db.query(
      `
      SELECT id_equipo
      FROM Equipo
      WHERE serie = $1
        AND id_equipo <> $2
      `,
      [serie, id],
    );

    if (serieExistente.rows.length > 0) {
      return res.status(400).json({
        message: "El número de serie ya está registrado",
      });
    }

    const result = await db.query(
      `
      UPDATE Equipo
      SET
        tipo_equipo = $1,
        id_modelo = $2,
        serie = $3,
        procesador = $4,
        ram = $5,
        disco = $6,
        id_sistema_operativo = $7,
        id_estado = $8,
        factura = $9,
        id_proveedor = $10,
        fecha_entrega_proveedor = $11,
        valor = $12,
        garantia = $13,
        termino_garantia = $14,
        comentario = $15
      WHERE id_equipo = $16
      RETURNING *
      `,
      [
        tipo_equipo,
        id_modelo,
        serie,
        procesador,
        ram,
        disco,
        id_sistema_operativo,
        id_estado,
        factura,
        id_proveedor,
        fecha_entrega_proveedor,
        valor,
        garantia,
        termino_garantia,
        comentario,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar equipo" });
  }
};

// Eliminar Equipo DELETE
const deleteEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      DELETE FROM Equipo
      WHERE id_equipo = $1
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    res.json({ message: "Equipo eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar equipo" });
  }
};

module.exports = {
  getEquipos,
  getEquipoById,
  createEquipo,
  updateEquipo,
  deleteEquipo,
};

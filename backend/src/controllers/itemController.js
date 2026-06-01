const pool = require("../config/database");

const itemController = {
  // Get all items
getAllItems: async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        i.id,
        i.name,
        i.category_id,
        i.description,
        i.price_per_day,
        i.stock,
        i.created_at,

        c.name AS category_name,

        COUNT(iu.id) AS total_units,

        COALESCE(SUM(
          CASE
            WHEN iu.availability_status = 'available'
            AND iu.condition_status = 'baik'
            THEN 1
            ELSE 0
          END
        ), 0) AS available_stock,

        COALESCE(SUM(
          CASE
            WHEN iu.availability_status = 'rented'
            THEN 1
            ELSE 0
          END
        ), 0) AS rented_stock,

        COALESCE(SUM(
          CASE
            WHEN iu.availability_status = 'maintenance'
            THEN 1
            ELSE 0
          END
        ), 0) AS maintenance_stock,

        COALESCE(SUM(
          CASE
            WHEN iu.availability_status = 'lost'
            THEN 1
            ELSE 0
          END
        ), 0) AS lost_stock

      FROM items i

      LEFT JOIN categories c
      ON i.category_id = c.id

      LEFT JOIN item_units iu
      ON i.id = iu.item_id

      GROUP BY
        i.id,
        i.name,
        i.category_id,
        i.description,
        i.price_per_day,
        i.stock,
        i.created_at,
        c.name

      ORDER BY i.name
    `);

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
},
  // Create new item + generate units
createItem: async (req, res) => {
  const { name, category_id, description, price_per_day, stock } = req.body;

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      `
      INSERT INTO items
      (name, category_id, description, price_per_day, stock)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, category_id, description, price_per_day, stock]
    );

    const itemId = result.insertId;
    const prefix = name.replace(/\s+/g, "-").toUpperCase();

    for (let i = 1; i <= Number(stock); i++) {
      const unitCode = `${prefix}-${String(i).padStart(3, "0")}`;

      await connection.query(
        `
        INSERT INTO item_units
        (item_id, unit_code, condition_status, availability_status)
        VALUES (?, ?, 'baik', 'available')
        `,
        [itemId, unitCode]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Barang dan unit berhasil ditambahkan",
      item_id: itemId,
      total_unit: Number(stock),
    });
  } catch (err) {
    if (connection) await connection.rollback();

    res.status(500).json({
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
},

  // Update item data umum
  updateItem: async (req, res) => {
    const { id } = req.params;

    const {
      name,
      category_id,
      description,
      price_per_day,
    } = req.body;

    try {
      const [result] = await pool.query(
        `
        UPDATE items
        SET
          name = ?,
          category_id = ?,
          description = ?,
          price_per_day = ?
        WHERE id = ?
        `,
        [
          name,
          category_id,
          description,
          price_per_day,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Barang tidak ditemukan",
        });
      }

      res.json({
        message: "Barang berhasil diupdate",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete item
deleteItem: async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rentedUnits] = await connection.query(
      `
      SELECT id
      FROM item_units
      WHERE item_id = ?
      AND availability_status = 'rented'
      LIMIT 1
      `,
      [id]
    );

    if (rentedUnits.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Barang tidak bisa dihapus karena masih ada unit yang sedang disewa",
      });
    }

    const [units] = await connection.query(
      "SELECT id FROM item_units WHERE item_id = ?",
      [id]
    );

    const unitIds = units.map((unit) => unit.id);

    if (unitIds.length > 0) {
      await connection.query(
        "DELETE FROM item_conditions WHERE unit_id IN (?)",
        [unitIds]
      );

      await connection.query(
        "DELETE FROM rental_units WHERE unit_id IN (?)",
        [unitIds]
      );

      await connection.query("DELETE FROM item_units WHERE item_id = ?", [id]);
    }

    await connection.query("DELETE FROM rental_items WHERE item_id = ?", [id]);

    const [result] = await connection.query("DELETE FROM items WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Barang tidak ditemukan",
      });
    }

    await connection.commit();

    res.json({
      message: "Barang dan data terkait berhasil dihapus",
    });
  } catch (err) {
    if (connection) await connection.rollback();

    res.status(500).json({
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
},
};

module.exports = itemController;
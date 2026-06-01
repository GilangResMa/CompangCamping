const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET semua unit
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        iu.*,
        i.name AS item_name
      FROM item_units iu
      JOIN items i ON iu.item_id = i.id
      ORDER BY iu.id DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET unit berdasarkan item
router.get("/item/:itemId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM item_units
      WHERE item_id = ?
      ORDER BY unit_code ASC
      `,
      [req.params.itemId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BULK generate unit
router.post("/generate", async (req, res) => {
  const { item_id, total_unit } = req.body;

  try {
    if (!item_id || !total_unit) {
      return res.status(400).json({
        message: "item_id dan total_unit wajib diisi",
      });
    }

    const [items] = await pool.query(
      "SELECT name FROM items WHERE id = ?",
      [item_id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: "Item tidak ditemukan",
      });
    }

    const prefix = items[0].name.replace(/\s+/g, "-").toUpperCase();

    let created = 0;

    for (let i = 1; created < Number(total_unit); i++) {
      const unitCode = `${prefix}-${String(i).padStart(3, "0")}`;

      const [exists] = await pool.query(
        "SELECT id FROM item_units WHERE unit_code = ?",
        [unitCode]
      );

      if (exists.length > 0) continue;

      await pool.query(
        `
        INSERT INTO item_units
        (item_id, unit_code, condition_status, availability_status)
        VALUES (?, ?, 'baik', 'available')
        `,
        [item_id, unitCode]
      );

      created++;
    }

    res.status(201).json({
      message: "Unit berhasil digenerate",
      created,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE kondisi unit + simpan history
router.put("/:id/condition", async (req, res) => {
  const { id } = req.params;
  const { rental_id = null, photo_url = null, condition_after, notes = null } = req.body;

  let connection;

  try {
    if (!condition_after) {
      return res.status(400).json({
        message: "condition_after wajib diisi",
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [unitRows] = await connection.query(
      "SELECT * FROM item_units WHERE id = ?",
      [id]
    );

    if (unitRows.length === 0) {
      throw new Error("Unit tidak ditemukan");
    }

    const unit = unitRows[0];
    const condition_before = unit.condition_status;

    let availability_status = unit.availability_status;

    if (condition_after === "baik") {
      availability_status = "available";
    } else if (
      condition_after === "rusak_ringan" ||
      condition_after === "rusak_berat"
    ) {
      availability_status = "maintenance";
    } else if (condition_after === "hilang") {
      availability_status = "lost";
    }

    await connection.query(
      `
      INSERT INTO item_conditions
      (rental_id, item_id, unit_id, photo_url, condition_before, condition_after, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        rental_id,
        unit.item_id,
        id,
        photo_url,
        condition_before,
        condition_after,
        notes,
      ]
    );

    await connection.query(
      `
      UPDATE item_units
      SET condition_status = ?,
          availability_status = ?,
          notes = ?
      WHERE id = ?
      `,
      [condition_after, availability_status, notes, id]
    );

    await connection.commit();

    res.json({
      message: "Kondisi unit berhasil diupdate",
      condition_before,
      condition_after,
      availability_status,
    });
  } catch (err) {
    if (connection) await connection.rollback();

    res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// CREATE satu unit manual
router.post("/", async (req, res) => {
  const {
    item_id,
    unit_code,
    condition_status = "baik",
    availability_status = "available",
    notes,
  } = req.body;

  try {
    const [result] = await pool.query(
      `
      INSERT INTO item_units
      (item_id, unit_code, condition_status, availability_status, notes)
      VALUES (?, ?, ?, ?, ?)
      `,
      [item_id, unit_code, condition_status, availability_status, notes || null]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Unit berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE status/keterangan unit biasa
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { condition_status, availability_status, notes } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE item_units
      SET condition_status = ?,
          availability_status = ?,
          notes = ?
      WHERE id = ?
      `,
      [condition_status, availability_status, notes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit tidak ditemukan" });
    }

    res.json({ message: "Unit berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE unit
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [unitRows] = await pool.query(
      "SELECT availability_status FROM item_units WHERE id = ?",
      [id]
    );

    if (unitRows.length === 0) {
      return res.status(404).json({
        message: "Unit tidak ditemukan",
      });
    }

    if (unitRows[0].availability_status === "rented") {
      return res.status(400).json({
        message: "Unit tidak bisa dihapus karena sedang disewa",
      });
    }

    await pool.query("DELETE FROM item_conditions WHERE unit_id = ?", [id]);
    await pool.query("DELETE FROM rental_units WHERE unit_id = ?", [id]);
    await pool.query("DELETE FROM item_units WHERE id = ?", [id]);

    res.json({
      message: "Unit berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
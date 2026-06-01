// src/routes/rentals.js

const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const pool = require("../config/database");

// Create Rental
router.post("/", async (req, res) => {
  const { user_id, rental_date, return_date, items } = req.body;

  let connection;

  try {
    if (!user_id || !rental_date || !return_date || !items || items.length === 0) {
      return res.status(400).json({
        message: "Data rental belum lengkap",
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rentalResult] = await connection.query(
      `
      INSERT INTO rentals
      (user_id, rental_date, return_date, status)
      VALUES (?, ?, ?, 'pending')
      `,
      [user_id, rental_date, return_date]
    );

    const rentalId = rentalResult.insertId;

    for (const item of items) {
      const [availableUnits] = await connection.query(
        `
        SELECT id
        FROM item_units
        WHERE item_id = ?
        AND condition_status = 'baik'
        AND availability_status = 'available'
        ORDER BY id ASC
        LIMIT ?
        `,
        [item.item_id, Number(item.quantity)]
      );

      if (availableUnits.length < Number(item.quantity)) {
        throw new Error(`Unit barang ID ${item.item_id} tidak mencukupi`);
      }

      await connection.query(
        `
        INSERT INTO rental_items
        (rental_id, item_id, quantity)
        VALUES (?, ?, ?)
        `,
        [rentalId, item.item_id, item.quantity]
      );

      for (const unit of availableUnits) {
        await connection.query(
          `
          INSERT INTO rental_units
          (rental_id, unit_id)
          VALUES (?, ?)
          `,
          [rentalId, unit.id]
        );

        await connection.query(
          `
          UPDATE item_units
          SET availability_status = 'rented'
          WHERE id = ?
          `,
          [unit.id]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      rental_id: rentalId,
      message: "Rental berhasil dibuat dan unit berhasil di-reserve",
    });
  } catch (err) {
    if (connection) await connection.rollback();

    res.status(500).json({
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

// Get rental user
router.get("/user/:userId", async (req, res) => {
  try {

    const [rows] = await pool.query(
      `
      SELECT
      r.*,
      ri.quantity,
      i.name

      FROM rentals r

      JOIN rental_items ri
      ON r.id = ri.rental_id

      JOIN items i
      ON ri.item_id = i.id

      WHERE r.user_id = ?
      `,
      [req.params.userId]
    );

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});

// Get semua rental
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.id,
        r.user_id,
        u.name AS user_name,
        r.rental_date,
        r.return_date,
        r.actual_return_date,
        r.status,

        GROUP_CONCAT(
          CONCAT(i.name, ' - ', iu.unit_code)
          SEPARATOR ', '
        ) AS rented_units

      FROM rentals r

      JOIN users u
      ON r.user_id = u.id

      LEFT JOIN rental_units ru
      ON r.id = ru.rental_id

      LEFT JOIN item_units iu
      ON ru.unit_id = iu.id

      LEFT JOIN items i
      ON iu.item_id = i.id

      GROUP BY r.id

      ORDER BY r.rental_date DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
// Approve rental: pending -> active
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `
      UPDATE rentals
      SET status = 'active'
      WHERE id = ?
      AND status = 'pending'
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Rental tidak ditemukan atau status bukan pending",
      });
    }

    res.json({
      message: "Rental berhasil di-approve",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.put("/:id/cancel", async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rentalRows] = await connection.query(
      "SELECT status FROM rentals WHERE id = ?",
      [id]
    );

    if (rentalRows.length === 0) {
      throw new Error("Rental tidak ditemukan");
    }

    if (rentalRows[0].status !== "pending") {
      throw new Error("Hanya rental pending yang bisa dibatalkan");
    }

    const [units] = await connection.query(
      `
      SELECT unit_id
      FROM rental_units
      WHERE rental_id = ?
      `,
      [id]
    );

    for (const unit of units) {
      await connection.query(
        `
        UPDATE item_units
        SET availability_status = 'available'
        WHERE id = ?
        AND condition_status = 'baik'
        `,
        [unit.unit_id]
      );
    }

    await connection.query(
      `
      UPDATE rentals
      SET status = 'cancelled'
      WHERE id = ?
      `,
      [id]
    );

    await connection.commit();

    res.json({
      message: "Rental berhasil dibatalkan dan unit tersedia kembali",
    });
  } catch (err) {
    if (connection) await connection.rollback();

    res.status(500).json({
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET unit berdasarkan rental
router.get("/:id/units", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        ru.id AS rental_unit_id,

        iu.id AS unit_id,
        iu.unit_code,
        iu.condition_status,
        iu.availability_status,
        iu.notes,

        i.name AS item_name

      FROM rental_units ru

      JOIN item_units iu
      ON ru.unit_id = iu.id

      JOIN items i
      ON iu.item_id = i.id

      WHERE ru.rental_id = ?
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Return rental
router.put(
  "/:id/return",
  rentalController.returnRental
);

module.exports = router;
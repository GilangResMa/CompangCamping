// src/controllers/rentalController.js
const pool = require("../config/database");

const rentalController = {
  // Create new rental
  createRental: async (req, res) => {
    const { user_id, rental_date, return_date, items } = req.body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insert rental
      const [rentalResult] = await connection.query(
        `
        INSERT INTO rentals (user_id, rental_date, return_date, status) 
        VALUES (?, ?, ?, 'pending')`,
        [user_id, rental_date, return_date],
      );

      const rentalId = rentalResult.insertId;

      // Insert rental items & kurangi stok
      for (const item of items) {
        await connection.query(
          `
          INSERT INTO rental_items (rental_id, item_id, quantity) 
          VALUES (?, ?, ?)`,
          [rentalId, item.item_id, item.quantity],
        );

        await connection.query(
          `
          UPDATE items SET stock = stock - ? WHERE id = ?`,
          [item.quantity, item.item_id],
        );
      }

      await connection.commit();

      res.status(201).json({
        message: "Penyewaan berhasil dibuat",
        rental_id: rentalId,
      });
    } catch (err) {
      await connection.rollback();
      res.status(500).json({ error: err.message });
    } finally {
      connection.release();
    }
  },

  // Get rentals by user
  getUserRentals: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `
        SELECT r.*, ri.quantity, i.name as item_name, i.price_per_day 
        FROM rentals r
        JOIN rental_items ri ON r.id = ri.rental_id
        JOIN items i ON ri.item_id = i.id
        WHERE r.user_id = ?
        ORDER BY r.rental_date DESC`,
        [req.user.id],
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Return rental (update actual return date)
returnRental: async (req, res) => {
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

    if (rentalRows[0].status !== "active") {
      throw new Error("Hanya rental aktif yang bisa dikembalikan");
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
      SET actual_return_date = NOW(),
          status = 'returned'
      WHERE id = ?
      `,
      [id]
    );

    await connection.commit();

    res.json({
      message: "Rental berhasil dikembalikan dan unit tersedia kembali",
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

module.exports = rentalController;

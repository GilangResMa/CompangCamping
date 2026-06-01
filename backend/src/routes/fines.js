const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET semua denda
router.get("/", async (req, res) => {
  try {
    const [fines] = await pool.query(`
      SELECT 
        f.*,
        r.user_id,
        r.rental_date,
        r.return_date,
        u.name AS user_name
      FROM fines f
      JOIN rentals r ON f.rental_id = r.id
      JOIN users u ON r.user_id = u.id
      ORDER BY f.created_at DESC
    `);

    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET denda user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [fines] = await pool.query(
      `
      SELECT 
        f.*,
        r.rental_date,
        r.return_date,
        r.status AS rental_status
      FROM fines f
      JOIN rentals r ON f.rental_id = r.id
      WHERE r.user_id = ?
      ORDER BY f.created_at DESC
      `,
      [userId]
    );

    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE denda manual
router.post("/", async (req, res) => {
  const { rental_id, amount, reason } = req.body;

  try {
    if (!rental_id || !amount || !reason) {
      return res.status(400).json({
        message: "rental_id, amount, dan reason wajib diisi",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO fines (rental_id, amount, reason)
      VALUES (?, ?, ?)
      `,
      [rental_id, amount, reason]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Denda berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hitung denda otomatis keterlambatan
router.post("/calculate/:rentalId", async (req, res) => {
  try {
    const [rentals] = await pool.query(
      "SELECT * FROM rentals WHERE id = ?",
      [req.params.rentalId]
    );

    if (rentals.length === 0) {
      return res.status(404).json({
        message: "Rental tidak ditemukan",
      });
    }

    const rental = rentals[0];

    const returnDate = new Date(rental.return_date);
    const today = new Date();

    if (today > returnDate && rental.status === "active") {
      const daysLate = Math.ceil(
        (today - returnDate) / (1000 * 60 * 60 * 24)
      );

      const fineAmount = daysLate * 50000;

      const [result] = await pool.query(
        `
        INSERT INTO fines (rental_id, amount, reason)
        VALUES (?, ?, ?)
        `,
        [req.params.rentalId, fineAmount, "terlambat"]
      );

      return res.json({
        id: result.insertId,
        message: "Denda berhasil dihitung",
        amount: fineAmount,
        daysLate,
      });
    }

    res.json({
      message: "Tidak perlu denda",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE status denda paid/unpaid
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!["paid", "unpaid"].includes(status)) {
      return res.status(400).json({
        message: "Status harus paid atau unpaid",
      });
    }

    const [result] = await pool.query(
      "UPDATE fines SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Denda tidak ditemukan",
      });
    }

    res.json({
      message: "Status denda berhasil diupdate",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE denda
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM fines WHERE id = ?", [id]);

    res.json({
      message: "Denda berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
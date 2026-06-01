// src/controllers/fineController.js
const pool = require("../config/database");

const fineController = {
  // Calculate fine (bisa dipanggil manual atau otomatis)
  calculateFine: async (req, res) => {
    const { rentalId } = req.params;

    try {
      const [rentals] = await pool.query("SELECT * FROM rentals WHERE id = ?", [
        rentalId,
      ]);

      if (rentals.length === 0) {
        return res.status(404).json({ message: "Rental tidak ditemukan" });
      }

      const rental = rentals[0];

      if (rental.status !== "active") {
        return res.json({
          message: "Tidak ada denda karena status bukan active",
        });
      }

      const returnDate = new Date(rental.return_date);
      const today = new Date();

      if (today > returnDate) {
        const daysLate = Math.ceil(
          (today - returnDate) / (1000 * 60 * 60 * 24),
        );
        const fineAmount = daysLate * 50000; // Rp 50.000 / hari

        await pool.query(
          `
          INSERT INTO fines (rental_id, amount, reason) 
          VALUES (?, ?, 'terlambat')`,
          [rentalId, fineAmount],
        );

        res.json({
          message: "Denda berhasil dihitung",
          days_late: daysLate,
          fine_amount: fineAmount,
        });
      } else {
        res.json({ message: "Tidak ada denda (masih dalam masa sewa)" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get fines by user
  getUserFines: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `
        SELECT f.*, r.rental_date, r.return_date 
        FROM fines f
        JOIN rentals r ON f.rental_id = r.id
        WHERE r.user_id = ?`,
        [req.user.id],
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = fineController;

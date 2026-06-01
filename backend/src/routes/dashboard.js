const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.get("/summary", async (req, res) => {
  try {
    const [[items]] = await pool.query(
      "SELECT COUNT(*) AS total FROM items"
    );

    const [[pendingRentals]] = await pool.query(
      "SELECT COUNT(*) AS total FROM rentals WHERE status = 'pending'"
    );

    const [[activeRentals]] = await pool.query(
      "SELECT COUNT(*) AS total FROM rentals WHERE status = 'active'"
    );

    const [[unpaidFines]] = await pool.query(
      "SELECT COUNT(*) AS total FROM fines WHERE status = 'unpaid'"
    );

    res.json({
      total_items: items.total,
      pending_rentals: pendingRentals.total,
      active_rentals: activeRentals.total,
      unpaid_fines: unpaidFines.total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
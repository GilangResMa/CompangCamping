// src/routes/conditions.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { bucket } = require("../config/storage");
const pool = require("../config/database");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

// Upload Foto + Simpan Condition
router.post("/upload", upload.single("photo"), async (req, res) => {
  const { rental_id, item_id, condition_before, condition_after, notes } =
    req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Foto tidak boleh kosong" });
    }

    const fileName = `conditions/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    // Upload ke GCS
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Buat public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Simpan ke database
    const [result] = await pool.query(
      `
      INSERT INTO item_conditions 
      (rental_id, item_id, photo_url, condition_before, condition_after, notes)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [rental_id, item_id, publicUrl, condition_before, condition_after, notes],
    );

    // Update kondisi barang (opsional, tergantung kebutuhan)
    // await pool.query('UPDATE items SET condition = ? WHERE id = ?',
    //   [condition_after, item_id]);

    res.status(201).json({
      message: "Foto kondisi berhasil diupload",
      photo_url: publicUrl,
      condition_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIX: Get conditions by Item ID
router.get("/item/:itemId", async (req, res) => {
  try {
    const [conditions] = await pool.query(
      `SELECT * FROM item_conditions 
       WHERE item_id = ? 
       ORDER BY created_at DESC`,
      [req.params.itemId],
    );
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIX: Get conditions by Rental ID
router.get("/rental/:rentalId", async (req, res) => {
  try {
    const [conditions] = await pool.query(
      `SELECT * FROM item_conditions 
       WHERE rental_id = ? 
       ORDER BY created_at DESC`,
      [req.params.rentalId],
    );
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

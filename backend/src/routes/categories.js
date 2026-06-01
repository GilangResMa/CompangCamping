const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET semua kategori
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE kategori
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Kategori berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE kategori
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    res.json({
      message: "Kategori berhasil diupdate",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE kategori
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [used] = await pool.query(
      "SELECT id FROM items WHERE category_id = ? LIMIT 1",
      [id]
    );

    if (used.length > 0) {
      return res.status(400).json({
        message: "Kategori tidak bisa dihapus karena masih digunakan barang",
      });
    }

    await pool.query("DELETE FROM categories WHERE id = ?", [id]);

    res.json({
      message: "Kategori berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
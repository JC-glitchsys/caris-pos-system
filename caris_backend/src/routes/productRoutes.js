const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;

    let sql = `
      SELECT id, name, category, price, stock_quantity, created_at
      FROM products
      WHERE 1 = 1
    `;

    const values = [];

    if (search) {
      sql += " AND name LIKE ?";
      values.push(`%${search}%`);
    }

    if (category) {
      sql += " AND category = ?";
      values.push(category);
    }

    sql += " ORDER BY name ASC";

    const [products] = await pool.query(sql, values);

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

module.exports = router;
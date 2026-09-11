const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// CREATE SALE
// =========================
router.post("/", authMiddleware, async (req, res) => {
  console.log("REQ.USER:", req.user);

  const connection = await pool.getConnection();

  try {
    const { items, amount_paid } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    if (amount_paid === undefined || Number(amount_paid) < 0) {
      return res.status(400).json({
        message: "Invalid amount paid",
      });
    }

    // Make sure authenticated user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authenticated user not found",
      });
    }

    await connection.beginTransaction();

    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const [products] = await connection.query(
        `
        SELECT id, name, price, stock_quantity
        FROM products
        WHERE id = ?
        FOR UPDATE
        `,
        [productId]
      );

      if (products.length === 0) {
        throw new Error(`Product ${productId} not found`);
      }

      const product = products[0];

      if (product.stock_quantity < quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;

      totalAmount += subtotal;

      saleItems.push({
        productId,
        quantity,
        unitPrice,
        subtotal,
      });
    }

    const paid = Number(amount_paid);

    if (paid < totalAmount) {
      throw new Error("Amount paid is insufficient");
    }

    const changeAmount = paid - totalAmount;

    // =========================
    // INSERT SALE
    // =========================
    const [saleResult] = await connection.query(
      `
      INSERT INTO sales
      (user_id, total_amount, amount_paid, change_amount)
      VALUES (?, ?, ?, ?)
      `,
      [
        req.user.id,
        totalAmount,
        paid,
        changeAmount,
      ]
    );

    const saleId = saleResult.insertId;

    // =========================
    // INSERT SALE ITEMS
    // AND UPDATE STOCK
    // =========================
    for (const item of saleItems) {
      await connection.query(
        `
        INSERT INTO sale_items
        (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          saleId,
          item.productId,
          item.quantity,
          item.unitPrice,
          item.subtotal,
        ]
      );

      await connection.query(
        `
        UPDATE products
        SET stock_quantity = stock_quantity - ?
        WHERE id = ?
        `,
        [
          item.quantity,
          item.productId,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Sale completed",
      sale_id: saleId,
      total_amount: totalAmount,
      amount_paid: paid,
      change_amount: changeAmount,
    });

  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(400).json({
      message: error.message,
    });

  } finally {
    connection.release();
  }
});


// =========================
// GET SALES HISTORY
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [sales] = await pool.query(
      `
      SELECT
        id,
        user_id,
        total_amount,
        amount_paid,
        change_amount,
        created_at
      FROM sales
      ORDER BY created_at DESC
      `
    );

    res.json(sales);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
});


// =========================
// GET SALE DETAILS
// =========================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const saleId = Number(req.params.id);

    const [sales] = await pool.query(
      `
      SELECT
        id,
        user_id,
        total_amount,
        amount_paid,
        change_amount,
        created_at
      FROM sales
      WHERE id = ?
      `,
      [saleId]
    );

    if (sales.length === 0) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    const [items] = await pool.query(
      `
      SELECT
        sale_items.id,
        sale_items.product_id,
        products.name,
        sale_items.quantity,
        sale_items.unit_price,
        sale_items.subtotal
      FROM sale_items
      JOIN products
        ON sale_items.product_id = products.id
      WHERE sale_items.sale_id = ?
      `,
      [saleId]
    );

    res.json({
      sale: sales[0],
      items,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch sale",
    });
  }
});


module.exports = router;
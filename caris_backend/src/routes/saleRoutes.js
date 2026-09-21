const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { items, amount_paid } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const paid = Number(amount_paid);

    if (
      amount_paid === undefined ||
      amount_paid === null ||
      Number.isNaN(paid) ||
      paid < 0
    ) {
      return res.status(400).json({
        message: "Invalid amount paid",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authenticated user not found",
      });
    }

    const mergedItemsMap = new Map();

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error("Invalid product");
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      mergedItemsMap.set(
        productId,
        (mergedItemsMap.get(productId) || 0) + quantity
      );
    }

    const mergedItems = Array.from(mergedItemsMap.entries()).map(
      ([productId, quantity]) => ({ productId, quantity })
    );

    await connection.beginTransaction();

    let totalAmount = 0;
    const saleItems = [];

    for (const { productId, quantity } of mergedItems) {
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
        throw new Error(`Insufficient stock for ${product.name}`);
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

    if (paid < totalAmount) {
      throw new Error("Amount paid is insufficient");
    }

    const changeAmount = paid - totalAmount;

    const [saleResult] = await connection.query(
      `
      INSERT INTO sales
      (user_id, total_amount, amount_paid, change_amount)
      VALUES (?, ?, ?, ?)
      `,
      [req.user.id, totalAmount, paid, changeAmount]
    );

    const saleId = saleResult.insertId;

    for (const item of saleItems) {
      await connection.query(
        `
        INSERT INTO sale_items
        (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
        `,
        [saleId, item.productId, item.quantity, item.unitPrice, item.subtotal]
      );

      await connection.query(
        `
        UPDATE products
        SET stock_quantity = stock_quantity - ?
        WHERE id = ?
        `,
        [item.quantity, item.productId]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Sale completed",
      sale_id: saleId,
      total_amount: totalAmount,
      amount_paid: paid,
      change_amount: changeAmount,
      items: saleItems,
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({
      message: error.message,
    });
  } finally {
    connection.release();
  }
});

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
    res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const saleId = Number(req.params.id);

    if (!Number.isInteger(saleId) || saleId <= 0) {
      return res.status(400).json({
        message: "Invalid sale id",
      });
    }

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
    res.status(500).json({
      message: "Failed to fetch sale",
    });
  }
});

module.exports = router;

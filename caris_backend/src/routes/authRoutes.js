const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    console.log("Created token for user:", {
      id: user.id,
      email: user.email,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }  

        const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ 
            id: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: "4h" });

        res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
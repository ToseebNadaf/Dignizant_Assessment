const express = require("express");
const { addToCart, getCart } = require("../controllers/cartController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Add product to cart
router.post("/add", validateToken, addToCart);

// Fetch user's cart
router.get("/", validateToken, getCart);

module.exports = router;

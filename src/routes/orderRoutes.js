const express = require("express");
const { placeOrder, getUserOrders } = require("../controllers/orderController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Place an order
router.post("/", validateToken, placeOrder);

// Fetch user's orders
router.get("/:userId", validateToken, getUserOrders);

module.exports = router;

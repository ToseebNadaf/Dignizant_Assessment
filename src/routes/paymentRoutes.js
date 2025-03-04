const express = require("express");
const {
  initiatePayment,
  handleWebhook,
} = require("../controllers/paymentController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Initiate payment
router.post("/checkout", validateToken, initiatePayment);

// Stripe webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;

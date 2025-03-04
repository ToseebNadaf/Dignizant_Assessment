const express = require("express");
const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Add a review for a product
router.post("/", validateToken, addReview);

// Fetch all reviews for a product
router.get("/:productId", getProductReviews);

// Update a review
router.put("/:reviewId", validateToken, updateReview);

// Delete a review
router.delete("/:reviewId", validateToken, deleteReview);

module.exports = router;

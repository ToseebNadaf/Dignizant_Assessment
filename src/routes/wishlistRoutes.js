const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Add a product to the wishlist
router.post("/add", validateToken, addToWishlist);

// Fetch the user's wishlist
router.get("/", validateToken, getWishlist);

// Remove a product from the wishlist
router.delete("/:wishlistItemId", validateToken, removeFromWishlist);

module.exports = router;

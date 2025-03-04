const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { validateToken } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create a product
router.post("/", validateToken, checkRole("admin"), createProduct);

// Fetch all products
router.get("/", getAllProducts);

// Fetch a single product by ID
router.get("/:id", getProductById);

// Update a product (Admin Only)
router.put("/:id", validateToken, checkRole("admin"), updateProduct);

// Delete a product (Admin Only)
router.delete("/:id", validateToken, checkRole("admin"), deleteProduct);

module.exports = router;

const { prisma } = require("../config/db");

// Add a product to the wishlist
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // Check if the product is already in the user's wishlist
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        message: "Product already in wishlist",
        success: false,
      });
    }

    // Add the product to the wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    res.status(201).json({
      message: "Product added to wishlist successfully",
      success: true,
      wishlistItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Fetch the user's wishlist
const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      message: "Wishlist fetched successfully",
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Remove a product from the wishlist
const removeFromWishlist = async (req, res) => {
  const { wishlistItemId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the wishlist item exists and belongs to the user
    const wishlistItem = await prisma.wishlist.findUnique({
      where: { id: parseInt(wishlistItemId) },
    });

    if (!wishlistItem) {
      return res.status(404).json({
        message: "Wishlist item not found",
        success: false,
      });
    }

    if (wishlistItem.userId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to remove this item",
        success: false,
      });
    }

    // Remove the product from the wishlist
    await prisma.wishlist.delete({
      where: { id: parseInt(wishlistItemId) },
    });

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };

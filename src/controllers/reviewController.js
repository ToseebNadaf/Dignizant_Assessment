const { prisma } = require("../config/db");

// Add a review for a product
const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        success: false,
      });
    }

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

    // Create the review
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        comment,
      },
    });

    res.status(201).json({
      message: "Review added successfully",
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Fetch all reviews for a product
const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // Fetch all reviews for the product
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Reviews fetched successfully",
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        success: false,
      });
    }

    // Check if the review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
        success: false,
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this review",
        success: false,
      });
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: {
        rating,
        comment,
      },
    });

    res.status(200).json({
      message: "Review updated successfully",
      success: true,
      review: updatedReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
        success: false,
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this review",
        success: false,
      });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: parseInt(reviewId) },
    });

    res.status(200).json({
      message: "Review deleted successfully",
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

module.exports = { addReview, getProductReviews, updateReview, deleteReview };

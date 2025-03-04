const { prisma } = require("../config/db");

// Place an order
const placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
      });
    }

    // Calculate total price
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Fetch user's orders
const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports = { placeOrder, getUserOrders };

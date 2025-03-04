const stripe = require("../utils/stripe");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Initiate payment
const initiatePayment = async (req, res) => {
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

    // Find the existing PENDING order for the user
    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: "PENDING",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "No pending order found",
        success: false,
      });
    }

    // Create a Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`, // Redirect after successful payment
      cancel_url: `${process.env.FRONTEND_URL}/cancel`, // Redirect after canceled payment
      metadata: {
        orderId: order.id, // Pass the existing order ID in metadata
        userId: userId, // Pass the user ID in metadata
      },
    });

    res.status(200).json({
      message: "Payment initiated successfully",
      success: true,
      sessionId: session.id,
      url: session.url, // Redirect the user to this URL for payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Handle Stripe webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Construct the event using the raw request body
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Extract orderId and userId from metadata
      const orderId = session.metadata.orderId;
      const userId = session.metadata.userId;

      if (!orderId || !userId) {
        return res.status(400).json({
          message: "Order ID or User ID not found in session metadata",
          success: false,
        });
      }

      // Update the existing order status to "PAID"
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: "PAID" },
      });

      // Clear the user's cart
      await prisma.cartItem.deleteMany({
        where: { cart: { userId: parseInt(userId) } },
      });

      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

module.exports = { initiatePayment, handleWebhook };

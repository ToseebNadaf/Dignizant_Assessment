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

    // Calculate total price
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create an order in the database
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Create a Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.items.map((item) => ({
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
        orderId: order.id, // Pass the order ID in metadata
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

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Construct the event using the raw request body
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Webhook event:", event); // Debugging log
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Session data:", session); // Debugging log

      // Extract orderId from metadata
      const orderId = session.metadata.orderId;

      if (!orderId) {
        console.error("Order ID not found in session metadata");
        return res.status(400).json({
          message: "Order ID not found in session metadata",
          success: false,
        });
      }

      // Update order status to "PAID"
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: "PAID" },
      });

      // Clear the user's cart
      const userId = session.metadata.userId; // Pass userId in metadata during session creation
      await prisma.cartItem.deleteMany({
        where: { cart: { userId } },
      });

      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

module.exports = { initiatePayment, handleWebhook };

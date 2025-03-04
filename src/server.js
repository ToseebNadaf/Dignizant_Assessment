const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Error Handling
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.send("E-Commerce API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at", promise, "reason:", reason);
});

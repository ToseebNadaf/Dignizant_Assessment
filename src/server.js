const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("E-Commerce API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

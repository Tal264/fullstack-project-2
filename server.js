
require('dotenv').config(); // load .env
const express = require("express");
const connectDB = require("./db");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

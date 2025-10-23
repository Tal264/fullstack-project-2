require('dotenv').config(); // load .env
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db");

// Routers
const loginRouter = require("./routers/auth/loginRouter");
const usersRouter = require("./routers/usersRouter");
const moviesRouter = require("./routers/moviesRouter");
const membersRouter = require("./routers/membersRouter");
const subscribersRouter = require("./routers/subscribersRouter");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
  origin: [
    "https://tal264.github.io/fullstack-project-2", // correct GitHub Pages path
    "http://localhost:3000", // local dev
  ],
  credentials: true,
}));

app.use(express.json());

// Required when using secure cookies behind a proxy (Render, etc.)
app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: "none",
    secure: true, // must be true for HTTPS (Render + GitHub Pages)
  }
}));

// Routers
app.use("/auth", loginRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/members", membersRouter);
app.use("/subscribers", subscribersRouter);

// Health check endpoint
app.get("/healthz", (req, res) => res.send("OK"));

// Root route
app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

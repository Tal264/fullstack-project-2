require('dotenv').config(); // Load .env
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./db'); // your MongoDB connection module

// Routers
const loginRouter = require('./routers/auth/loginRouter');
const usersRouter = require('./routers/usersRouter');
const moviesRouter = require('./routers/moviesRouter');
const membersRouter = require('./routers/membersRouter');
const subscribersRouter = require('./routers/subscribersRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', // your local React app
    'https://tal264.github.io/fullstack-project-2', // your deployed React app
  ],
  credentials: true, // allow cookies to be sent
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// Mount routers
app.use('/auth', loginRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use('/members', membersRouter);
app.use('/subscribers', subscribersRouter);

// Health check endpoint (for Render)
app.get('/healthz', (req, res) => res.send('OK'));

// Default route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

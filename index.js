// Dependencies & DB connection
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./db');

// Routers
const loginRouter = require('./routers/auth/loginRouter');
const usersRouter = require('./routers/usersRouter');
const moviesRouter = require('./routers/moviesRouter');
const membersRouter = require('./routers/membersRouter');
const subscribersRouter = require('./routers/subscribersRouter');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render-assigned port if available

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'https://tal264.github.io/fullstack-project-2', // GitHub Pages frontend
    'http://localhost:3000',                        // optional: for local development
  ],
  credentials: true, // allow cookies to be sent
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // use env variable for security
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

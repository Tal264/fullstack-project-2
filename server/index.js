// Dependencies & DB connection
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./configs/db');

// Routers
const loginRouter = require('./routers/auth/loginRouter');
const usersRouter = require('./routers/usersRouter');
const moviesRouter = require('./routers/moviesRouter');
const membersRouter = require('./routers/membersRouter');
const subscribersRouter = require('./routers/subscribersRouter');

const app = express();
const PORT = 3000;

connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', //  frontend URL
  credentials: true, // allow cookies to be sent
}));
app.use(express.json());

app.use(
  session({
    secret: 'your-secret-key',
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

// Default route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

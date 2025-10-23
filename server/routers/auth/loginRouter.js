const express = require('express');
const router = express.Router();
const User = require('../../models/userModel');

// GET /users/loggedin
router.get('/loggedin', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});


// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username and password
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    //  Save user info in session
    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: `Error logging in: ${err.message}` });
  }
});

module.exports = router;

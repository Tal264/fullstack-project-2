const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); 

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: `Error fetching users: ${err.message}` });
  }
});

// GET logged-in user
router.get('/loggedin', (req, res) => {
  // Example: get user from session (adjust based on your auth logic)
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST add a new user
router.post('/', async (req, res) => {
  try {
    const { fullName, username, password } = req.body;
    const newUser = new User({ fullName, username, password });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: `Error adding user: ${err.message}` });
  }
});

// PUT edit user
router.put("/:id", async (req, res) => {
  try {
    const { fullName, username, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, username, password },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

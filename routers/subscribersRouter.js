const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriberModel');
const Movie = require('../models/movieModel');

// ✅ Create a new subscription (link member & movie)
router.post('/', async (req, res) => {
  try {
    const { memberId, movieName, dateWatched } = req.body;

    // Find movie by name
    const movie = await Movie.findOne({ name: movieName });
    if (!movie) {
      return res.status(404).json({ message: `Movie not found: ${movieName}` });
    }

    // Prevent duplicate subscriptions
    const exists = await Subscriber.findOne({ memberId, movieId: movie._id });
    if (exists) {
      return res.status(400).json({ message: 'Already subscribed to this movie' });
    }

    // Create subscription
    const newSubscription = new Subscriber({
      memberId,
      movieId: movie._id,
      dateWatched,
    });

    await newSubscription.save();

    res.status(201).json({
      _id: newSubscription._id,
      memberId,
      movieId: movie._id,
      movieName: movie.name,
      dateWatched: newSubscription.dateWatched?.toISOString().split("T")[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating subscription: ${err.message}` });
  }
});

// ✅ Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subs = await Subscriber.find({})
      .populate('memberId', 'name')
      .populate('movieId', 'name')
      .lean();

    const formattedSubs = subs.map(sub => ({
      _id: sub._id,
      member: sub.memberId ? { _id: sub.memberId._id, name: sub.memberId.name } : null,
      movie: sub.movieId ? { _id: sub.movieId._id, name: sub.movieId.name } : null,
      dateWatched: sub.dateWatched?.toISOString().split("T")[0],
    }));

    res.json(formattedSubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching subscriptions: ${err.message}` });
  }
});

// ✅ Get all subscriptions for a specific movie
router.get('/movie/:movieName', async (req, res) => {
  try {
    const { movieName } = req.params;

    const movie = await Movie.findOne({ name: movieName });
    if (!movie) {
      return res.status(404).json({ message: `Movie not found: ${movieName}` });
    }

    const subs = await Subscriber.find({ movieId: movie._id })
      .populate('memberId', 'name')
      .lean();

    const formattedSubs = subs.map(sub => ({
      _id: sub._id,
      member: sub.memberId ? { _id: sub.memberId._id, name: sub.memberId.name } : null,
      movie: { _id: movie._id, name: movie.name },
      dateWatched: sub.dateWatched?.toISOString().split("T")[0],
    }));

    res.json(formattedSubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching subscriptions: ${err.message}` });
  }
});

// ✅ Get all subscriptions for a specific member
router.get('/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;

    const subs = await Subscriber.find({ memberId })
      .populate('movieId', 'name')
      .lean();

    const formattedSubs = subs.map(sub => ({
      _id: sub._id,
      member: { _id: memberId },
      movie: sub.movieId ? { _id: sub.movieId._id, name: sub.movieId.name } : null,
      dateWatched: sub.dateWatched?.toISOString().split("T")[0],
    }));

    res.json(formattedSubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching member subscriptions: ${err.message}` });
  }
});

// ✅ Get a single subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sub = await Subscriber.findById(id)
      .populate('memberId', 'name')
      .populate('movieId', 'name')
      .lean();

    if (!sub) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({
      _id: sub._id,
      member: sub.memberId ? { _id: sub.memberId._id, name: sub.memberId.name } : null,
      movie: sub.movieId ? { _id: sub.movieId._id, name: sub.movieId.name } : null,
      dateWatched: sub.dateWatched?.toISOString().split("T")[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching subscription: ${err.message}` });
  }
});

module.exports = router;

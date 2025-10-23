const express = require("express");
const router = express.Router();
const Member = require("../models/memberModel");
const Subscriber = require("../models/subscriberModel");
const Movie = require("../models/movieModel");

// ✅ GET all members with movies watched
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().lean();

    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        const subs = await Subscriber.find({ memberId: member._id }).lean();

        const moviesWatched = await Promise.all(
          subs.map(async (sub) => {
            const movie = await Movie.findById(sub.movieId).lean();
            if (!movie) return null;
            return {
              _id: movie._id,
              name: movie.name,
              date: sub.dateWatched
                ? new Date(sub.dateWatched).toISOString().split("T")[0]
                : null,
            };
          })
        );

        return {
          ...member,
          movies: moviesWatched.filter(Boolean),
        };
      })
    );

    res.json(enrichedMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET member by ID, include movies watched
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id).lean();

    if (!member) return res.status(404).json({ message: "Member not found" });

    const subs = await Subscriber.find({ memberId: id }).lean();

    const moviesWatched = await Promise.all(
      subs.map(async (sub) => {
        const movie = await Movie.findById(sub.movieId).lean();
        if (!movie) return null;
        return {
          _id: movie._id,
          name: movie.name,
          date: sub.dateWatched
            ? new Date(sub.dateWatched).toISOString().split("T")[0]
            : null,
        };
      })
    );

    member.movies = moviesWatched.filter(Boolean);

    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST create a new member
router.post("/", async (req, res) => {
  try {
    const { name, email, city } = req.body;
    const newMember = new Member({ name, email, city });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT update a member
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, city } = req.body;

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { name, email, city },
      { new: true }
    );

    if (!updatedMember) return res.status(404).json({ message: "Member not found" });

    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PATCH: subscribe a member to a movie
router.patch("/:id/subscribe", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date } = req.body; // movie name and date watched

    const movie = await Movie.findOne({ name });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // prevent duplicate subscription
    const exists = await Subscriber.findOne({ memberId: id, movieId: movie._id });
    if (exists) {
      return res.status(400).json({ message: "Member already subscribed to this movie" });
    }

    const newSub = new Subscriber({
      memberId: id,
      movieId: movie._id,
      dateWatched: date,
    });
    await newSub.save();

    // return updated member with movies
    const subs = await Subscriber.find({ memberId: id }).lean();
    const moviesWatched = await Promise.all(
      subs.map(async (sub) => {
        const m = await Movie.findById(sub.movieId).lean();
        if (!m) return null;
        return {
          _id: m._id,
          name: m.name,
          date: sub.dateWatched
            ? new Date(sub.dateWatched).toISOString().split("T")[0]
            : null,
        };
      })
    );

    const member = await Member.findById(id).lean();
    member.movies = moviesWatched.filter(Boolean);

    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE a member and their subscriptions
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) return res.status(404).json({ message: "Member not found" });

    await Subscriber.deleteMany({ memberId: id });

    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE all members + subscriptions
router.delete("/", async (req, res) => {
  try {
    await Member.deleteMany({});
    await Subscriber.deleteMany({});
    res.json({ message: "All members and subscriptions deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

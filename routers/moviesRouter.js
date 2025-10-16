const express = require("express");
const router = express.Router();
const Movie = require("../models/movieModel");
const Subscriber = require("../models/subscriberModel");
const Member = require("../models/memberModel");

// GET single movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// GET all movies with subscriptions
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().lean();

    const moviesWithSubs = await Promise.all(
      movies.map(async (movie) => {
        const subs = await Subscriber.find({ movieId: movie._id }).lean();

        const subsWithMembers = await Promise.all(
          subs.map(async (sub) => {
            const member = await Member.findById(sub.memberId).lean();
            return member
              ? {
                  _id: member._id,
                  name: member.name,
                  dateWatched: sub.dateWatched
                    ? new Date(sub.dateWatched).toISOString().split("T")[0] // "2023-07-18"
                    : null,
                }
              : null;

          })
        );

        return {
          ...movie,
          subscriptions: subsWithMembers.filter(Boolean),
        };
      })
    );

    res.json(moviesWithSubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching movies: ${err.message}` });
  }
});

// POST add a new movie
router.post("/", async (req, res) => {
  try {
    const { name, year_premiered, genres, image } = req.body;
    const newMovie = new Movie({
      name,
      year_premiered,
      genres,
      image,
    });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(500).json({ message: `Error adding movie: ${err.message}` });
  }
});

// DELETE a movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully", movie: deletedMovie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// PUT update movie by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year_premiered, genres, image } = req.body;

    // Find the movie by ID and update fields
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { name, year_premiered, genres, image },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating movie: " + err.message });
  }
});


module.exports = router;

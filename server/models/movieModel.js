const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    year_premiered: String,
    genres: [String],   // array of genres
    image: String     // store URL as a string
  },
  { versionKey: false }
);

const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;

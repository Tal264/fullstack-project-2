const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Movie', 
      required: true,
    },
    dateWatched: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;

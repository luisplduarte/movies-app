const mongoose = require('mongoose');

const MovieLogsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  movieId: {
    type: String, // Assuming the movie IDs from MovieDB are strings
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const MovieLogs = mongoose.model('MovieLogs', MovieLogsSchema);

module.exports = MovieLogs;

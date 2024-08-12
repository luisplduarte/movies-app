const mongoose = require('mongoose');

const PlaylistsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  movies: [{
    type: Array,
  }],
}, { timestamps: true });

const Playlists = mongoose.model('Playlists', PlaylistsSchema);

module.exports = Playlists;

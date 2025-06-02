const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerId: String,
  gameId: String,
  score: Number,
  level: String,
  feedback: String,
  progress: Number,
  timestamp: Date,
  startedAt: Date,
});

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;

const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and get user
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
}

// Save a score
router.post('/save', authMiddleware, async (req, res) => {
  const { gameId, level, score } = req.body;
  if (!gameId || !level || typeof score !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newScore = new Score({
      user: req.userId,
      gameId,
      level,
      score
    });
    await newScore.save();
    res.json({ message: 'Score saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Get all scores for the logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.userId }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

module.exports = router;
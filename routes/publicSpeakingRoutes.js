const express = require('express');
const router = express.Router();
const axios = require('axios');

// Speech Outline (static demo)
router.post('/outline', async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  // For demo, return a static outline
  res.json({
    outline: `1. Introduction\n2. Importance of ${topic}\n3. Key Points about ${topic}\n4. Challenges\n5. Solutions\n6. Conclusion`
  });
});

// Synonyms (Datamuse API, free)
router.post('/synonyms', async (req, res) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: 'Word is required' });
  try {
    const response = await axios.get(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}`);
    const synonyms = response.data.map(obj => obj.word);
    res.json({ synonyms });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch synonyms' });
  }
});

// Grammar Feedback (LanguageTool, free)
router.post('/grammar', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  try {
    const response = await axios.post(
      'https://api.languagetool.org/v2/check',
      new URLSearchParams({ text, language: 'en-US' }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const matches = response.data.matches.map(match => match.message);
    res.json({ feedback: matches });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze grammar' });
  }
});

// Accent Tips (static/manual)
router.post('/accent', async (req, res) => {
  const { accent } = req.body;
  if (!accent) return res.status(400).json({ error: 'Accent is required' });
  const tips = {
    american: "1. Pronounce 'r' clearly at the end of words.\n2. Use flat 'a' in 'cat'.\n3. Flap 't' in 'water'.\n4. Short 'o' in 'hot'.\n5. Nasal vowels.",
    british: "1. Drop 'r' at the end of words.\n2. Use long 'a' in 'bath'.\n3. Pronounce 't' crisply.\n4. Short 'u' in 'cup'.\n5. Clear 'o' in 'not'.",
    australian: "1. Flatten vowels in 'mate'.\n2. Use rising intonation.\n3. Shorten 'i' in 'fish'.\n4. Blend words together.\n5. Nasal tone."
  };
  res.json({ tips: tips[accent] || "No tips available for this accent." });
});

// Polite Rephrasing (static/manual)
// Requires Hugging Face API key in .env as HF_API_KEY
router.post('/rephrase', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  // Simple static rephrasing for demo
  res.json({ politePhrases: 
    `Polite: "Could you please consider ...?"\nMore Polite: "Would you mind if ...?"\nMost Polite: "If it's not too much trouble, may I suggest ...?"`
  });
});

module.exports = router;
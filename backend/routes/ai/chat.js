const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/', async (req, res) => {
  const { character, message } = req.body;

  if (!character || !message) {
    return res.status(400).json({ error: 'Character and message are required.' });
  }

  const prompt = `
You are now roleplaying as "${character}" from the Rick and Morty universe.
Respond to the user's message in-character using that character's voice, tone, and personality.
Do not describe actions or break character — just speak like "${character}" would.

User: ${message}
`;

  try {
    const response = await fetch(process.env.OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'RickAndMortyAIApp'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are now acting as ${character}, a character from Rick and Morty. Speak like them.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter Chat Error:', err);
      return res.status(500).json({ error: 'Failed to generate chat response' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'No response.';

    res.json({ response: reply });

  } catch (err) {
    console.error('Chat Route Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
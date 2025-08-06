const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/', async (req, res) => {
  const { name, backstory, traits } = req.body;

  if (!name || !backstory) {
    return res.status(400).json({ error: 'Name and backstory are required.' });
  }

  const prompt = `
You're an expert in Rick and Morty lore.

Based on the following fictional character, suggest 2 to 3 Rick and Morty episodes that best align with their backstory, personality traits, or vibe.

Character:
- Name: ${name}
- Traits: ${traits || 'Not specified'}
- Backstory: ${backstory}

Respond in this format:
[
  {
    "title": "The Rickshank Redemption",
    "episode": "S03E01",
    "reason": "Involves interdimensional government conflict and scientific rebellion."
  },
  {
    "title": "The Wedding Squanchers",
    "episode": "S02E10",
    "reason": "Centers around betrayal, loyalty, and alien politics."
  }
]
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
          { role: 'system', content: 'You are a Rick and Morty episode expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter error:', err);
      return res.status(500).json({ error: 'Failed to get episode recommendations' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    let episodes = [];

    try {
      episodes = JSON.parse(content);
    } catch (err) {
      // Try regex fallback
      const match = content.match(/\[.*\]/s);
      if (match) {
        try {
          episodes = JSON.parse(match[0]);
        } catch (jsonErr) {
          console.error('Fallback JSON parse error:', jsonErr);
          return res.status(500).json({ error: 'AI returned malformed JSON' });
        }
      } else {
        console.error("Could not extract episode JSON from:", content);
        return res.status(500).json({ error: 'Could not parse episode recommendations' });
      }
    }

    res.json({ episodes });

  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
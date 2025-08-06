const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/', async (req, res) => {
  const { name, species, origin, traits } = req.body;

  const prompt = `
Generate a unique and vivid backstory for a fictional character.

Character:
- Name: ${name}
- Species: ${species}
- Origin: ${origin}
- Traits: ${traits || "Not specified"}

Keep it concise but imaginative, like a Rick and Morty episode setup.
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
          { role: 'system', content: 'You are a creative writer for Rick and Morty.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter error:', err);
      return res.status(response.status).json({ error: 'Failed to generate backstory' });
    }

    const data = await response.json();
    const backstory = data.choices?.[0]?.message?.content?.trim() || 'No backstory received.';
    res.json({ backstory });

  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
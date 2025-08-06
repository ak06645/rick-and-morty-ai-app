const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/', async (req, res) => {
  const { characters } = req.body;

  if (!Array.isArray(characters) || characters.length < 2) {
    return res.status(400).json({ error: 'At least two characters are required.' });
  }

  const descriptions = characters.map((c, i) => {
    return `Character ${i + 1}:
- Name: ${c.name}
- Species: ${c.species}
- Origin: ${c.origin?.name || 'Unknown'}
- Description: ${c.backstory || 'N/A'}`
  }).join('\n\n');

  const prompt = `
You are a relationship analyst in the Rick and Morty universe.

Based on the following character descriptions, determine the most likely relationship between them (e.g. allies, rivals, enemies, family, lovers, mentor-student, etc). Be creative but logical. Summarize your reasoning and suggest the most fitting relationship label.

${descriptions}

Respond like:
"Rick and Morty have a long and chaotic history together. Suggested Relationship: Dysfunctional Allies"
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
          { role: 'system', content: 'You are a relationship expert for fictional characters.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.85
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter Error:', errorText);
      return res.status(500).json({ error: 'Failed to generate relationship' });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim() || 'No relationship found.';
    res.json({ relationship: message });

  } catch (err) {
    console.error('Relationship Route Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/', async (req, res) => {
  const { name, backstory } = req.body;

  if (!name || !backstory) {
    return res.status(400).json({ error: 'Name and backstory are required.' });
  }

  const prompt = `
You are a psychological profiler for fictional characters. Analyze the following character and return their Big Five personality traits in JSON format.

Character Name: ${name}

Backstory:
${backstory}

Respond with only the JSON object like:
{
  "Openness": "High",
  "Conscientiousness": "Moderate",
  "Extraversion": "Low",
  "Agreeableness": "High",
  "Neuroticism": "Moderate"
}
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
          { role: 'system', content: 'You are a clinical psychologist.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter API Error:', errText);
      return res.status(500).json({ error: 'OpenRouter API call failed' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    console.log("🔍 AI Response Content:\n", content);

    // Remove markdown fencing like ```json and ```
    const cleaned = content.replace(/```json|```/g, '').trim();

    let profile;
    try {
      profile = JSON.parse(cleaned);
    } catch (jsonErr) {
      // Attempt to extract valid JSON block via regex
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          profile = JSON.parse(match[0]);
        } catch (e) {
          console.error("❌ Final JSON parse failed:", e);
          return res.status(500).json({ error: 'Invalid JSON in AI response' });
        }
      } else {
        console.error("❌ Could not extract JSON from AI content");
        return res.status(500).json({ error: 'Could not parse personality profile' });
      }
    }

    res.json({ profile });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
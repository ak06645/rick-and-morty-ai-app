const express = require('express');
const Character = require('../models/Character');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Search: External API + Custom DB
router.get('/search', async (req, res) => {
  const { name, species, page = 1 } = req.query;
  const userId = req.user?.userId;

  try {
    let apiResults = [];
    try {
      const { data } = await axios.get('https://rickandmortyapi.com/api/character', {
        params: { name, species, page }
      });
      apiResults = data.results || [];
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("R&M API error:", err.message);
      }
    }

    const mongoQuery = {
      createdBy: userId,
      ...(name && { name: new RegExp(name, 'i') }),
      ...(species && { species: new RegExp(species, 'i') })
    };

    const customChars = await Character.find(mongoQuery);

    const mapped = customChars.map(c => ({
      id: c._id,
      name: c.name,
      species: c.species,
      origin: { name: c.origin },
      image: c.image,
      backstory: c.backstory // include backstory
    }));

    res.json({ results: [...mapped, ...apiResults] });

  } catch (err) {
    console.error('Search Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    const character = await Character.create({
      ...req.body,
      createdBy: req.user.userId
    });
    res.status(201).json(character);
  } catch (err) {
    console.error('CREATE ERROR:', err);
    res.status(400).json({ error: 'Failed to create character', details: err.message });
  }
});

// Read All (User's)
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find({ createdBy: req.user.userId });
    res.json(characters);
  } catch (err) {
    console.error('READ ALL ERROR:', err);
    res.status(500).json({ error: 'Failed to load characters', details: err.message });
  }
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });
    res.json(character);
  } catch (err) {
    console.error('READ ONE ERROR:', err);
    res.status(500).json({ error: 'Failed to load character', details: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const character = await Character.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
      { new: true }
    );
    if (!character)
      return res.status(404).json({ error: 'Character not found or unauthorized' });
    res.json(character);
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ error: 'Failed to update character', details: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Character.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId
    });
    if (!deleted)
      return res.status(404).json({ error: 'Character not found or unauthorized' });
    res.json({ message: 'Character deleted' });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ error: 'Failed to delete character', details: err.message });
  }
});

// PATCH backstory
router.patch('/:id/backstory', async (req, res) => {
  const { backstory } = req.body;
  try {
    const character = await Character.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      { backstory },
      { new: true }
    );
    if (!character)
      return res.status(404).json({ error: 'Character not found or unauthorized' });

    res.json(character);
  } catch (err) {
    console.error('PATCH Backstory Error:', err);
    res.status(500).json({ error: 'Failed to update backstory' });
  }
});

// DELETE backstory
router.delete('/:id/backstory', async (req, res) => {
  try {
    const character = await Character.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      { backstory: '' },
      { new: true }
    );
    if (!character)
      return res.status(404).json({ error: 'Character not found or unauthorized' });

    res.json({ message: 'Backstory deleted' });
  } catch (err) {
    console.error('DELETE Backstory Error:', err);
    res.status(500).json({ error: 'Failed to delete backstory' });
  }
});

module.exports = router;
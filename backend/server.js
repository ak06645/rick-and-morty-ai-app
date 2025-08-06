require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const characterRoutes = require('./routes/characters');
const aiRoutes = require('./routes/ai');
const app = express();

app.use(express.json());
app.use(helmet());

// Configure CORS from .env
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin, credentials: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.send('API Running'));

// Public Routes
app.use('/api/auth', authRoutes);

// Custom Characters
app.use('/api/characters', characterRoutes);

// API 
app.use('/api/ai', aiRoutes);

// Start server 
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
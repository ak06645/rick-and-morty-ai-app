const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  status: { type: String },
  gender: { type: String },
  origin: { type: String },
  image: { type: String },
  backstory: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Auth user
}, { timestamps: true });

module.exports = mongoose.model('Character', CharacterSchema);
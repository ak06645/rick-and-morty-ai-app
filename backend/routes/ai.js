const express = require('express');
const router = express.Router();

router.use('/backstory', require('./ai/backstory'));
router.use('/chat', require('./ai/chat'));
router.use('/episodes', require('./ai/episodes'));
router.use('/personality', require('./ai/personality'));
router.use('/relationships', require('./ai/relationships'));

module.exports = router;
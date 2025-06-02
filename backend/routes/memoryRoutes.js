const express = require('express');
const { saveGameData, getGameHistory, getAllGameHistory } = require('../controllers/memoryController');
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);

// Route to get user's game history
router.get('/history/:userID', getGameHistory);

// Route to get all games history
router.get('/history', getAllGameHistory);

module.exports = router;

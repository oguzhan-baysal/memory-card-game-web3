const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
       
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

// Yeni eklenen: Belirli kullanıcının oyun geçmişini getiren fonksiyon
exports.getGameHistory = async (req, res) => {
    try {
        const { userID } = req.params;
        
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const gameHistory = await Save.find({ userID })
            .populate('userID', 'username')
            .sort({ gameDate: -1 }) // En yeni oyunlar önce
            .limit(50); // Son 50 oyun

        res.status(200).json({
            success: true,
            data: gameHistory,
            count: gameHistory.length
        });
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Error fetching game history', error });
    }
};

// Yeni eklenen: Tüm oyunların genel geçmişini getiren fonksiyon
exports.getAllGameHistory = async (req, res) => {
    try {
        const gameHistory = await Save.find({})
            .populate('userID', 'username')
            .sort({ gameDate: -1 })
            .limit(100); // Son 100 oyun

        res.status(200).json({
            success: true,
            data: gameHistory,
            count: gameHistory.length
        });
    } catch (error) {
        console.error('Error fetching all game history:', error);
        res.status(500).json({ message: 'Error fetching all game history', error });
    }
};

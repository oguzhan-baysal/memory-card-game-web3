// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MemoryGame {
    struct Game {
        uint256 gameId;
        address player;
        uint8 difficulty; // 1: Easy, 2: Normal, 3: Hard
        uint8 gridSize; // 4x4, 6x6, 8x8
        uint8 totalPairs;
        uint8 foundPairs;
        uint8 attempts;
        uint8 wrongAttempts;
        uint256 startTime;
        uint256 endTime;
        bool isCompleted;
        bool isActive;
    }

    struct Move {
        uint8 cardIndex1;
        uint8 cardIndex2;
        bool isMatch;
        uint256 timestamp;
    }

    // State variables
    uint256 private gameIdCounter;
    mapping(uint256 => Game) public games;
    mapping(uint256 => Move[]) public gameMoves;
    mapping(address => uint256[]) public playerGames;
    
    // Events
    event GameStarted(uint256 indexed gameId, address indexed player, uint8 difficulty);
    event MoveValidated(uint256 indexed gameId, uint8 card1, uint8 card2, bool isMatch);
    event GameCompleted(uint256 indexed gameId, address indexed player, uint256 duration, uint8 score);
    event GameAbandoned(uint256 indexed gameId, address indexed player);

    // Modifiers
    modifier gameExists(uint256 _gameId) {
        require(_gameId > 0 && _gameId <= gameIdCounter, "Game does not exist");
        _;
    }

    modifier onlyGamePlayer(uint256 _gameId) {
        require(games[_gameId].player == msg.sender, "Not the game player");
        _;
    }

    modifier gameIsActive(uint256 _gameId) {
        require(games[_gameId].isActive, "Game is not active");
        _;
    }

    constructor() {
        gameIdCounter = 0;
    }

    /**
     * @dev Start a new memory game
     * @param _difficulty Game difficulty (1: Easy, 2: Normal, 3: Hard)
     */
    function startGame(uint8 _difficulty) external returns (uint256) {
        require(_difficulty >= 1 && _difficulty <= 3, "Invalid difficulty");
        
        gameIdCounter++;
        uint256 newGameId = gameIdCounter;
        
        uint8 gridSize;
        uint8 totalPairs;
        
        // Set grid size and total pairs based on difficulty
        if (_difficulty == 1) { // Easy
            gridSize = 4; // 4x4 grid
            totalPairs = 8; // 16 cards, 8 pairs
        } else if (_difficulty == 2) { // Normal
            gridSize = 6; // 6x6 grid
            totalPairs = 18; // 36 cards, 18 pairs
        } else { // Hard
            gridSize = 8; // 8x8 grid
            totalPairs = 32; // 64 cards, 32 pairs
        }
        
        games[newGameId] = Game({
            gameId: newGameId,
            player: msg.sender,
            difficulty: _difficulty,
            gridSize: gridSize,
            totalPairs: totalPairs,
            foundPairs: 0,
            attempts: 0,
            wrongAttempts: 0,
            startTime: block.timestamp,
            endTime: 0,
            isCompleted: false,
            isActive: true
        });
        
        playerGames[msg.sender].push(newGameId);
        
        emit GameStarted(newGameId, msg.sender, _difficulty);
        return newGameId;
    }

    /**
     * @dev Validate a move (two cards selected)
     * @param _gameId Game ID
     * @param _card1 First card index
     * @param _card2 Second card index
     * @param _isMatch Whether the cards match (verified off-chain)
     */
    function validateMove(
        uint256 _gameId,
        uint8 _card1,
        uint8 _card2,
        bool _isMatch
    ) external gameExists(_gameId) onlyGamePlayer(_gameId) gameIsActive(_gameId) {
        require(_card1 != _card2, "Cannot select the same card twice");
        require(_card1 < games[_gameId].gridSize * games[_gameId].gridSize, "Card1 index out of bounds");
        require(_card2 < games[_gameId].gridSize * games[_gameId].gridSize, "Card2 index out of bounds");
        
        Game storage game = games[_gameId];
        game.attempts++;
        
        if (_isMatch) {
            game.foundPairs++;
        } else {
            game.wrongAttempts++;
        }
        
        // Record the move
        gameMoves[_gameId].push(Move({
            cardIndex1: _card1,
            cardIndex2: _card2,
            isMatch: _isMatch,
            timestamp: block.timestamp
        }));
        
        emit MoveValidated(_gameId, _card1, _card2, _isMatch);
        
        // Check if game is completed
        if (game.foundPairs == game.totalPairs) {
            _completeGame(_gameId);
        }
    }

    /**
     * @dev Complete the game
     * @param _gameId Game ID
     */
    function _completeGame(uint256 _gameId) internal {
        Game storage game = games[_gameId];
        game.endTime = block.timestamp;
        game.isCompleted = true;
        game.isActive = false;
        
        uint256 duration = game.endTime - game.startTime;
        uint8 score = _calculateScore(game.foundPairs, game.wrongAttempts, duration);
        
        emit GameCompleted(_gameId, game.player, duration, score);
    }

    /**
     * @dev Abandon/quit the current game
     * @param _gameId Game ID
     */
    function abandonGame(uint256 _gameId) external gameExists(_gameId) onlyGamePlayer(_gameId) gameIsActive(_gameId) {
        games[_gameId].isActive = false;
        games[_gameId].endTime = block.timestamp;
        
        emit GameAbandoned(_gameId, msg.sender);
    }

    /**
     * @dev Calculate game score based on performance
     * @param _foundPairs Number of pairs found
     * @param _wrongAttempts Number of wrong attempts
     * @param _duration Game duration in seconds
     */
    function _calculateScore(uint8 _foundPairs, uint8 _wrongAttempts, uint256 _duration) internal pure returns (uint8) {
        // Basic scoring algorithm
        uint256 baseScore = uint256(_foundPairs) * 10;
        uint256 penalty = uint256(_wrongAttempts) * 2;
        uint256 timeBonus = _duration > 0 ? (3600 / _duration) : 0; // Bonus for faster completion
        
        uint256 finalScore = baseScore + timeBonus;
        if (finalScore > penalty) {
            finalScore -= penalty;
        } else {
            finalScore = 0;
        }
        
        // Cap score at 255 (uint8 max)
        return finalScore > 255 ? 255 : uint8(finalScore);
    }

    /**
     * @dev Get game information
     * @param _gameId Game ID
     */
    function getGame(uint256 _gameId) external view gameExists(_gameId) returns (Game memory) {
        return games[_gameId];
    }

    /**
     * @dev Get all moves for a game
     * @param _gameId Game ID
     */
    function getGameMoves(uint256 _gameId) external view gameExists(_gameId) returns (Move[] memory) {
        return gameMoves[_gameId];
    }

    /**
     * @dev Get player's game history
     * @param _player Player address
     */
    function getPlayerGames(address _player) external view returns (uint256[] memory) {
        return playerGames[_player];
    }

    /**
     * @dev Get total number of games
     */
    function getTotalGames() external view returns (uint256) {
        return gameIdCounter;
    }

    /**
     * @dev Check if a game is active
     * @param _gameId Game ID
     */
    function isGameActive(uint256 _gameId) external view returns (bool) {
        if (_gameId == 0 || _gameId > gameIdCounter) {
            return false;
        }
        return games[_gameId].isActive;
    }

    /**
     * @dev Get game duration in seconds
     * @param _gameId Game ID
     */
    function getGameDuration(uint256 _gameId) external view gameExists(_gameId) returns (uint256) {
        Game memory game = games[_gameId];
        if (game.endTime > 0) {
            return game.endTime - game.startTime;
        } else if (game.isActive) {
            return block.timestamp - game.startTime;
        } else {
            return 0;
        }
    }
} 
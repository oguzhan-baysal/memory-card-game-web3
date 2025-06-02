const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemoryGame", function () {
  let memoryGame;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    // Get signers
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy MemoryGame contract
    const MemoryGame = await ethers.getContractFactory("MemoryGame");
    memoryGame = await MemoryGame.deploy();
    await memoryGame.waitForDeployment();
  });

  describe("Game Creation", function () {
    it("Should create a new game with correct parameters", async function () {
      const difficulty = 1; // Easy
      const tx = await memoryGame.connect(player1).startGame(difficulty);
      const receipt = await tx.wait();

      // Check if GameStarted event was emitted
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'GameStarted');
      expect(event).to.not.be.undefined;
      
      // Get the game details
      const gameId = 1;
      const game = await memoryGame.getGame(gameId);
      
      expect(game.gameId).to.equal(gameId);
      expect(game.player).to.equal(player1.address);
      expect(game.difficulty).to.equal(difficulty);
      expect(game.gridSize).to.equal(4); // Easy = 4x4
      expect(game.totalPairs).to.equal(8); // 16 cards = 8 pairs
      expect(game.foundPairs).to.equal(0);
      expect(game.attempts).to.equal(0);
      expect(game.wrongAttempts).to.equal(0);
      expect(game.isActive).to.be.true;
      expect(game.isCompleted).to.be.false;
    });

    it("Should reject invalid difficulty", async function () {
      await expect(
        memoryGame.connect(player1).startGame(0)
      ).to.be.revertedWith("Invalid difficulty");

      await expect(
        memoryGame.connect(player1).startGame(4)
      ).to.be.revertedWith("Invalid difficulty");
    });

    it("Should create games with different difficulties", async function () {
      // Easy game
      await memoryGame.connect(player1).startGame(1);
      const easyGame = await memoryGame.getGame(1);
      expect(easyGame.gridSize).to.equal(4);
      expect(easyGame.totalPairs).to.equal(8);

      // Normal game
      await memoryGame.connect(player1).startGame(2);
      const normalGame = await memoryGame.getGame(2);
      expect(normalGame.gridSize).to.equal(6);
      expect(normalGame.totalPairs).to.equal(18);

      // Hard game
      await memoryGame.connect(player1).startGame(3);
      const hardGame = await memoryGame.getGame(3);
      expect(hardGame.gridSize).to.equal(8);
      expect(hardGame.totalPairs).to.equal(32);
    });
  });

  describe("Game Moves", function () {
    let gameId;

    beforeEach(async function () {
      await memoryGame.connect(player1).startGame(1); // Easy game
      gameId = 1;
    });

    it("Should validate a correct move", async function () {
      const tx = await memoryGame.connect(player1).validateMove(gameId, 0, 1, true);
      const receipt = await tx.wait();

      // Check if MoveValidated event was emitted
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'MoveValidated');
      expect(event).to.not.be.undefined;

      const game = await memoryGame.getGame(gameId);
      expect(game.attempts).to.equal(1);
      expect(game.foundPairs).to.equal(1);
      expect(game.wrongAttempts).to.equal(0);
    });

    it("Should validate an incorrect move", async function () {
      await memoryGame.connect(player1).validateMove(gameId, 0, 1, false);

      const game = await memoryGame.getGame(gameId);
      expect(game.attempts).to.equal(1);
      expect(game.foundPairs).to.equal(0);
      expect(game.wrongAttempts).to.equal(1);
    });

    it("Should reject moves with same card index", async function () {
      await expect(
        memoryGame.connect(player1).validateMove(gameId, 0, 0, true)
      ).to.be.revertedWith("Cannot select the same card twice");
    });

    it("Should reject moves with out of bounds card indices", async function () {
      await expect(
        memoryGame.connect(player1).validateMove(gameId, 0, 16, true)
      ).to.be.revertedWith("Card2 index out of bounds");
    });

    it("Should reject moves from non-game players", async function () {
      await expect(
        memoryGame.connect(player2).validateMove(gameId, 0, 1, true)
      ).to.be.revertedWith("Not the game player");
    });

    it("Should record game moves", async function () {
      await memoryGame.connect(player1).validateMove(gameId, 0, 1, true);
      await memoryGame.connect(player1).validateMove(gameId, 2, 3, false);

      const moves = await memoryGame.getGameMoves(gameId);
      expect(moves.length).to.equal(2);
      
      expect(moves[0].cardIndex1).to.equal(0);
      expect(moves[0].cardIndex2).to.equal(1);
      expect(moves[0].isMatch).to.be.true;
      
      expect(moves[1].cardIndex1).to.equal(2);
      expect(moves[1].cardIndex2).to.equal(3);
      expect(moves[1].isMatch).to.be.false;
    });
  });

  describe("Game Completion", function () {
    let gameId;

    beforeEach(async function () {
      await memoryGame.connect(player1).startGame(1); // Easy game (8 pairs)
      gameId = 1;
    });

    it("Should complete game when all pairs are found", async function () {
      // Simulate finding all 8 pairs
      for (let i = 0; i < 8; i++) {
        await memoryGame.connect(player1).validateMove(gameId, i * 2, i * 2 + 1, true);
      }

      const game = await memoryGame.getGame(gameId);
      expect(game.isCompleted).to.be.true;
      expect(game.isActive).to.be.false;
      expect(game.foundPairs).to.equal(8);
      expect(game.endTime).to.be.greaterThan(0);
    });

    it("Should emit GameCompleted event", async function () {
      // Find 7 pairs first
      for (let i = 0; i < 7; i++) {
        await memoryGame.connect(player1).validateMove(gameId, i * 2, i * 2 + 1, true);
      }

      // Find the last pair and check for event
      const tx = await memoryGame.connect(player1).validateMove(gameId, 14, 15, true);
      const receipt = await tx.wait();

      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'GameCompleted');
      expect(event).to.not.be.undefined;
    });
  });

  describe("Game Abandonment", function () {
    let gameId;

    beforeEach(async function () {
      await memoryGame.connect(player1).startGame(1);
      gameId = 1;
    });

    it("Should allow player to abandon game", async function () {
      const tx = await memoryGame.connect(player1).abandonGame(gameId);
      const receipt = await tx.wait();

      // Check if GameAbandoned event was emitted
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'GameAbandoned');
      expect(event).to.not.be.undefined;

      const game = await memoryGame.getGame(gameId);
      expect(game.isActive).to.be.false;
      expect(game.endTime).to.be.greaterThan(0);
    });

    it("Should reject abandonment from non-game player", async function () {
      await expect(
        memoryGame.connect(player2).abandonGame(gameId)
      ).to.be.revertedWith("Not the game player");
    });
  });

  describe("Game Queries", function () {
    beforeEach(async function () {
      await memoryGame.connect(player1).startGame(1);
      await memoryGame.connect(player1).startGame(2);
      await memoryGame.connect(player2).startGame(1);
    });

    it("Should return correct total games count", async function () {
      const totalGames = await memoryGame.getTotalGames();
      expect(totalGames).to.equal(3);
    });

    it("Should return player's games", async function () {
      const player1Games = await memoryGame.getPlayerGames(player1.address);
      const player2Games = await memoryGame.getPlayerGames(player2.address);

      expect(player1Games.length).to.equal(2);
      expect(player2Games.length).to.equal(1);
      expect(player1Games[0]).to.equal(1);
      expect(player1Games[1]).to.equal(2);
      expect(player2Games[0]).to.equal(3);
    });

    it("Should check if game is active", async function () {
      expect(await memoryGame.isGameActive(1)).to.be.true;
      expect(await memoryGame.isGameActive(999)).to.be.false;

      // Abandon game and check
      await memoryGame.connect(player1).abandonGame(1);
      expect(await memoryGame.isGameActive(1)).to.be.false;
    });

    it("Should calculate game duration", async function () {
      const gameId = 1;
      const duration1 = await memoryGame.getGameDuration(gameId);
      expect(duration1).to.be.greaterThan(0);

      // Wait a moment and check again
      await new Promise(resolve => setTimeout(resolve, 1000));
      const duration2 = await memoryGame.getGameDuration(gameId);
      expect(duration2).to.be.greaterThan(duration1);
    });
  });

  describe("Edge Cases", function () {
    it("Should reject operations on non-existent games", async function () {
      await expect(
        memoryGame.getGame(999)
      ).to.be.revertedWith("Game does not exist");

      await expect(
        memoryGame.connect(player1).validateMove(999, 0, 1, true)
      ).to.be.revertedWith("Game does not exist");
    });

    it("Should reject moves on inactive games", async function () {
      await memoryGame.connect(player1).startGame(1);
      await memoryGame.connect(player1).abandonGame(1);

      await expect(
        memoryGame.connect(player1).validateMove(1, 0, 1, true)
      ).to.be.revertedWith("Game is not active");
    });
  });
}); 
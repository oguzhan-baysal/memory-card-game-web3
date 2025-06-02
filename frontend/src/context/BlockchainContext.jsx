import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './Web3Context';
import MemoryGameABI from '../contracts/MemoryGame.json';
import contractAddresses from '../contracts/contract-address.json';

const BlockchainContext = createContext();

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider = ({ children }) => {
  const { account, isConnected, provider } = useWeb3();
  const [contract, setContract] = useState(null);
  const [isContractConnected, setIsContractConnected] = useState(false);
  const [contractError, setContractError] = useState(null);

  // Initialize contract when Web3 is connected
  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !provider || !account) {
        setContract(null);
        setIsContractConnected(false);
        return;
      }

      try {
        setContractError(null);
        
        // Create contract instance
        const signer = await provider.getSigner();
        const memoryGameContract = new ethers.Contract(
          contractAddresses.MemoryGame,
          JSON.parse(MemoryGameABI),
          signer
        );

        setContract(memoryGameContract);
        setIsContractConnected(true);
        console.log('Smart contract connected successfully');
      } catch (error) {
        console.error('Failed to initialize contract:', error);
        setContractError(error.message);
        setContract(null);
        setIsContractConnected(false);
      }
    };

    initContract();
  }, [isConnected, provider, account]);

  // Game functions
  const startGame = async (difficulty) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.startGame(difficulty);
      const receipt = await tx.wait();
      
      // Get game ID from event logs
      const gameStartedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'GameStarted'
      );
      
      const gameId = gameStartedEvent ? gameStartedEvent.args[0] : null;
      return { gameId, tx: receipt };
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  };

  const validateMove = async (gameId, card1, card2, isMatch) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.validateMove(gameId, card1, card2, isMatch);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error validating move:', error);
      throw error;
    }
  };

  const abandonGame = async (gameId) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.abandonGame(gameId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error abandoning game:', error);
      throw error;
    }
  };

  const getGame = async (gameId) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const game = await contract.getGame(gameId);
      return {
        gameId: game.gameId.toString(),
        player: game.player,
        difficulty: game.difficulty,
        gridSize: game.gridSize,
        totalPairs: game.totalPairs,
        foundPairs: game.foundPairs,
        attempts: game.attempts,
        wrongAttempts: game.wrongAttempts,
        startTime: new Date(Number(game.startTime) * 1000),
        endTime: game.endTime > 0 ? new Date(Number(game.endTime) * 1000) : null,
        isCompleted: game.isCompleted,
        isActive: game.isActive
      };
    } catch (error) {
      console.error('Error getting game:', error);
      throw error;
    }
  };

  const getPlayerGames = async (playerAddress) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const gameIds = await contract.getPlayerGames(playerAddress || account);
      return gameIds.map(id => id.toString());
    } catch (error) {
      console.error('Error getting player games:', error);
      throw error;
    }
  };

  const getGameMoves = async (gameId) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const moves = await contract.getGameMoves(gameId);
      return moves.map(move => ({
        cardIndex1: move.cardIndex1,
        cardIndex2: move.cardIndex2,
        isMatch: move.isMatch,
        timestamp: new Date(Number(move.timestamp) * 1000)
      }));
    } catch (error) {
      console.error('Error getting game moves:', error);
      throw error;
    }
  };

  const getTotalGames = async () => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const total = await contract.getTotalGames();
      return total.toString();
    } catch (error) {
      console.error('Error getting total games:', error);
      throw error;
    }
  };

  const value = {
    contract,
    isContractConnected,
    contractError,
    contractAddress: contractAddresses.MemoryGame,
    
    // Game functions
    startGame,
    validateMove,
    abandonGame,
    getGame,
    getPlayerGames,
    getGameMoves,
    getTotalGames
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}; 
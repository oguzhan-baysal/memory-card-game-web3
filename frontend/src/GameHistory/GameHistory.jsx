import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GameHistory = () => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, Easy, Normal, Hard
  const navigate = useNavigate();

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async () => {
    try {
      setLoading(true);
      const userID = localStorage.getItem('userID');
      
      let url = 'http://localhost:5000/api/memory/history';
      if (userID) {
        url = `http://localhost:5000/api/memory/history/${userID}`;
      }
      
      const response = await axios.get(url);
      setGameHistory(response.data.data || []);
    } catch (err) {
      setError('Error loading game history');
      console.error('Error fetching game history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = gameHistory.filter(game => 
    filter === 'all' || game.difficulty === filter
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Normal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSuccessRate = () => {
    if (filteredHistory.length === 0) return 0;
    const completed = filteredHistory.filter(game => game.completed > 0).length;
    return Math.round((completed / filteredHistory.length) * 100);
  };

  const getAverageTime = () => {
    const completedGames = filteredHistory.filter(game => game.completed > 0);
    if (completedGames.length === 0) return 0;
    const totalTime = completedGames.reduce((sum, game) => sum + game.timeTaken, 0);
    return Math.round(totalTime / completedGames.length);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-base sm:text-lg">Loading game history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 overflow-auto">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Game History</h1>
              <p className="text-purple-200 mt-1 text-sm sm:text-base">Track all your game results here</p>
            </div>
            <button
              onClick={() => navigate('/play')}
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Back to Game
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 sm:px-6 py-3 sm:py-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{filteredHistory.length}</h3>
                    <p className="text-purple-200 text-xs sm:text-sm lg:text-base">Total Games</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{getSuccessRate()}%</h3>
                    <p className="text-purple-200 text-xs sm:text-sm lg:text-base">Success Rate</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{formatTime(getAverageTime())}</h3>
                    <p className="text-purple-200 text-xs sm:text-sm lg:text-base">Average Time</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      {filteredHistory.filter(game => game.completed > 0).length}
                    </h3>
                    <p className="text-purple-200 text-xs sm:text-sm lg:text-base">Completed</p>
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {['all', 'Easy', 'Normal', 'Hard'].map((difficultyLevel) => (
                    <button
                      key={difficultyLevel}
                      onClick={() => setFilter(difficultyLevel)}
                      className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                        filter === difficultyLevel
                          ? 'bg-white text-purple-600 font-semibold'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {difficultyLevel === 'all' ? 'All' : difficultyLevel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game List */}
              {filteredHistory.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-12 border border-white/20 text-center">
                  <svg className="h-12 w-12 sm:h-16 sm:w-16 text-white/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No game history yet</h3>
                  <p className="text-purple-200 text-sm sm:text-base">Play your first game and see the results here!</p>
                </div>
              ) : (
                <>
                  {/* Desktop/Tablet Table View */}
                  <div className="hidden md:block bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-white/10">
                          <tr>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                              Difficulty
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                              Errors
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                              Score
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {filteredHistory.map((game, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-white">
                                {formatDate(game.gameDate)}
                              </td>
                              <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(game.difficulty)}`}>
                                  {game.difficulty}
                                </span>
                              </td>
                              <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                {game.completed > 0 ? (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Completed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Incomplete
                                  </span>
                                )}
                              </td>
                              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-white">
                                {formatTime(game.timeTaken)}
                              </td>
                              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-white">
                                {game.failed || 0}
                              </td>
                              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-white">
                                {game.completed || 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredHistory.map((game, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">
                              {formatDate(game.gameDate)}
                            </p>
                            <div className="mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(game.difficulty)}`}>
                                {game.difficulty}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {game.completed > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Incomplete
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/20">
                          <div className="text-center">
                            <p className="text-purple-200 text-xs">Time</p>
                            <p className="text-white font-medium text-sm">{formatTime(game.timeTaken)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-purple-200 text-xs">Errors</p>
                            <p className="text-white font-medium text-sm">{game.failed || 0}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-purple-200 text-xs">Score</p>
                            <p className="text-white font-medium text-sm">{game.completed || 0}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHistory; 
import React, { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, BarChart3, PieChart, Users, Wallet, ChevronRight } from 'lucide-react';
import { mockSIMDs, mockValidatorVotes, statusColors } from '../utils/mockData';

const AnalyticsPage = ({ isDarkMode, walletConnected, walletAddress, onBack }) => {
  const [selectedValidator, setSelectedValidator] = useState(null);
  const [selectedSIMD, setSelectedSIMD] = useState(null);
  const [viewMode, setViewMode] = useState('validators'); // 'validators', 'simds', 'comparison'
  
  // Calculate some summary statistics for the dashboard
  const totalVotes = mockValidatorVotes.reduce((acc, validator) => 
    acc + validator.votes.length, 0);
  
  const totalStakers = mockValidatorVotes.reduce((acc, validator) => 
    acc + validator.stakers, 0);
  
  const totalStake = mockValidatorVotes.reduce((acc, validator) => 
    acc + validator.totalStake, 0);
  
  const averageStake = Math.round(totalStake / totalStakers);
  
  // Get votes for a specific SIMD across validators
  const getVotesForSIMD = (simdNumber) => {
    const votes = {
      for: { count: 0, weight: 0 },
      against: { count: 0, weight: 0 }
    };
    
    mockValidatorVotes.forEach(validator => {
      const vote = validator.votes.find(v => v.simd === simdNumber);
      if (vote) {
        votes[vote.vote].count++;
        votes[vote.vote].weight += vote.weight;
      }
    });
    
    return votes;
  };
  
  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm backdrop-blur-md bg-opacity-90`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className={`mr-4 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-medium tracking-tight">SIMD Voting Analytics</h1>
          </div>
          
          {walletConnected ? (
            <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800 border border-green-200'}`}>
              <Wallet className="inline mr-2" size={16} />
              {walletAddress}
            </div>
          ) : (
            <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
              Wallet not connected
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="container mx-auto">
          {/* Dashboard summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`rounded-xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Validators</h3>
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900 bg-opacity-40' : 'bg-blue-100'}`}>
                  <Users className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{mockValidatorVotes.length}</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active in governance</p>
            </div>
            
            <div className={`rounded-xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Votes</h3>
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900 bg-opacity-40' : 'bg-purple-100'}`}>
                  <ThumbsUp className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{totalVotes}</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Across all SIMDs</p>
            </div>
            
            <div className={`rounded-xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Stakers</h3>
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-teal-900 bg-opacity-40' : 'bg-teal-100'}`}>
                  <Users className={isDarkMode ? 'text-teal-400' : 'text-teal-600'} size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{totalStakers.toLocaleString()}</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Participating in voting</p>
            </div>
            
            <div className={`rounded-xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Stake</h3>
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-amber-900 bg-opacity-40' : 'bg-amber-100'}`}>
                  <BarChart3 className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{(totalStake / 1000000).toFixed(1)}M SOL</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg: {(averageStake).toLocaleString()} SOL per staker</p>
            </div>
          </div>
          
          {/* View mode tabs */}
          <div className="flex space-x-1 rounded-xl overflow-hidden mb-6 p-1 w-fit mx-auto md:mx-0 border border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setViewMode('validators')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'validators' 
                  ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white') 
                  : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
              }`}
            >
              Validator View
            </button>
            <button 
              onClick={() => setViewMode('simds')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'simds' 
                  ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white') 
                  : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
              }`}
            >
              SIMD View
            </button>
          </div>
          
          {/* Validator View */}
          {viewMode === 'validators' && (
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Validator Voting Patterns
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockValidatorVotes.map(validator => (
                  <div 
                    key={validator.validator} 
                    className={`rounded-xl shadow-md p-6 cursor-pointer ${
                      selectedValidator === validator 
                        ? (isDarkMode ? 'ring-2 ring-blue-500 bg-gray-800' : 'ring-2 ring-blue-500 bg-white') 
                        : (isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50')
                    }`}
                    onClick={() => setSelectedValidator(selectedValidator === validator ? null : validator)}
                  >
                    <h3 className="text-xl font-bold mb-3">{validator.validator}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Stake</p>
                        <p className="text-xl font-semibold">{(validator.totalStake / 1000000).toFixed(2)}M SOL</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stakers</p>
                        <p className="text-xl font-semibold">{validator.stakers.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Voting History</p>
                      <div className="flex mt-2">
                        {validator.votes.map((vote, index) => (
                          <div 
                            key={index}
                            className={`h-4 first:rounded-l-full last:rounded-r-full ${
                              vote.vote === 'for' 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${100 / validator.votes.length}%` }}
                            title={`SIMD-${vote.simd}: ${vote.vote.toUpperCase()}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <button 
                        className={`text-sm flex items-center ${
                          isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                        }`}
                      >
                        {selectedValidator === validator ? 'Show less' : 'View details'}
                        <ChevronRight size={16} className={`ml-1 transition-transform ${
                          selectedValidator === validator ? 'rotate-90' : ''
                        }`} />
                      </button>
                    </div>
                    
                    {selectedValidator === validator && (
                      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h4 className="font-medium mb-2">Recent Votes</h4>
                        <div className="space-y-2">
                          {validator.votes.map((vote, index) => {
                            const simd = mockSIMDs.find(s => s.number === vote.simd);
                            return (
                              <div key={index} className="flex justify-between items-center">
                                <div className="flex-1">
                                  <span className="font-medium">SIMD-{vote.simd}</span>
                                  {simd && <span className="ml-2 text-sm text-gray-500">{simd.title}</span>}
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  vote.vote === 'for' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {vote.vote.toUpperCase()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* SIMD View */}
          {viewMode === 'simds' && (
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Voting by SIMD
              </h2>
              
              <div className="space-y-6">
                {mockSIMDs.map(simd => {
                  const votes = getVotesForSIMD(simd.number);
                  const totalVoteWeight = votes.for.weight + votes.against.weight;
                  const forPercentage = totalVoteWeight > 0 ? Math.round((votes.for.weight / totalVoteWeight) * 100) : 0;
                  
                  return (
                    <div 
                      key={simd.number}
                      className={`rounded-xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="mb-3 md:mb-0">
                          <div className="flex space-x-3 mb-2">
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColors[simd.status]}`}>
                              {simd.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold">SIMD-{simd.number}: {simd.title}</h3>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`text-center px-3 py-1 rounded ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <span className="text-sm">Validators: {votes.for.count + votes.against.count}</span>
                          </div>
                          <div className={`text-center px-3 py-1 rounded ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <span className="text-sm">Stake: {((votes.for.weight + votes.against.weight) / 1000000).toFixed(1)}M SOL</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span>Vote Distribution</span>
                          <span>{forPercentage}% For</span>
                        </div>
                        <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-green-500 flex items-center justify-center text-xs text-white font-bold" 
                            style={{ width: `${forPercentage}%` }}
                          >
                            {forPercentage > 10 && 'FOR'}
                          </div>
                          <div 
                            className="h-full bg-red-500 flex items-center justify-center text-xs text-white font-bold" 
                            style={{ width: `${100 - forPercentage}%` }}
                          >
                            {(100 - forPercentage) > 10 && 'AGAINST'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 
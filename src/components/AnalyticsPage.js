import React, { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, BarChart3, PieChart, Users, Wallet, ChevronRight, ChevronLeft, Search, ArrowDown, ArrowUp } from 'lucide-react';
import { mockSIMDs, mockValidatorVotes, statusColors } from '../utils/mockData';

const AnalyticsPage = ({ isDarkMode, walletConnected, walletAddress, onBack }) => {
  const [selectedValidator, setSelectedValidator] = useState(null);
  const [selectedSIMD, setSelectedSIMD] = useState(null);
  const [viewMode, setViewMode] = useState('validators'); // 'validators', 'simds'
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Set a default value
  const [validators, setValidators] = useState([]); // Add validators state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Calculate some summary statistics for the dashboard
  const totalVotes = mockValidatorVotes.reduce((acc, validator) => 
    acc + validator.votes.length, 0);
  
  const totalStakers = mockValidatorVotes.reduce((acc, validator) => 
    acc + validator.stakers, 0);
  
  const totalStake = mockValidatorVotes.reduce((acc, validator) => 
    acc + validator.totalStake, 0);
  
  const averageStake = Math.round(totalStake / totalStakers);
  
  // Generate mock validator data for the validator view
  useEffect(() => {
    const fetchValidators = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters for StakeWiz API
        const params = new URLSearchParams();
        
        // Add sort parameter (prepend - for descending)
        if (sortDirection === 'desc') {
          params.append('sort', `-${sortOrder}`);
        } else {
          params.append('sort', sortOrder);
        }
        
        // Add limit parameter
        params.append('limit', limit.toString());
        
        // Try to fetch from the correct endpoint
        // Note: The API URL appears to be incorrect - trying alternative URL
        let data;
        try {
          // First try the direct endpoint
          const response = await fetch(`https://stakewiz.com/api/validators?${params.toString()}`);
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          data = await response.json();
        } catch (primaryError) {
          console.warn("Primary API endpoint failed, trying fallback", primaryError);
          
          // Fallback 1: Try alternative endpoint
          try {
            const fallbackResponse = await fetch(`https://www.stakewiz.com/api/v1/validators?${params.toString()}`);
            
            if (!fallbackResponse.ok) {
              throw new Error(`Fallback API error: ${fallbackResponse.status}`);
            }
            
            data = await fallbackResponse.json();
          } catch (fallbackError) {
            console.warn("All API endpoints failed, using mock data", fallbackError);
            // Throw to trigger mock data fallback
            throw new Error("All API endpoints failed");
          }
        }
        
        // If we get here, we have data from one of the API endpoints
        // Map the API response to our validator format
        const mappedValidators = data.map((validator, index) => ({
          name: validator.name || validator.identity?.substring(0, 8) || `Validator ${validator.rank || Math.random().toString(36).substring(2, 6)}`,
          account: validator.identity || Math.random().toString(36).substring(2),
          vote_account: validator.vote_identity || validator.voteAccount,
          active_stake: validator.activated_stake || validator.activeStake || Math.floor(Math.random() * 5000000) + 1000000,
          commission: validator.commission || Math.floor(Math.random() * 10),
          delinquent: validator.delinquent || false,
          score: validator.vote_success_score ? Math.round(validator.vote_success_score * 10) : (Math.floor(Math.random() * 30) + 70),
          rank: validator.rank || (page - 1) * limit + index + 1,
          lastVote: validator.last_vote,
          skipRate: validator.skip_rate,
          website: validator.website,
          description: validator.description,
          location: validator.ip_city ? `${validator.ip_city}, ${validator.ip_country}` : null,
          version: validator.version,
          // Since the API doesn't provide SIMD voting data, we'll generate mock SIMD votes
          simd_votes: mockSIMDs.slice(0, Math.floor(Math.random() * 3) + 1).map(simd => ({
            simd: simd.number,
            vote: Math.random() > 0.3 ? 'for' : 'against',
            votedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          }))
        }));
        
        setValidators(mappedValidators);
        setTotalPages(Math.ceil(200 / limit)); // Assumption
        
      } catch (err) {
        console.error("Error fetching validators:", err);
        setError("Failed to fetch validators. Using mock data instead.");
        
        // FALLBACK: Generate mock validator data
        const mockValidatorData = Array.from({ length: limit }, (_, i) => ({
          name: `Validator ${i + 1 + (page-1)*limit}`,
          account: `Va1id${i}${page}${Math.floor(Math.random() * 10000)}`,
          vote_account: `Vote${i}${page}${Math.floor(Math.random() * 10000)}`,
          active_stake: Math.floor(Math.random() * 9000000) + 1000000,
          commission: Math.floor(Math.random() * 10),
          delinquent: Math.random() > 0.9,
          score: Math.floor(Math.random() * 30) + 70,
          rank: (page - 1) * limit + i + 1,
          website: Math.random() > 0.5 ? `validator${i}.solana.com` : null,
          description: Math.random() > 0.7 ? `Reliable validator ${i} with high uptime and performance.` : null,
          location: Math.random() > 0.6 ? `${['Frankfurt', 'New York', 'Tokyo', 'London', 'Singapore'][Math.floor(Math.random() * 5)]}, ${['Germany', 'USA', 'Japan', 'UK', 'Singapore'][Math.floor(Math.random() * 5)]}` : null,
          version: `1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
          simd_votes: mockSIMDs.slice(0, Math.floor(Math.random() * 3) + 1).map(simd => ({
            simd: simd.number,
            vote: Math.random() > 0.3 ? 'for' : 'against',
            votedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          }))
        }));
        
        setValidators(mockValidatorData);
        setTotalPages(10); // Simulated total pages for mock data
      } finally {
        setLoading(false);
      }
    };
    
    fetchValidators();
  }, [page, limit, sortOrder, sortDirection]);
  
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
          
          {/* Error message display */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-red-900 bg-opacity-20 text-red-200' : 'bg-red-50 text-red-800'}`}>
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">{error}</p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    The application is currently showing simulated data. Please try again later.
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                    isDarkMode ? 'border-blue-400' : 'border-blue-600'
                  }`}></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {validators.map(validator => (
                    <div 
                      key={validator.account}
                      className={`rounded-xl shadow-md p-6 ${
                        selectedValidator?.account === validator.account 
                          ? (isDarkMode ? 'ring-2 ring-blue-500 bg-gray-800' : 'ring-2 ring-blue-500 bg-white') 
                          : (isDarkMode ? 'bg-gray-800' : 'bg-white')
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          {validator.rank && (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2 ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {validator.rank}
                            </span>
                          )}
                          <h3 className="text-lg font-bold truncate">{validator.name}</h3>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          validator.score >= 90 ? 'bg-green-100 text-green-800' :
                          validator.score >= 80 ? 'bg-blue-100 text-blue-800' :
                          validator.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Score: {validator.score}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {validator.account.substring(0, 8)}...{validator.account.substring(validator.account.length - 4)}
                      </p>
                      
                      <div className="flex justify-between mb-3">
                        <div>
                          <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Active Stake
                          </div>
                          <div className="font-medium">
                            {(validator.active_stake / 1000000000).toFixed(2)}K SOL
                          </div>
                        </div>
                        <div>
                          <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Commission
                          </div>
                          <div className="font-medium">
                            {validator.commission}%
                          </div>
                        </div>
                        <div>
                          <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Skip Rate
                          </div>
                          <div className="font-medium">
                            {(validator.skipRate * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded details */}
                      {selectedValidator?.account === validator.account && (
                        <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {validator.description && (
                            <div className="mb-3">
                              <h4 className="font-medium mb-1">Description</h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {validator.description}
                              </p>
                            </div>
                          )}
                          
                          <div className="mb-3">
                            <h4 className="font-medium mb-1">Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {validator.website && (
                                <div>
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Website:</span> 
                                  <a 
                                    href={validator.website.startsWith('http') ? validator.website : `https://${validator.website}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={`ml-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                  >
                                    {validator.website.replace(/^https?:\/\//i, '')}
                                  </a>
                                </div>
                              )}
                              {validator.location && (
                                <div>
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Location:</span> 
                                  <span className="ml-1">{validator.location}</span>
                                </div>
                              )}
                              {validator.version && (
                                <div>
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Version:</span> 
                                  <span className="ml-1">{validator.version}</span>
                                </div>
                              )}
                              <div>
                                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Status:</span> 
                                <span className={`ml-1 ${validator.delinquent ? 'text-red-500' : 'text-green-500'}`}>
                                  {validator.delinquent ? 'Delinquent' : 'Active'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => setSelectedValidator(selectedValidator?.account === validator.account ? null : validator)}
                              className={`text-sm font-medium flex items-center ${
                                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                              }`}
                            >
                              {selectedValidator?.account === validator.account ? 'Hide Details' : 'View Details'}
                              <ChevronRight 
                                size={16} 
                                className={`ml-1 transform transition-transform ${
                                  selectedValidator?.account === validator.account ? 'rotate-90' : ''
                                }`} 
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                      
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setSelectedSIMD(selectedSIMD?.number === simd.number ? null : simd)}
                          className={`text-sm font-medium flex items-center ${
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                          }`}
                        >
                          {selectedSIMD?.number === simd.number ? 'Hide Details' : 'View Details'}
                          <ChevronRight 
                            size={16} 
                            className={`ml-1 transform transition-transform ${
                              selectedSIMD?.number === simd.number ? 'rotate-90' : ''
                            }`} 
                          />
                        </button>
                      </div>
                      
                      {selectedSIMD?.number === simd.number && (
                        <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <h4 className="font-medium mb-3">Validator Votes on SIMD-{simd.number}</h4>
                          
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead>
                                <tr>
                                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validator</th>
                                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Vote</th>
                                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stake Weight</th>
                                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {validators
                                  .filter(v => v.simd_votes && v.simd_votes.some(vote => vote.simd === simd.number))
                                  .map(validator => {
                                    const vote = validator.simd_votes.find(v => v.simd === simd.number);
                                    const voteWeight = validator.active_stake;
                                    const votePercentage = totalVoteWeight > 0 ? Math.round((voteWeight / totalVoteWeight) * 100) : 0;
                                    
                                    return vote ? (
                                      <tr key={validator.account}>
                                        <td className="py-2">{validator.name}</td>
                                        <td className="text-right">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            vote.vote === 'for' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {vote.vote.toUpperCase()}
                                          </span>
                                        </td>
                                        <td className="text-right">{(voteWeight / 1000000).toFixed(2)}M SOL</td>
                                        <td className="text-right">{votePercentage}%</td>
                                      </tr>
                                    ) : null;
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Pagination Controls - shown only in validators view */}
          {viewMode === 'validators' && (
            <div className="mt-8 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1); // Reset to first page when changing limit
                  }}
                  className={`rounded-md px-3 py-2 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-700'
                  } border`}
                >
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Showing {(page - 1) * limit + 1}-{Math.min(page * limit, (page - 1) * limit + validators.length)} of many validators
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-3 py-2 rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page <= 3 
                    ? i + 1 
                    : page >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : page - 2 + i;
                  
                  if (pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded-md ${
                          page === pageNum 
                            ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                            : (isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100')
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-2 rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 
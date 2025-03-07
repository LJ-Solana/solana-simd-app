import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, Code } from 'lucide-react';
import Header from './Header';
import { mockSIMDs, statusColors, categoryColors } from '../utils/mockData';

const MainPage = ({ 
  isDarkMode, 
  toggleDarkMode, 
  walletConnected, 
  walletAddress, 
  connectWallet, 
  navigateToVoting,
  navigateToAnalytics 
}) => {
  const [filteredSimds, setFilteredSimds] = useState(mockSIMDs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSimd, setSelectedSimd] = useState(null);

  // Status filter options
  const statusOptions = ['All', 'Draft', 'Active', 'Final', 'Implemented', 'Deferred', 'Rejected'];
  
  // Category filter options
  const categoryOptions = ['All', 'Core', 'Standards', 'Process'];

  // Filter SIMD documents based on search term and filters
  useEffect(() => {
    let results = mockSIMDs;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(simd =>
        simd.title.toLowerCase().includes(searchLower) ||
        simd.number.toLowerCase().includes(searchLower) ||
        simd.author.toLowerCase().includes(searchLower) ||
        simd.summary.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (selectedStatus !== 'All') {
      results = results.filter(simd => simd.status === selectedStatus);
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      results = results.filter(simd => simd.category === selectedCategory);
    }
    
    setFilteredSimds(results);
  }, [searchTerm, selectedStatus, selectedCategory]);

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        connectWallet={connectWallet}
        navigateToAnalytics={navigateToAnalytics}
      />
      
      {/* Search and Filters */}
      <div className={`p-5 ${isDarkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} backdrop-blur-md`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <input
                type="text"
                className={`pl-11 pr-4 py-3 w-full rounded-xl shadow-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="Search SIMDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative md:w-52">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <select
                className={`pl-11 pr-8 py-3 w-full rounded-xl shadow-sm appearance-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200`}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status} Status</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronRight size={18} className={`transform rotate-90 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="relative md:w-52">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <select
                className={`pl-11 pr-8 py-3 w-full rounded-xl shadow-sm appearance-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category} Category</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronRight size={18} className={`transform rotate-90 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* SIMD List */}
        <div className={`w-full md:w-1/2 lg:w-1/3 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {filteredSimds.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSimds.map((simd) => (
                <div 
                  key={simd.number}
                  onClick={() => setSelectedSimd(simd)}
                  className={`p-5 cursor-pointer transition-all duration-200 ${
                    selectedSimd === simd 
                      ? (isDarkMode ? 'bg-gray-700' : 'bg-blue-50') 
                      : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColors[simd.status]}`}>
                      {simd.status}
                    </span>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${categoryColors[simd.category]}`}>
                      {simd.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mt-3 tracking-tight">SIMD-{simd.number}: {simd.title}</h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {simd.author} • {simd.created}
                  </p>
                  <p className={`text-sm mt-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                    {simd.summary}
                  </p>
                  <div className={`flex justify-end mt-3 text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors duration-200`}>
                    <span className="flex items-center">
                      View Details <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No SIMDs match your filters</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('All');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* SIMD Detail View */}
        <div className={`hidden md:block md:w-1/2 lg:w-2/3 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
          {selectedSimd ? (
            <div className={`rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                  <div className="flex space-x-3 mb-3">
                    <span className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${statusColors[selectedSimd.status]}`}>
                      {selectedSimd.status}
                    </span>
                    <span className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${categoryColors[selectedSimd.category]}`}>
                      {selectedSimd.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-medium tracking-tight">SIMD-{selectedSimd.number}: {selectedSimd.title}</h2>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <a 
                    href={`https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/simd-${selectedSimd.number}.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <Code size={18} className="mr-2" />
                    View on GitHub
                  </a>
                  <button
                    onClick={() => navigateToVoting(selectedSimd)}
                    className={`inline-flex items-center px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    Vote on SIMD
                  </button>
                </div>
              </div>
              
              {/* Enhanced SIMD Content */}
              <div className="mt-6 space-y-8">
                {/* Author and Date */}
                <div className="flex flex-wrap justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Author</p>
                    <p className="font-medium mt-1">{selectedSimd.author}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Created</p>
                    <p className="font-medium mt-1">{selectedSimd.created}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Updated</p>
                    <p className="font-medium mt-1">{selectedSimd.created}</p> {/* Using created date as placeholder */}
                  </div>
                </div>
                
                {/* Summary Section */}
                <div>
                  <h3 className="text-xl font-medium mb-3">Summary</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {selectedSimd.summary}
                  </p>
                </div>
                
                {/* Technical Details */}
                <div>
                  <h3 className="text-xl font-medium mb-3">Technical Details</h3>
                  
                  {/* Custom content based on SIMD number */}
                  {selectedSimd.number === '0001' && (
                    <div className="space-y-4">
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        This document describes the Solana Improvement Document (SIMD) process. SIMDs are the primary mechanism for proposing new features, collecting community input, and documenting design decisions for the Solana ecosystem.
                      </p>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className="font-medium mb-2">SIMD Workflow</h4>
                        <div className="flex flex-wrap md:flex-nowrap justify-between gap-2">
                          <div className={`p-3 rounded-md text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex-1`}>
                            <div className="font-medium">Draft</div>
                            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Initial proposal</div>
                          </div>
                          <div className="text-center pt-3">→</div>
                          <div className={`p-3 rounded-md text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex-1`}>
                            <div className="font-medium">Review</div>
                            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Community feedback</div>
                          </div>
                          <div className="text-center pt-3">→</div>
                          <div className={`p-3 rounded-md text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex-1`}>
                            <div className="font-medium">Active</div>
                            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Implementation</div>
                          </div>
                          <div className="text-center pt-3">→</div>
                          <div className={`p-3 rounded-md text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex-1`}>
                            <div className="font-medium">Final</div>
                            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Standardized</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedSimd.number === '0002' && (
                    <div className="space-y-4">
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        The SPL Token Standard defines a common interface for fungible and non-fungible tokens on Solana. It enables features like transfers, approvals, minting, and burning. The standard is implemented as a Solana Program Library (SPL) program.
                      </p>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className="font-medium mb-2">Key Functionality</h4>
                        <ul className={`list-disc ml-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Transfer tokens between accounts</li>
                          <li>Delegate transfer authority to third parties</li>
                          <li>Mint new tokens (if authorized)</li>
                          <li>Burn tokens (remove from circulation)</li>
                          <li>Support for token metadata</li>
                          <li>Freeze account functionality</li>
                        </ul>
                      </div>
                      <div className="mt-4">
                        <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
                          <div className={`p-3 font-mono text-sm ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'}`}>
                            // Basic token transfer<br/>
                            await Token.transfer(<br/>
                            &nbsp;&nbsp;connection,<br/>
                            &nbsp;&nbsp;payer,<br/>
                            &nbsp;&nbsp;source,<br/>
                            &nbsp;&nbsp;destination,<br/>
                            &nbsp;&nbsp;owner,<br/>
                            &nbsp;&nbsp;[],<br/>
                            &nbsp;&nbsp;1000000, // amount in smallest units<br/>
                            );
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedSimd.number === '0003' && (
                    <div className="space-y-4">
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        The Stake Pool Program allows SOL holders to delegate their stake to a pool managed by a staker, enabling smaller holders to participate in staking without managing individual stake accounts. This improves capital efficiency and reduces operational overhead.
                      </p>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className="font-medium mb-2">Stake Pool Architecture</h4>
                        <div className="mt-3">
                          <div className="relative bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
                            <div className="flex flex-col items-center">
                              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-2">
                                <span className="text-purple-600 dark:text-purple-300 font-bold">SPL</span>
                              </div>
                              <span className="font-medium">Stake Pool</span>
                              
                              <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                                <div className="flex flex-col items-center">
                                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-blue-600 dark:text-blue-300 text-xs">Stake</span>
                                  </div>
                                  <span className="text-xs text-center">Validator A</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-blue-600 dark:text-blue-300 text-xs">Stake</span>
                                  </div>
                                  <span className="text-xs text-center">Validator B</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-blue-600 dark:text-blue-300 text-xs">Stake</span>
                                  </div>
                                  <span className="text-xs text-center">Validator C</span>
                                </div>
                              </div>
                              
                              <div className="mt-6 border-t border-dashed border-gray-300 dark:border-gray-600 pt-4 w-full">
                                <div className="flex justify-between">
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-1">
                                      <span className="text-green-600 dark:text-green-300 text-xs">User</span>
                                    </div>
                                    <span className="text-xs">Staker 1</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-1">
                                      <span className="text-green-600 dark:text-green-300 text-xs">User</span>
                                    </div>
                                    <span className="text-xs">Staker 2</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-1">
                                      <span className="text-green-600 dark:text-green-300 text-xs">User</span>
                                    </div>
                                    <span className="text-xs">Staker 3</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSimd.number === '0004' && (
                    <div className="space-y-4">
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        Address Lookup Tables (LUTs) solve the transaction size limitation on Solana by storing addresses on-chain in a lookup table. Transactions can reference these tables instead of including full addresses, significantly reducing transaction size for complex operations.
                      </p>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className="font-medium mb-2">Benefits of LUTs</h4>
                        <ul className={`list-disc ml-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Increased transaction throughput by reducing size</li>
                          <li>Support for complex DeFi operations with many accounts</li>
                          <li>Lower fees for multi-account transactions</li>
                          <li>Backward compatibility with existing programs</li>
                        </ul>
                      </div>
                      <div className="mt-4">
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                          <h4 className="font-medium mb-3">Transaction Size Comparison</h4>
                          <div className="flex gap-4 flex-wrap">
                            <div className={`flex-1 min-w-[200px] p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <h5 className="font-medium mb-2">Without LUTs</h5>
                              <div className="relative h-48">
                                <div className="absolute top-0 left-0 right-0 h-full">
                                  <div className={`h-[70%] rounded-t-lg ${isDarkMode ? 'bg-red-800' : 'bg-red-200'}`}>
                                    <div className="p-2 text-center">
                                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-red-800'}`}>Account Addresses</span>
                                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>32 bytes each × 10+ accounts</p>
                                    </div>
                                  </div>
                                  <div className={`h-[30%] rounded-b-lg ${isDarkMode ? 'bg-blue-800' : 'bg-blue-200'}`}>
                                    <div className="p-2 text-center">
                                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-blue-800'}`}>Instruction Data</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 text-center">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>1232+ bytes</span>
                              </div>
                            </div>
                            
                            <div className={`flex-1 min-w-[200px] p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <h5 className="font-medium mb-2">With LUTs</h5>
                              <div className="relative h-48">
                                <div className="absolute top-0 left-0 right-0 h-full">
                                  <div className={`h-[20%] rounded-t-lg ${isDarkMode ? 'bg-red-800' : 'bg-red-200'}`}>
                                    <div className="p-2 text-center">
                                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-red-800'}`}>Address Indexes</span>
                                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>1 byte each × 10+ accounts</p>
                                    </div>
                                  </div>
                                  <div className={`h-[10%] ${isDarkMode ? 'bg-purple-800' : 'bg-purple-200'}`}>
                                    <div className="p-1 text-center">
                                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-purple-800'}`}>LUT References</span>
                                    </div>
                                  </div>
                                  <div className={`h-[70%] rounded-b-lg ${isDarkMode ? 'bg-blue-800' : 'bg-blue-200'}`}>
                                    <div className="p-2 text-center">
                                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-blue-800'}`}>Instruction Data</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 text-center">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>~300 bytes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSimd.number === '0005' && (
                    <div className="space-y-4">
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        The Fee Market proposal aims to create a more efficient mechanism for transaction prioritization during network congestion. It introduces a dynamic fee structure that adjusts based on network demand, ensuring critical transactions can still be processed during high traffic periods.
                      </p>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className="font-medium mb-2">Fee Market Components</h4>
                        <div className="space-y-3 mt-3">
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h5 className="font-medium">Base Fee</h5>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Minimum fee required for all transactions, adjusted based on recent block fullness.
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h5 className="font-medium">Priority Fee</h5>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Optional additional fee paid to validators to prioritize transaction processing.
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h5 className="font-medium">Fee Burn Mechanism</h5>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Portion of fees are burned, creating deflationary pressure on SOL during high congestion.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                          <h4 className="font-medium mb-3">Fee Adjustment Mechanism</h4>
                          <div className="relative h-48">
                            <div className={`w-full h-full rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <div className="absolute inset-0 p-3">
                                {/* Y-axis label */}
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90">
                                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fee (SOL)</span>
                                </div>
                                
                                {/* X-axis label */}
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Network Utilization</span>
                                </div>
                                
                                {/* Fee curve */}
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                  {/* Grid lines */}
                                  <line x1="10" y1="90" x2="90" y2="90" stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeWidth="1" />
                                  <line x1="10" y1="10" x2="10" y2="90" stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeWidth="1" />
                                  
                                  {/* Fee curve */}
                                  <path 
                                    d="M 10,80 Q 30,78 50,70 T 70,50 Q 80,30 90,10" 
                                    fill="none" 
                                    stroke={isDarkMode ? "#60A5FA" : "#3B82F6"} 
                                    strokeWidth="2" 
                                  />
                                  
                                  {/* Low utilization marker */}
                                  <circle cx="30" cy="78" r="2" fill={isDarkMode ? "#60A5FA" : "#3B82F6"} />
                                  <text x="25" y="85" fontSize="6" fill={isDarkMode ? "#D1D5DB" : "#6B7280"}>25%</text>
                                  
                                  {/* Medium utilization marker */}
                                  <circle cx="50" cy="70" r="2" fill={isDarkMode ? "#60A5FA" : "#3B82F6"} />
                                  <text x="45" y="85" fontSize="6" fill={isDarkMode ? "#D1D5DB" : "#6B7280"}>50%</text>
                                  
                                  {/* High utilization marker */}
                                  <circle cx="70" cy="50" r="2" fill={isDarkMode ? "#60A5FA" : "#3B82F6"} />
                                  <text x="65" y="85" fontSize="6" fill={isDarkMode ? "#D1D5DB" : "#6B7280"}>75%</text>
                                  
                                  {/* Max utilization marker */}
                                  <circle cx="90" cy="10" r="2" fill={isDarkMode ? "#60A5FA" : "#3B82F6"} />
                                  <text x="85" y="85" fontSize="6" fill={isDarkMode ? "#D1D5DB" : "#6B7280"}>100%</text>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Fee increases exponentially as network approaches capacity
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Default content if SIMD number doesn't match predefined cases */}
                  {!['0001', '0002', '0003', '0004', '0005'].includes(selectedSimd.number) && (
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Please refer to the GitHub repository for detailed technical information about this SIMD.
                    </p>
                  )}
                </div>
                
                {/* Implementation Notes */}
                <div>
                  <h3 className="text-xl font-medium mb-3">Implementation Status</h3>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          selectedSimd.status === 'Implemented' ? 'bg-green-500' :
                          selectedSimd.status === 'Active' ? 'bg-blue-500' :
                          selectedSimd.status === 'Final' ? 'bg-purple-500' :
                          selectedSimd.status === 'Draft' ? 'bg-amber-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="font-medium">{selectedSimd.status}</span>
                      </div>
                      {selectedSimd.status === 'Implemented' && (
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Available in Solana v1.10+
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs">Draft</span>
                          <span className="text-xs">Review</span>
                          <span className="text-xs">Active</span>
                          <span className="text-xs">Final</span>
                          <span className="text-xs">Implemented</span>
                        </div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            selectedSimd.status === 'Implemented' ? 'bg-green-500 w-full' :
                            selectedSimd.status === 'Final' ? 'bg-purple-500 w-4/5' :
                            selectedSimd.status === 'Active' ? 'bg-blue-500 w-3/5' :
                            selectedSimd.status === 'Draft' ? 'bg-amber-500 w-1/5' :
                            'bg-gray-500 w-2/5'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Governance Voting */}
                <div>
                  <h3 className="text-xl font-medium mb-3">Governance Voting</h3>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div className="mb-3 md:mb-0">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Support</span>
                        <div className="text-2xl font-bold mt-1">78%</div>
                      </div>
                      <div className="mb-3 md:mb-0">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Validators Voted</span>
                        <div className="text-2xl font-bold mt-1">14</div>
                      </div>
                      <div>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Stake</span>
                        <div className="text-2xl font-bold mt-1">6.2M SOL</div>
                      </div>
                    </div>
                    
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-green-500 flex items-center justify-center text-xs text-white font-bold" 
                        style={{ width: '78%' }}
                      >
                        78% FOR
                      </div>
                      <div 
                        className="h-full bg-red-500 flex items-center justify-center text-xs text-white font-bold" 
                        style={{ width: '22%' }}
                      >
                        22% AGAINST
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => navigateToVoting(selectedSimd)}
                        className={`px-5 py-2.5 rounded-full transition-all ${
                          isDarkMode 
                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        Cast Your Vote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium">No SIMD selected</h3>
                <p className="mt-1">Select a Solana Improvement Document from the list to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className={`py-6 px-8 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">Solana Improvement Documents Explorer</p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/solana-foundation/solana-improvement-documents" 
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Code size={16} className="mr-2" />
                View official repository
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage; 
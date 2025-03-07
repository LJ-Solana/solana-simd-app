import React, { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Wallet } from 'lucide-react';
import { statusColors, categoryColors } from '../utils/mockData';

const VotingPage = ({ simd, isDarkMode, walletConnected, walletAddress, onBack }) => {
  const [vote, setVote] = useState(null); // 'for' or 'against'
  const [reason, setReason] = useState('');
  const [stakedAmount, setStakedAmount] = useState(walletConnected ? '32.5' : '0');
  const [validator, setValidator] = useState(walletConnected ? 'Everstake' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (!walletConnected) {
      alert('Please connect your wallet to vote');
      return;
    }
    
    if (!vote) {
      alert('Please select a vote option');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
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
            <h1 className="text-2xl font-medium tracking-tight">Vote on SIMD-{simd.number}</h1>
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
          <div className={`rounded-xl shadow-xl p-8 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex space-x-3 mb-3">
              <span className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${statusColors[simd.status]}`}>
                {simd.status}
              </span>
              <span className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${categoryColors[simd.category]}`}>
                {simd.category}
              </span>
            </div>
            <h2 className="text-3xl font-medium tracking-tight">SIMD-{simd.number}: {simd.title}</h2>
            <p className={`mt-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {simd.summary}
            </p>
          </div>
          
          {/* Voting Form */}
          {!isSubmitted ? (
            <>
              <div className={`rounded-xl shadow-xl p-8 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-medium mb-4">Your Stake Information</h3>
                
                {walletConnected ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Staked SOL</p>
                      <p className="font-medium text-lg mt-1">{stakedAmount} SOL</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Validator</p>
                      <p className="font-medium text-lg mt-1">{validator}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Your vote weight is proportional to your staked SOL.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-amber-50'}`}>
                    <p className="text-center">Please connect your wallet to see your stake information and to vote</p>
                  </div>
                )}
              </div>
              
              <div className={`rounded-xl shadow-xl p-8 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-medium mb-4">Cast Your Vote</h3>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <button
                    onClick={() => setVote('for')}
                    disabled={!walletConnected}
                    className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center transition-all ${
                      vote === 'for'
                        ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 border-2 border-green-500 text-green-700')
                        : (isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          )
                    } ${!walletConnected && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <ThumbsUp className="mr-3" size={24} />
                    <span className="text-lg font-medium">Vote For</span>
                  </button>
                  
                  <button
                    onClick={() => setVote('against')}
                    disabled={!walletConnected}
                    className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center transition-all ${
                      vote === 'against'
                        ? (isDarkMode ? 'bg-red-600 text-white' : 'bg-red-100 border-2 border-red-500 text-red-700')
                        : (isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          )
                    } ${!walletConnected && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <ThumbsDown className="mr-3" size={24} />
                    <span className="text-lg font-medium">Vote Against</span>
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className={`block mb-2 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Reasoning (optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={!walletConnected}
                    placeholder="Explain why you are voting this way..."
                    className={`w-full p-4 rounded-xl transition-all ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32`}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={!walletConnected || !vote || isSubmitting}
                    className={`px-6 py-3 rounded-full transition-all ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${(!walletConnected || !vote) && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`rounded-xl shadow-xl p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-green-700' : 'bg-green-100'
              }`}>
                <ThumbsUp className={isDarkMode ? 'text-white' : 'text-green-600'} size={32} />
              </div>
              <h3 className="text-2xl font-medium mb-2">Vote Submitted Successfully!</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Thank you for participating in the Solana governance process.
              </p>
              <button
                onClick={onBack}
                className={`px-6 py-3 rounded-full transition-all ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Return to SIMDs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingPage; 
import React from 'react';
import { Code, Moon, Sun, Wallet, BarChart3, ArrowLeft } from 'lucide-react';

const Header = ({ 
  isDarkMode, 
  toggleDarkMode, 
  walletConnected, 
  walletAddress, 
  connectWallet,
  navigateToAnalytics = null,
  title = "Solana Improvement Documents",
  subtitle = "A comprehensive explorer for SIMDs",
  showBackButton = false,
  onBack = null
}) => {
  return (
    <header className={`p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm backdrop-blur-md bg-opacity-90`}>
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          {showBackButton && (
            <button 
              onClick={onBack}
              className={`mr-4 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="h-12 w-12 rounded-xl mr-4 bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg">
            <Code className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {navigateToAnalytics && (
            <button 
              onClick={navigateToAnalytics}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center ${
                isDarkMode ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200'
              }`}
            >
              <BarChart3 className="inline mr-2" size={16} />
              View Analytics
            </button>
          )}
          
          <button 
            onClick={connectWallet} 
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center ${
              walletConnected 
                ? (isDarkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800 border border-green-200') 
                : (isDarkMode ? 'bg-purple-700 text-white hover:bg-purple-600' : 'bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200')
            }`}
          >
            <Wallet className="inline mr-2" size={16} />
            {walletConnected ? walletAddress : 'Connect Wallet'}
          </button>
          
          <button 
            onClick={toggleDarkMode} 
            className={`px-4 py-2 rounded-full transition-all duration-200 ${isDarkMode 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {isDarkMode ? <Sun className="inline mr-1" size={16} /> : <Moon className="inline mr-1" size={16} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
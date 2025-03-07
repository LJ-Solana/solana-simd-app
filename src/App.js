import React, { useState } from 'react';
import MainPage from './components/MainPage';
import VotingPage from './components/VotingPage';
import AnalyticsPage from './components/AnalyticsPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'voting', or 'analytics'
  const [votingSimd, setVotingSimd] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to handle wallet connection
  const connectWallet = async () => {
    try {
      // In a real implementation, you would use @solana/wallet-adapter-react
      if (walletConnected) {
        setWalletConnected(false);
        setWalletAddress('');
      } else {
        setWalletConnected(true);
        // Mock wallet address
        setWalletAddress('8xPV6........3kQs');
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Navigation functions
  const navigateToVoting = (simd) => {
    setVotingSimd(simd);
    setCurrentPage('voting');
  };

  const navigateToAnalytics = () => {
    setCurrentPage('analytics');
  };

  const navigateToMain = () => {
    setCurrentPage('main');
    setVotingSimd(null);
  };

  // Render the appropriate page based on currentPage state
  if (currentPage === 'voting' && votingSimd) {
    return (
      <VotingPage 
        simd={votingSimd} 
        isDarkMode={isDarkMode} 
        walletConnected={walletConnected} 
        walletAddress={walletAddress} 
        onBack={navigateToMain} 
      />
    );
  }

  if (currentPage === 'analytics') {
    return (
      <AnalyticsPage 
        isDarkMode={isDarkMode} 
        walletConnected={walletConnected} 
        walletAddress={walletAddress} 
        onBack={navigateToMain} 
      />
    );
  }

  // Default to main page
  return (
    <MainPage 
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      walletConnected={walletConnected}
      walletAddress={walletAddress}
      connectWallet={connectWallet}
      navigateToVoting={navigateToVoting}
      navigateToAnalytics={navigateToAnalytics}
    />
  );
};

export default App;
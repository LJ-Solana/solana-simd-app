// Mock SIMD data and validator votes
export const mockSIMDs = [
  {
    number: '0001',
    title: 'SIMD Purpose and Guidelines',
    status: 'Active',
    author: 'Solana Foundation',
    category: 'Process',
    created: '2022-01-15',
    summary: 'This SIMD describes the Solana Improvement Document (SIMD) process, explaining the purpose and guidelines for creating and managing SIMDs.'
  },
  {
    number: '0002',
    title: 'SPL Token Standard',
    status: 'Final',
    author: 'Solana Core Team',
    category: 'Standards',
    created: '2022-02-03',
    summary: 'A standard interface for tokens on Solana, providing basic functionality to transfer tokens, allow tokens to be approved so they can be spent by a third party, and more.'
  },
  {
    number: '0003',
    title: 'Stake Pool Program',
    status: 'Implemented',
    author: 'Solana Ecosystem',
    category: 'Core',
    created: '2022-03-10',
    summary: 'A program for pooling together SOL to be staked by a staker, allowing participants to stake and earn rewards without managing stake accounts.'
  },
  {
    number: '0004',
    title: 'Address Lookup Tables',
    status: 'Implemented',
    author: 'Anatoly Yakovenko',
    category: 'Core',
    created: '2022-04-22',
    summary: 'A solution for handling large transactions by storing addresses in on-chain lookup tables, reducing the size of transactions.'
  },
  {
    number: '0005',
    title: 'Fee Market',
    status: 'Draft',
    author: 'Jon Cinque',
    category: 'Core',
    created: '2022-05-17',
    summary: 'A proposal to implement a fee market mechanism to improve transaction prioritization and manage network congestion.'
  }
];

export const mockValidatorVotes = [
  { 
    validator: 'Everstake',
    totalStake: 5420000,
    stakers: 1240,
    votes: [
      { simd: '0001', vote: 'for', weight: 4620000 },
      { simd: '0002', vote: 'for', weight: 5120000 },
      { simd: '0004', vote: 'against', weight: 3890000 },
      { simd: '0006', vote: 'for', weight: 4780000 },
      { simd: '0008', vote: 'for', weight: 5210000 },
    ]
  },
  { 
    validator: 'Chorus One',
    totalStake: 4210000,
    stakers: 890,
    votes: [
      { simd: '0001', vote: 'for', weight: 3850000 },
      { simd: '0002', vote: 'for', weight: 4110000 },
      { simd: '0004', vote: 'for', weight: 3990000 },
      { simd: '0005', vote: 'against', weight: 4020000 },
      { simd: '0008', vote: 'against', weight: 4150000 },
    ]
  },
  { 
    validator: 'Marinade Finance',
    totalStake: 7850000,
    stakers: 3240,
    votes: [
      { simd: '0001', vote: 'for', weight: 7650000 },
      { simd: '0002', vote: 'for', weight: 7710000 },
      { simd: '0003', vote: 'for', weight: 7720000 },
      { simd: '0005', vote: 'for', weight: 7780000 },
      { simd: '0007', vote: 'for', weight: 7830000 },
    ]
  }
];

// Status colors for design - Apple-style softer palette
export const statusColors = {
  'Draft': 'bg-amber-100 text-amber-800 border border-amber-200',
  'Active': 'bg-green-100 text-green-800 border border-green-200',
  'Final': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Implemented': 'bg-purple-100 text-purple-800 border border-purple-200',
  'Deferred': 'bg-gray-100 text-gray-800 border border-gray-200',
  'Rejected': 'bg-red-100 text-red-800 border border-red-200'
};

// Category colors for design - Apple-style softer palette
export const categoryColors = {
  'Core': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  'Standards': 'bg-teal-100 text-teal-800 border border-teal-200',
  'Process': 'bg-orange-100 text-orange-800 border border-orange-200'
}; 
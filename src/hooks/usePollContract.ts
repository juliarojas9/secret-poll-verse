import { useWriteContract, useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';

// Contract ABI - This would be generated from the compiled contract
const POLL_CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_question", "type": "string"},
      {"internalType": "string[]", "name": "_options", "type": "string[]"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"}
    ],
    "name": "createPoll",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_pollId", "type": "uint256"},
      {"internalType": "bytes", "name": "_optionIndex", "type": "bytes"},
      {"internalType": "bytes", "name": "_inputProof", "type": "bytes"}
    ],
    "name": "castVote",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_pollId", "type": "uint256"}],
    "name": "closePoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_pollId", "type": "uint256"}],
    "name": "getPollInfo",
    "outputs": [
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "string[]", "name": "options", "type": "string[]"},
      {"internalType": "uint8", "name": "totalVotes", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isClosed", "type": "bool"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"},
      {"internalType": "uint256", "name": "_pollId", "type": "uint256"}
    ],
    "name": "hasUserVoted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const POLL_CONTRACT_ADDRESS = import.meta.env.VITE_POLL_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const usePollContract = () => {
  const { address } = useAccount();
  
  const createPoll = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log('Poll created successfully');
      },
      onError: (error) => {
        console.error('Error creating poll:', error);
      },
    },
  });

  const castVote = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log('Vote cast successfully');
      },
      onError: (error) => {
        console.error('Error casting vote:', error);
      },
    },
  });

  const closePoll = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log('Poll closed successfully');
      },
      onError: (error) => {
        console.error('Error closing poll:', error);
      },
    },
  });

  const getPollInfo = (pollId: number) => {
    return useReadContract({
      address: POLL_CONTRACT_ADDRESS,
      abi: POLL_CONTRACT_ABI,
      functionName: 'getPollInfo',
      args: [BigInt(pollId)],
    });
  };

  const hasUserVoted = (pollId: number) => {
    return useReadContract({
      address: POLL_CONTRACT_ADDRESS,
      abi: POLL_CONTRACT_ABI,
      functionName: 'hasUserVoted',
      args: address ? [address, BigInt(pollId)] : undefined,
      query: {
        enabled: !!address,
      },
    });
  };

  return {
    createPoll,
    castVote,
    closePoll,
    getPollInfo,
    hasUserVoted,
  };
};

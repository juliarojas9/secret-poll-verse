import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Secret Poll Verse',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'your_wallet_connect_project_id_here',
  chains: [sepolia],
  ssr: false,
});

export const supportedChains = [sepolia];
export const defaultChain = sepolia;

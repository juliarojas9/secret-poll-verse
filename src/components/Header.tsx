import { Shield, Lock } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Header = () => {
  const { address, isConnected } = useAccount();

  return (
    <header className="border-b border-border bg-gradient-card backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
            <Lock className="h-6 w-6 text-crypto-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Poll Confidentially with FHE
            </h1>
            <p className="text-sm text-muted-foreground">
              Encrypted votes, unbiased results
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConnectButton 
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
# Secret Poll Verse

A privacy-focused polling platform powered by Fully Homomorphic Encryption (FHE) technology. Vote anonymously without revealing your preferences until polls close, ensuring unbiased and authentic results.

## Features

- **Anonymous Voting**: Cast votes without revealing your choices until the poll ends
- **FHE Encryption**: All vote data is encrypted using Fully Homomorphic Encryption
- **Wallet Integration**: Connect with popular Web3 wallets like Rainbow, MetaMask, and more
- **Real-time Results**: View poll results only after voting closes
- **Decentralized**: Built on blockchain technology for transparency and security

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Encryption**: Zama FHE (Fully Homomorphic Encryption)
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Web3 wallet (MetaMask, Rainbow, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/juliarojas9/secret-poll-verse.git
cd secret-poll-verse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to link your Web3 wallet
2. **Create Poll**: Click "Create Poll" to start a new anonymous poll
3. **Vote**: Select your preferred option (your vote is encrypted)
4. **View Results**: Results are revealed only after the poll closes

## Smart Contract

The platform uses FHE-enabled smart contracts to ensure vote privacy:
- All votes are encrypted using FHE
- Vote counts are computed homomorphically
- Results are only decrypted after polls close

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.
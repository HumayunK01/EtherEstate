<div align="center">
  <h1>🏠 EtherEstate</h1>
  <p>A blockchain-based DApp revolutionizing real estate transactions through Ethereum smart contracts</p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://docs.soliditylang.org/)
  [![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
  [![Hardhat](https://img.shields.io/badge/Hardhat-FFD700?style=for-the-badge&logo=ethereum&logoColor=black)](https://hardhat.org/)

  <img src="https://github.com/user-attachments/assets/19c3b0f0-cc6e-48a1-948f-c2d4618b366f" alt="EtherEstate Banner" width="100%"/>
  
  <h3>
    <a href="https://ethestate.vercel.app/">View Demo</a>
    <span> · </span>
    <a href="https://github.com/HumayunK01/EtherEstate">GitHub</a>
    <span> · </span>
    <a href="https://github.com/HumayunK01/EtherEstate/issues">Report Bug</a>
    <span> · </span>
    <a href="https://github.com/HumayunK01/EtherEstate/issues">Request Feature</a>
  </h3>
</div>

## 🌐 Live Website
> **Note**: The live website is deployed on the Ethereum Sepolia testnet. Make sure to:
> - Switch your MetaMask network to Sepolia
> - Get some test ETH from [Sepolia Faucet](https://sepoliafaucet.com)
> - The smart contracts are deployed at:
>   - RealEstateToken: [`0x5FbDB2315678afecb367f032d93F642f64180aa3`](https://sepolia.etherscan.io/address/0x5FbDB2315678afecb367f032d93F642f64180aa3)
>   - Marketplace: [`0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`](https://sepolia.etherscan.io/address/0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512)

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Smart Contracts](#-smart-contracts)
- [Frontend Development](#-frontend-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview
EtherEstate is a decentralized application (DApp) that leverages blockchain technology to streamline real estate transactions. It provides a secure, transparent, and efficient platform for property listing, buying, and transferring ownership using Ethereum smart contracts.

## ✨ Features
- **Wallet Integration**: Seamless MetaMask wallet connection
- **Property Listings**: Browse and search available properties
- **Smart Contract Transactions**: Secure property purchases and transfers
- **Real-time Updates**: Live transaction status and property availability
- **User Dashboard**: Manage owned properties and transactions
- **Responsive Design**: Optimized for all devices

## 🛠 Tech Stack
- **Frontend**:
  - React + Vite
  - CSS3 with Modern Design
  - Ethers.js for Web3 Integration
  
- **Blockchain**:
  - Solidity Smart Contracts
  - Hardhat Development Environment
  - Ethereum Network

## 📁 Project Structure
```
etherestate/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── assets/       # Static assets
│   └── public/           # Public assets
└── web3/                 # Smart contract development
    ├── contracts/        # Solidity contracts
    ├── test/            # Contract tests
    └── scripts/         # Deployment scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MetaMask wallet
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HumayunK01/EtherEstate.git
cd etherestate
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install blockchain dependencies:
```bash
cd ../web3
npm install
```

4. Deploy smart contracts (local network):
```bash
# In web3 directory
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

After deployment, you'll see output similar to:
```bash
RealEstateToken at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Marketplace at:    0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

5. Configure contract addresses:
- Copy the deployed contract addresses
- Navigate to `frontend/src/contracts/addresses.js`
- Update the addresses:
```javascript
export const REAL_ESTATE_TOKEN_ADDRESS = "your_token_address_here";
export const MARKETPLACE_ADDRESS = "your_marketplace_address_here";
```

6. Start the frontend development server:
```bash
# In frontend directory
npm run dev
```

7. Configure MetaMask:
- Open MetaMask
- Add a new network with these parameters:
  - Network Name: `Hardhat Local`
  - RPC URL: `http://127.0.0.1:8545`
  - Chain ID: `31337`
  - Currency Symbol: `ETH`

8. Import a test account:
- Copy a private key from the Hardhat node terminal
- In MetaMask: Accounts → Import Account → Paste private key
- You'll receive 10000 test ETH for development

## 💎 Smart Contracts
The project uses Ethereum smart contracts for:
- Property listing management
- Ownership transfers
- Payment processing
- Access control

## 🎨 Frontend Development
The frontend is built with React and features:
- Modern, responsive design
- Real-time blockchain interactions
- Optimized performance
- User-friendly interface

## 🧪 Testing
Run tests using:
```bash
# Smart contract tests
cd web3
npx hardhat test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment
1. Deploy smart contracts to mainnet/testnet
2. Configure frontend environment variables
3. Build and deploy frontend application

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <p>Built with ❤️ by Humayun Khan</p>
A blockchain-based DApp to simplify real estate transactions using Ethereum smart contracts. Built with React, Solidity, Hardhat &amp; Ethers.js, it enables wallet-based property listing, purchase, and secure on-chain ownership transfer.

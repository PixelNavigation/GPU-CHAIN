# 🚀 GPU-CHAIN: The World's First Decentralized P2P GPU Marketplace

<div align="center">

![GPU-CHAIN Logo](https://img.shields.io/badge/GPU-CHAIN-32CD32?style=for-the-badge&logo=nvidia&logoColor=white)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
[![PeerJS](https://img.shields.io/badge/PeerJS-1.5.5-FF6B6B?style=for-the-badge&logo=webrtc&logoColor=white)](https://peerjs.com/)

**🌟 Revolutionizing GPU Computing Through Decentralized Peer-to-Peer Technology 🌟**

[🎮 Live Demo](#-quick-start) • [📚 Documentation](#-features) • [🛠️ Installation](#-installation) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 What is GPU-CHAIN?

GPU-CHAIN is a **groundbreaking decentralized marketplace** that connects GPU owners with users who need computational power. Think of it as the "Airbnb for GPUs" - where anyone can rent out their idle graphics cards or access powerful computing resources on-demand!

### 🌟 Why GPU-CHAIN?

- 💰 **Monetize Your Hardware**: Turn your idle GPU into a passive income stream
- ⚡ **Access Premium GPUs**: Rent RTX 4090s, RTX 3080s without buying them
- 🌍 **Global Network**: Connect with GPU owners worldwide
- 🔒 **Blockchain Security**: Ethereum-powered secure transactions  
- 🎮 **Real-time Communication**: Peer-to-peer connections via WebRTC
- 💡 **AI & Gaming Ready**: Perfect for ML training, rendering, gaming, and more

---

## ✨ Features

### 🏪 **GPU Marketplace**
- **Browse Available GPUs**: Real-time marketplace with RTX 4090, RTX 3080, RTX 3070, and more
- **Smart Filtering**: Search by model, location, price range, and performance
- **Live Status**: See GPU availability, owner ratings, and uptime stats
- **Instant Rental**: One-click GPU rental with flexible duration options

### 💻 **My GPU Dashboard**
- **Easy GPU Listing**: List your GPU with custom pricing and specifications
- **Earnings Tracking**: Monitor your income, rental hours, and performance metrics
- **Status Management**: Toggle availability and manage rental requests
- **Analytics**: View detailed statistics about your GPU's performance

### 📊 **Rental Management**
- **Active Rentals**: Track all your ongoing GPU rentals with live progress
- **Rental History**: Complete history of past rentals and earnings
- **Task Monitoring**: See what tasks are running on rented GPUs
- **Payment Tracking**: Transparent payment history and pending balances

### 🌐 **Peer-to-Peer Network**
- **Direct Connections**: Connect directly to GPU owners via Peer ID
- **Real-time Communication**: WebRTC-powered instant messaging and data transfer
- **Network Discovery**: Find and connect with peers globally
- **Connection Management**: Manage your peer connections and network status

### 🔗 **Blockchain Integration**
- **Smart Contracts**: Ethereum-based secure payment system
- **Hardhat Development**: Complete smart contract development environment
- **Wallet Integration**: Connect your Ethereum wallet for seamless payments
- **Transaction History**: Track all blockchain transactions

---

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 18** - Modern UI with hooks and functional components
- **⚡ Vite** - Lightning-fast development and build tool
- **🎨 Custom CSS** - Beautiful grey and lime theme with animations
- **📱 Responsive Design** - Works perfectly on desktop and mobile

### Backend & Networking
- **🌐 PeerJS** - WebRTC peer-to-peer communication
- **🔗 Express.js** - RESTful API and server management
- **📡 WebSocket** - Real-time bidirectional communication

### Blockchain
- **💎 Ethereum** - Smart contract deployment and execution
- **🔨 Hardhat** - Ethereum development environment
- **📜 Solidity** - Smart contract programming language
- **💳 Ethers.js** - Ethereum library for blockchain interactions

### Additional Tools
- **🐳 Docker** - Containerized GPU worker services
- **🐍 Python** - GPU task processing and aggregation
- **📊 React Icons** - Beautiful iconography throughout the app

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git
- Ethereum wallet (MetaMask recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/GPU-CHAIN.git
cd GPU-CHAIN
```

### 2. Install Dependencies
```bash
# Install client dependencies
cd client
npm install

# Install backend dependencies
cd ../backend
npm install

# Install blockchain dependencies
cd ../smart-contracts
npm install
```

### 3. Start the Development Environment
```bash
# Terminal 1: Start the client
cd client
npm run dev

# Terminal 2: Start the backend
cd backend
npm start

# Terminal 3: Start local blockchain (optional)
cd smart-contracts
npx hardhat node
```

### 4. Open Your Browser
Visit `http://localhost:3001` and start exploring the GPU marketplace!

---

## 📱 Screenshots & Demo

### 🏠 Homepage
Beautiful landing page with feature highlights and easy navigation to all sections.

### 🏪 GPU Marketplace
<div align="center">
<img src="https://via.placeholder.com/800x400/32CD32/FFFFFF?text=GPU+Marketplace+Screenshot" alt="GPU Marketplace" width="600"/>
</div>

Browse available GPUs with detailed specifications, pricing, and owner information.

### 💰 My GPU Dashboard
<div align="center">
<img src="https://via.placeholder.com/800x400/2D2D2D/32CD32?text=My+GPU+Dashboard" alt="My GPU Dashboard" width="600"/>
</div>

Manage your GPU listings, track earnings, and monitor performance.

### 🔗 Peer Connections
<div align="center">
<img src="https://via.placeholder.com/800x400/3D3D3D/90EE90?text=Peer+Connections" alt="Peer Connections" width="600"/>
</div>

Connect with GPU owners worldwide through our P2P network.

---

## 🎮 Usage Examples

### Renting a GPU for AI Training
```javascript
// Example: Rent an RTX 4090 for 4 hours
const gpu = findGPU({ model: 'RTX 4090', minVRAM: '24GB' });
const rental = await rentGPU(gpu, { 
  duration: 4, // hours
  task: 'AI Model Training',
  maxCost: 18.00 // ETH
});
console.log(`Rented ${gpu.model} for ${rental.duration} hours!`);
```

### Listing Your GPU
```javascript
// Example: List your RTX 3080 for rent
const myGPU = {
  model: 'RTX 3080',
  vram: '10GB',
  computePower: '30 TFLOPS',
  hourlyRate: 2.80, // ETH per hour
  location: 'New York, US'
};
await listGPU(myGPU);
console.log('GPU successfully listed on marketplace!');
```

---

## 🏗️ Project Structure

```
GPU-CHAIN/
├── 📁 client/                  # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   ├── 🏪 GPUMarketplace.jsx
│   │   │   ├── 🏠 HomePage.jsx
│   │   │   ├── 🌐 PeerToPeerInterface.jsx
│   │   │   └── 🔗 BlockchainTest.jsx
│   │   ├── 📁 services/        # API and service layers
│   │   ├── 📁 hooks/          # Custom React hooks
│   │   └── 📁 utils/          # Utility functions
├── 📁 backend/                # Express.js backend server
├── 📁 smart-contracts/        # Ethereum smart contracts
│   ├── 📜 ComputeReward.sol   # Main reward contract
│   ├── 📁 scripts/           # Deployment scripts
│   └── 📁 test/              # Contract tests
├── 📁 gpu-worker/            # Docker-based GPU workers
├── 📁 peer-server/           # P2P networking server
└── 📄 README.md              # You are here!
```

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Blockchain Configuration
PRIVATE_KEY=your_ethereum_private_key
INFURA_PROJECT_ID=your_infura_project_id

# PeerJS Configuration
PEER_SERVER_HOST=localhost
PEER_SERVER_PORT=9000

# API Configuration
BACKEND_PORT=3000
FRONTEND_PORT=3001
```

### Smart Contract Deployment
```bash
cd smart-contracts
npx hardhat compile
npx hardhat deploy --network localhost
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
Found a bug? Please create an issue with:
- Detailed description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 Feature Requests
Have an idea? We'd love to hear it! Create an issue with:
- Clear description of the feature
- Use case and benefits
- Any implementation ideas

### 🔧 Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📈 Roadmap

### 🎯 Phase 1: Core Platform (✅ Completed)
- [x] Basic GPU marketplace
- [x] Peer-to-peer networking
- [x] Rental management system
- [x] Smart contract integration

### 🚀 Phase 2: Enhanced Features (🚧 In Progress)
- [ ] Mobile app development
- [ ] Advanced GPU benchmarking
- [ ] Multi-currency support
- [ ] Reputation system

### 🌟 Phase 3: Enterprise Features (📋 Planned)
- [ ] Enterprise dashboard
- [ ] API for third-party integration
- [ ] Advanced analytics
- [ ] Automated scaling

### 🔮 Phase 4: Advanced AI (💡 Future)
- [ ] AI-powered GPU matching
- [ ] Predictive pricing
- [ ] Automated task optimization
- [ ] Machine learning insights

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Ethereum Foundation** for blockchain infrastructure
- **PeerJS Community** for P2P networking solutions
- **React Team** for the amazing frontend framework
- **All Contributors** who make this project possible!

---

## 📞 Support & Contact

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/GPU-CHAIN/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/GPU-CHAIN/discussions)
- 📧 **Email**: support@gpu-chain.io
- 🐦 **Twitter**: [@GPUChain](https://twitter.com/GPUChain)
- 💬 **Discord**: [Join our community](https://discord.gg/gpu-chain)

---


**⭐ Star this repository if you find it helpful! ⭐**

Made with ❤️ by the GPU-CHAIN team

[![GitHub stars](https://img.shields.io/github/stars/yourusername/GPU-CHAIN?style=social)](https://github.com/yourusername/GPU-CHAIN/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/GPU-CHAIN?style=social)](https://github.com/yourusername/GPU-CHAIN/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/yourusername/GPU-CHAIN?style=social)](https://github.com/yourusername/GPU-CHAIN/watchers)


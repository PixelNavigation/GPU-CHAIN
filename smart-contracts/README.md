# GPU Chain Smart Contracts

This directory contains the smart contracts for the GPU Chain decentralized computing platform.

## Overview

The `ComputeReward` contract is the core smart contract that manages:
- 🏭 **Task Creation**: Users can create compute tasks with rewards
- 👷 **Worker Registration**: GPU workers register with Peer.js IDs
- 🎯 **Task Assignment**: Tasks are assigned to available workers
- ✅ **Result Verification**: Task results are verified and disputed if needed
- 💰 **Reward Distribution**: Automatic reward distribution to workers
- 📊 **Reputation System**: Worker reputation based on completed tasks
- 🔒 **Security**: Built with OpenZeppelin contracts for security

## Features

### For Task Requesters
- Create compute tasks with ETH rewards
- Set deadlines for task completion
- Verify or dispute task results
- Automatic verification after timeout period

### For Workers
- Register with Peer.js ID for P2P communication
- Browse and accept available tasks
- Submit computation results
- Claim earned rewards
- Build reputation through successful completions

### Platform Features
- 5% platform fee on task rewards
- Emergency task cancellation by contract owner
- Comprehensive task status tracking
- Gas-optimized operations

## Smart Contract Architecture

```
ComputeReward.sol
├── ERC20 Token (GPUC)
├── Task Management
├── Worker Registration
├── Reward Distribution
├── Reputation System
└── Admin Functions
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
copy .env.example .env
```

3. Update `.env` with your configuration:
   - Private key for deployment
   - RPC URLs for different networks
   - API keys for contract verification

## Usage

### Compilation
```bash
npm run compile
```

### Testing
```bash
npm run test
```

### Local Development
Start a local Hardhat node:
```bash
npm run node
```

Deploy to local network:
```bash
npm run deploy
```

### Mainnet/Testnet Deployment

Deploy to Sepolia testnet:
```bash
npm run deploy:sepolia
```

### Contract Verification
After deployment, verify the contract:
```bash
CONTRACT_ADDRESS=0x... npm run verify
```

### Interaction
Use the interaction script:
```bash
CONTRACT_ADDRESS=0x... npx hardhat run scripts/interact.js --network sepolia
```

## Contract Interface

### Key Functions

#### For Workers
- `registerWorker(string peerId)` - Register as a compute worker
- `assignTask(uint256 taskId, address worker)` - Self-assign or assign task
- `submitResult(uint256 taskId, string resultHash)` - Submit computation result
- `claimRewards()` - Claim accumulated rewards

#### For Task Requesters
- `createTask(string taskHash, uint256 deadline)` - Create new compute task
- `verifyTask(uint256 taskId)` - Verify task completion
- `disputeTask(uint256 taskId, string reason)` - Dispute task result

#### View Functions
- `getTask(uint256 taskId)` - Get task details
- `getAvailableTasks(uint256 limit)` - Get available tasks
- `getWorkerInfo(address worker)` - Get worker information
- `getPlatformStats()` - Get platform statistics

## Security Considerations

1. **Reentrancy Protection**: Uses OpenZeppelin's `ReentrancyGuard`
2. **Access Control**: Proper authorization checks for all functions
3. **Input Validation**: Comprehensive input validation
4. **Safe Math**: Uses Solidity 0.8+ built-in overflow protection
5. **Emergency Functions**: Owner can cancel tasks in emergencies

## Gas Optimization

- Efficient storage patterns
- Batch operations where possible
- Optimized loops and mappings
- Minimal external calls

## Testing

The test suite covers:
- Contract deployment and initialization
- Worker registration and management
- Task lifecycle (creation → assignment → completion → verification)
- Reward distribution and claiming
- Dispute resolution
- Edge cases and error conditions

Run tests with coverage:
```bash
npx hardhat coverage
```

## Deployment Information

After deployment, the following files are created:
- `deployments/<network>-deployment.json` - Deployment details
- `../client/src/utils/ComputeReward-abi.json` - Contract ABI for frontend
- `../client/src/utils/contract-config.json` - Contract configuration

## Network Configurations

Supported networks:
- **Hardhat** (local development)
- **Localhost** (local node)
- **Sepolia** (Ethereum testnet)
- **Mainnet** (Ethereum mainnet)
- **Polygon** (Polygon mainnet)
- **Mumbai** (Polygon testnet)

## Contributing

1. Make sure all tests pass
2. Add tests for new features
3. Follow Solidity style guide
4. Update documentation

## License

MIT License - see LICENSE file for details.

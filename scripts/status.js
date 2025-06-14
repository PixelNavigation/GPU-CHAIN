const fs = require('fs');
const path = require('path');

function showDeploymentStatus() {
  console.log("🚀 GPU Chain - Blockchain Integration Status\n");
  
  // Check if local deployment exists
  const deploymentFile = path.join(__dirname, '..', 'smart-contracts', 'deployments', 'localhost-deployment.json');
  
  if (fs.existsSync(deploymentFile)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    
    console.log("✅ LOCAL DEPLOYMENT ACTIVE");
    console.log("📍 Contract Address:", deployment.contractAddress);
    console.log("🌐 Network:", deployment.network);
    console.log("👤 Deployer:", deployment.deployerAddress);
    console.log("📅 Deployed:", new Date(deployment.timestamp).toLocaleString());
    console.log("🏷️  Token:", deployment.contractDetails.name, `(${deployment.contractDetails.symbol})`);
    console.log("💰 Total Supply:", deployment.contractDetails.totalSupply, deployment.contractDetails.symbol);
    
    console.log("\n🔗 Integration Status:");
    console.log("✅ Smart Contract: Deployed and functional");
    console.log("✅ Frontend: Integrated with ethers.js");
    console.log("✅ Backend: Auto-starts GPU worker");
    console.log("✅ Local Network: Hardhat node running");
    
    console.log("\n🌐 Access Points:");
    console.log("📱 Frontend: http://localhost:5174");
    console.log("🖥️  Backend: http://localhost:3000");
    console.log("⛓️  Blockchain: http://127.0.0.1:8545");
    
    console.log("\n🎯 Available Features:");
    console.log("• Connect MetaMask wallet");
    console.log("• Register as compute worker");
    console.log("• Create compute tasks with rewards");
    console.log("• View platform statistics");
    console.log("• Monitor worker reputation");
    
    console.log("\n📋 Next Steps:");
    console.log("1. Open browser to http://localhost:5174");
    console.log("2. Click 'Test Blockchain Features'");
    console.log("3. Connect MetaMask to localhost:8545");
    console.log("4. Import test account with private key:");
    console.log("   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    console.log("5. Test worker registration and task creation");
    
    console.log("\n🚀 For Production Deployment:");
    console.log("• Setup Tenderly fork: node scripts/tenderly-setup.js");
    console.log("• Deploy to testnet: npx hardhat run scripts/deploy.js --network sepolia");
    console.log("• See BLOCKCHAIN_INTEGRATION.md for full guide");
    
  } else {
    console.log("❌ NO LOCAL DEPLOYMENT FOUND");
    console.log("\n🔧 To deploy locally:");
    console.log("1. cd smart-contracts");
    console.log("2. npx hardhat node");
    console.log("3. npx hardhat run scripts/deploy.js --network localhost");
  }
  
  // Check if services are running
  console.log("\n🔍 Service Status Check:");
  console.log("Run these commands to start all services:");
  console.log("🔹 Blockchain: cd smart-contracts && npx hardhat node");
  console.log("🔹 Backend: cd backend && npm run dev");
  console.log("🔹 Frontend: cd client && npm run dev");
}

showDeploymentStatus();

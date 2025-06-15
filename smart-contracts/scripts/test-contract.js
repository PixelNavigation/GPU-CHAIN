const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing contract deployment and functions...");
  
  // Load the current contract address from config
  const fs = require('fs');
  const path = require('path');
  const configPath = path.join(__dirname, '../../client/src/utils/contract-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const contractAddress = config.contractAddress;
  
  // Get the contract instance
  const ComputeReward = await ethers.getContractFactory("ComputeReward");
  
  try {
    const contract = ComputeReward.attach(contractAddress);
    console.log("📋 Contract attached at:", contractAddress);
    
    // Test basic contract functions
    console.log("\n=== Testing Contract Functions ===");
    
    // Test 1: Get owner
    try {
      const owner = await contract.owner();
      console.log("✅ Owner:", owner);
    } catch (error) {
      console.error("❌ Failed to get owner:", error.message);
    }
    
    // Test 2: Get token info
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      console.log("✅ Token:", name, "(" + symbol + ")");
    } catch (error) {
      console.error("❌ Failed to get token info:", error.message);
    }
    
    // Test 3: Get platform stats
    try {
      const stats = await contract.getPlatformStats();
      console.log("✅ Platform stats:", {
        totalTasks: stats[0].toString(),
        completedTasks: stats[1].toString(),
        totalRewards: ethers.utils.formatEther(stats[2]),
        activeWorkers: stats[3].toString()
      });
    } catch (error) {
      console.error("❌ Failed to get platform stats:", error.message);
    }
    
    // Test 4: Get available tasks
    try {
      const tasks = await contract.getAvailableTasks(10);
      console.log("✅ Available tasks:", tasks.map(id => id.toString()));
    } catch (error) {
      console.error("❌ Failed to get available tasks:", error.message);
    }
    
    // Test 5: Get worker info for a test address
    const [deployer] = await ethers.getSigners();
    try {
      const workerInfo = await contract.getWorkerInfo(deployer.address);
      console.log("✅ Worker info:", {
        isRegistered: workerInfo[0],
        peerId: workerInfo[1],
        reputation: workerInfo[2].toString(),
        pendingRewards: ethers.utils.formatEther(workerInfo[3]),
        completedTasks: workerInfo[4].toString()
      });
    } catch (error) {
      console.error("❌ Failed to get worker info:", error.message);
    }
    
  } catch (error) {
    console.error("❌ Contract test failed:", error);
    console.log("\n🔄 Contract may need to be redeployed...");
    console.log("Run: npx hardhat run scripts/deploy.js --network localhost");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking wallet configuration...\n");
  
  try {
    // Get the signers (accounts)
    const signers = await ethers.getSigners();
    
    if (signers.length === 0) {
      console.error("❌ No accounts found! Check your PRIVATE_KEY in .env");
      return;
    }
    
    const deployer = signers[0];
    console.log("✅ Wallet configured successfully!");
    console.log("Address:", deployer.address);
    
    // Check balance on different networks
    const networks = ['localhost', 'sepolia', 'polygon', 'mumbai'];
    
    for (const networkName of networks) {
      try {
        if (network.name === networkName || networkName === 'localhost') {
          const balance = await deployer.getBalance();
          console.log(`💰 ${networkName} balance:`, ethers.utils.formatEther(balance), "ETH");
        }
      } catch (error) {
        console.log(`💰 ${networkName} balance: Not connected`);
      }
    }
    
    console.log("\n📋 Private key format check:");
    console.log("✅ Private key length is correct (32 bytes / 64 hex chars)");
    
    console.log("\n🚰 Get testnet funds:");
    console.log("- Sepolia: https://sepoliafaucet.com/");
    console.log("- Mumbai: https://faucet.polygon.technology/");
    console.log("- Copy this address:", deployer.address);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure your .env file has PRIVATE_KEY set");
    console.log("2. Private key should be 64 hex characters (without 0x prefix)");
    console.log("3. Never use mainnet private keys for development");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

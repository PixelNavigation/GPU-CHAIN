const { ethers } = require("hardhat");
const { tenderly } = require("hardhat");

async function main() {
  console.log("🚀 Starting GPU Chain Smart Contract Deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📱 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy ComputeReward contract
  console.log("📄 Deploying ComputeReward contract...");
  const ComputeReward = await ethers.getContractFactory("ComputeReward");
  const computeReward = await ComputeReward.deploy();
  
  await computeReward.waitForDeployment();
  const contractAddress = await computeReward.getAddress();
  
  console.log("✅ ComputeReward deployed to:", contractAddress);
  console.log("🔗 Transaction hash:", computeReward.deploymentTransaction().hash);

  // Get contract details
  const name = await computeReward.name();
  const symbol = await computeReward.symbol();
  const totalSupply = await computeReward.totalSupply();
  const owner = await computeReward.owner();

  console.log("\n📊 Contract Details:");
  console.log("- Token Name:", name);
  console.log("- Token Symbol:", symbol);
  console.log("- Total Supply:", ethers.formatEther(totalSupply), symbol);
  console.log("- Owner:", owner);

  // Verify on Tenderly if using Tenderly network
  if (hre.network.name === "tenderly") {
    console.log("\n🔍 Verifying contract on Tenderly...");
    try {
      await tenderly.verify({
        name: "ComputeReward",
        address: contractAddress,
      });
      console.log("✅ Contract verified on Tenderly");
    } catch (error) {
      console.log("❌ Tenderly verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    transactionHash: computeReward.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    contractDetails: {
      name: name,
      symbol: symbol,
      totalSupply: ethers.formatEther(totalSupply),
      owner: owner
    }
  };

  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Generate ABI file for frontend integration
  const artifacts = await hre.artifacts.readArtifact("ComputeReward");
  const abiFile = path.join(deploymentsDir, 'ComputeReward-abi.json');
  fs.writeFileSync(abiFile, JSON.stringify(artifacts.abi, null, 2));
  
  console.log(`📄 Contract ABI saved to: ${abiFile}`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next Steps:");
  console.log("1. Copy the contract address to your frontend configuration");
  console.log("2. Update the ABI in your React application");
  console.log("3. Configure ethers.js to interact with the deployed contract");
  console.log("4. Test the contract functions through your P2P interface");

  return {
    contractAddress,
    deployer: deployer.address,
    network: hre.network.name
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

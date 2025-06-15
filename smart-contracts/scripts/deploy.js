const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting GPU Chain smart contract deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.warn("⚠️  Warning: Low balance! Make sure you have enough ETH for deployment and gas fees.");
  }
  
  // Deploy ComputeReward contract
  console.log("\n📦 Deploying ComputeReward contract...");
  const ComputeReward = await ethers.getContractFactory("ComputeReward");
  
  // Deploy with gas estimation
  const gasEstimate = await ComputeReward.signer.estimateGas(
    ComputeReward.getDeployTransaction()
  );
  console.log("⛽ Estimated gas for deployment:", gasEstimate.toString());
  
  const computeReward = await ComputeReward.deploy({
    gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
  });
  
  console.log("⏳ Waiting for deployment transaction...");
  await computeReward.deployed();
  
  console.log("✅ ComputeReward deployed to:", computeReward.address);
  console.log("📄 Transaction hash:", computeReward.deployTransaction.hash);
  
  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await computeReward.deployTransaction.wait(2);
  
  // Get contract info
  const name = await computeReward.name();
  const symbol = await computeReward.symbol();
  const totalSupply = await computeReward.totalSupply();
  const owner = await computeReward.owner();
  
  console.log("\n📊 Contract Information:");
  console.log("- Token Name:", name);
  console.log("- Token Symbol:", symbol);
  console.log("- Total Supply:", ethers.utils.formatEther(totalSupply), "GPUC");
  console.log("- Owner:", owner);
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    contractAddress: computeReward.address,
    deploymentHash: computeReward.deployTransaction.hash,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: computeReward.deployTransaction.blockNumber,
    gasUsed: computeReward.deployTransaction.gasLimit?.toString(),
    contractInfo: {
      name,
      symbol,
      totalSupply: totalSupply.toString(),
      owner
    }
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${network.name}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  // Update the ABI file in client
  const contractAbi = ComputeReward.interface.format(ethers.utils.FormatTypes.json);
  const abiPath = path.join(__dirname, "..", "..", "client", "src", "utils", "ComputeReward-abi.json");
  
  // Ensure the directory exists
  const abiDir = path.dirname(abiPath);
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }
  
  fs.writeFileSync(abiPath, JSON.stringify(JSON.parse(contractAbi), null, 2));
  
  // Create a config file for the frontend
  const frontendConfig = {
    contractAddress: computeReward.address,
    network: network.name,
    chainId: network.config.chainId,
    deployedAt: deploymentInfo.deployedAt
  };
  
  const configPath = path.join(__dirname, "..", "..", "client", "src", "utils", "contract-config.json");
  fs.writeFileSync(configPath, JSON.stringify(frontendConfig, null, 2));
  
  console.log("\n📁 Files created:");
  console.log("- Deployment info:", deploymentFile);
  console.log("- Contract ABI:", abiPath);
  console.log("- Frontend config:", configPath);
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Fund the contract with ETH for initial rewards (optional)");
  console.log("2. Update your frontend to use the new contract address");
  console.log("3. Test the contract functions");
  
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n🔍 Verify contract on Etherscan:");
    console.log(`npx hardhat verify --network ${network.name} ${computeReward.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

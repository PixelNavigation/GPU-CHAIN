const { ethers } = require("hardhat");

/**
 * Script to interact with deployed ComputeReward contract
 * Usage: npx hardhat run scripts/interact.js --network <network>
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Interacting with contracts using account:", deployer.address);

  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x...";
  
  if (CONTRACT_ADDRESS === "0x...") {
    console.error("Please set CONTRACT_ADDRESS environment variable or update the script");
    process.exit(1);
  }

  // Get contract instance
  const ComputeReward = await ethers.getContractFactory("ComputeReward");
  const computeReward = ComputeReward.attach(CONTRACT_ADDRESS);

  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Network:", network.name);

  try {
    // Get basic info
    console.log("\n=== Contract Info ===");
    const name = await computeReward.name();
    const symbol = await computeReward.symbol();
    const owner = await computeReward.owner();
    const totalSupply = await computeReward.totalSupply();
    
    console.log("Token Name:", name);
    console.log("Token Symbol:", symbol);
    console.log("Owner:", owner);
    console.log("Total Supply:", ethers.utils.formatEther(totalSupply), "GPUC");

    // Get platform stats
    console.log("\n=== Platform Stats ===");
    const [totalTasks, completedTasks, totalRewards, activeWorkers] = 
      await computeReward.getPlatformStats();
    
    console.log("Total Tasks Created:", totalTasks.toString());
    console.log("Completed Tasks:", completedTasks.toString());
    console.log("Total Rewards Distributed:", ethers.utils.formatEther(totalRewards), "ETH");
    console.log("Active Workers:", activeWorkers.toString());

    // Get available tasks
    console.log("\n=== Available Tasks ===");
    const availableTasks = await computeReward.getAvailableTasks(10);
    console.log("Available Tasks:", availableTasks.map(id => id.toString()));

    // Check if deployer is registered as worker
    console.log("\n=== Worker Info ===");
    const [isRegistered, peerId, reputation, pendingRewards, completedTasksCount] = 
      await computeReward.getWorkerInfo(deployer.address);
    
    console.log("Is Registered:", isRegistered);
    if (isRegistered) {
      console.log("Peer ID:", peerId);
      console.log("Reputation:", reputation.toString());
      console.log("Pending Rewards:", ethers.utils.formatEther(pendingRewards), "ETH");
      console.log("Completed Tasks:", completedTasksCount.toString());
    }

    // Example operations (uncomment to use)
    
    // Register as worker (uncomment and set PEER_ID)
    // const PEER_ID = "12D3KooWExample" + Math.random().toString(36).substr(2, 9);
    // if (!isRegistered) {
    //   console.log("\n=== Registering as Worker ===");
    //   const tx = await computeReward.registerWorker(PEER_ID);
    //   await tx.wait();
    //   console.log("Registered as worker with Peer ID:", PEER_ID);
    // }

    // Create a task (uncomment to use)
    // console.log("\n=== Creating Task ===");
    // const taskHash = "QmTest" + Math.random().toString(36).substr(2, 9);
    // const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    // const rewardAmount = ethers.utils.parseEther("0.01");
    // 
    // const tx = await computeReward.createTask(taskHash, deadline, { value: rewardAmount });
    // const receipt = await tx.wait();
    // const taskId = receipt.events.find(e => e.event === 'TaskCreated').args.taskId;
    // console.log("Created task with ID:", taskId.toString());

  } catch (error) {
    console.error("Error interacting with contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

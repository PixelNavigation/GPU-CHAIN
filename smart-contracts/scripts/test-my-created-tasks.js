const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Testing getMyCreatedTasks functionality...");
    
    // Get signers
    const [deployer, user1, user2] = await ethers.getSigners();
    
    console.log("👤 Deployer:", deployer.address);
    console.log("👤 User1:", user1.address);
    console.log("👤 User2:", user2.address);
    
    // Get contract address from deployment info
    const deploymentInfo = require('../deployments/localhost-deployment.json');
    const contractAddress = deploymentInfo.contractAddress;
    
    console.log("📋 Contract address:", contractAddress);
    
    // Get contract instance
    const ComputeReward = await ethers.getContractFactory("ComputeReward");
    const contract = ComputeReward.attach(contractAddress);
    
    try {
        // Test 1: Check if getTasksByCreator method exists
        console.log("\n🔍 Test 1: Checking contract methods...");
        console.log("Contract interface methods:", Object.keys(contract.interface.functions));
        
        // Test 2: Create a task as user1
        console.log("\n🔍 Test 2: Creating a task as user1...");
        const taskHash = "QmTestTask123";
        const reward = ethers.parseEther("0.1");
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        
        const createTx = await contract.connect(user1).createTask(taskHash, deadline, { value: reward });
        await createTx.wait();
        console.log("✅ Task created successfully");
        
        // Test 3: Try to get tasks by creator (if method exists)
        console.log("\n🔍 Test 3: Getting tasks by creator...");
        try {
            if (contract.getTasksByCreator) {
                const createdTasks = await contract.getTasksByCreator(user1.address);
                console.log("✅ Tasks by creator:", createdTasks);
            } else {
                console.log("⚠️ getTasksByCreator method not found in contract");
                
                // Alternative: Get all tasks and filter manually
                console.log("\n🔍 Alternative: Getting all tasks and filtering...");
                const totalTasks = await contract.taskCounter();
                console.log("Total tasks:", totalTasks.toString());
                
                for (let i = 1; i <= totalTasks; i++) {
                    try {
                        const taskInfo = await contract.getTaskInfo(i);
                        console.log(`Task ${i}:`, {
                            creator: taskInfo.creator,
                            taskHash: taskInfo.taskHash,
                            reward: ethers.formatEther(taskInfo.reward),
                            completed: taskInfo.completed
                        });
                    } catch (err) {
                        console.log(`Task ${i}: Not found or error -`, err.message);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error calling getTasksByCreator:", error.message);
        }
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

const { run } = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  
  if (!CONTRACT_ADDRESS) {
    console.error("Please provide CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  console.log("Verifying contract at:", CONTRACT_ADDRESS);

  try {
    await run("verify:verify", {
      address: CONTRACT_ADDRESS,
      constructorArguments: [], // ComputeReward constructor has no arguments
    });
    
    console.log("Contract verified successfully!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

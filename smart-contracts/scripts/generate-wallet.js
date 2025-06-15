const { ethers } = require("ethers");

/**
 * Generate a new wallet for development/testing
 * WARNING: Only use for development, never use generated wallets for mainnet with real funds
 */

function generateWallet() {
    console.log("🔑 Generating new development wallet...\n");
    
    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();
    
    console.log("=== DEVELOPMENT WALLET ===");
    console.log("Address:", wallet.address);
    console.log("Private Key:", wallet.privateKey);
    console.log("Mnemonic:", wallet.mnemonic.phrase);
    console.log("\n⚠️  IMPORTANT SECURITY NOTES:");
    console.log("- This is for DEVELOPMENT/TESTING only");
    console.log("- NEVER use this wallet on mainnet with real funds");
    console.log("- NEVER commit this private key to version control");
    console.log("- Fund this wallet with testnet ETH only");
    
    console.log("\n📝 Next steps:");
    console.log("1. Copy the private key (without 0x prefix) to your .env file");
    console.log("2. Get testnet ETH from faucets:");
    console.log("   - Sepolia: https://sepoliafaucet.com/");
    console.log("   - Mumbai: https://faucet.polygon.technology/");
    console.log("3. Update your .env file with the private key");
    
    console.log("\n💡 .env file format:");
    console.log(`PRIVATE_KEY=${wallet.privateKey.slice(2)}`); // Remove 0x prefix
}

// Run the generator
generateWallet();

import { config as dotenvConfig } from 'dotenv';
import hardhat from 'hardhat';

const { ethers } = hardhat;

dotenvConfig();


console.log("SEPOLIA_RPC_URL:", process.env.SEPOLIA_RPC_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("ETHERSCAN_API_KEY:", process.env.ETHERSCAN_API_KEY);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance); 

  const SecureDocsNFT = await ethers.getContractFactory("SecureDocsNFT");
  const secureDocsNFTFactory = await SecureDocsNFT.deploy(deployer.address);

  // Wait for the contract to be deployed
  const secureDocsNFT = await secureDocsNFTFactory.waitForDeployment(); 

  console.log("SecureDocsNFT deployed to:",await secureDocsNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
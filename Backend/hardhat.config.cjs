require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require("@nomicfoundation/hardhat-verify");
const { vars } = require("hardhat/config");

const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.8.20",
      },
    ],
  }, 
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com", 
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io"
        }
      }
    ]
  }
};
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;

// npx hardhat run scripts/deploy.ts --network sepolia
// Contract deployed to: 0xb619629915558FF04c4b67CC0C2D221fb201d3EF
// check: https://sepolia.etherscan.io/

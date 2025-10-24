import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    og: {
      url: process.env.OG_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;

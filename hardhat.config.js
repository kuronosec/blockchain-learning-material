require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

const { SEPOLIA_RPC_URL, AMOY_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

function resolveAccounts(privateKey) {
  if (!privateKey) {
    return [];
  }

  const normalized = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  const isValidKey = /^0x[a-fA-F0-9]{64}$/.test(normalized);

  return isValidKey ? [normalized] : [];
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: resolveAccounts(PRIVATE_KEY)
    },
    amoy: {
      url: AMOY_RPC_URL || "",
      accounts: resolveAccounts(PRIVATE_KEY)
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || ""
  }
};

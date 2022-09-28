require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
let ALCHEMY_API_KEY_FINAL = process.env.ALCHEMY_API_KEY;
let GOERLI_PRIVATE_KEY_FINAL = process.env.WALLET_KEY;
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY_FINAL}`,
      accounts: [GOERLI_PRIVATE_KEY_FINAL],
    },
  },
};

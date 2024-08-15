import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
// setup dot env
import dotenv from "dotenv";
dotenv.config();

const config: any = {
    solidity: {
        version: "0.8.17",
        settings: {
            viaIR: true,
            optimizer: {
                enabled: true,
                runs: 1,
            },
        },
    },
    networks: {
        hardhat: {
            blockGasLimit: 30_000_000,
            throwOnCallFailures: false,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        tBSC: {
            url: "https://bsc-testnet.infura.io/v3/317b537f510e4a40a6126d2ee0e11b92",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 97,
        },
        bsc_mainnet: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },

};

export default config;

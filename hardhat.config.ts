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
            allowUnlimitedContractSize: false,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        tBSC: {
            url: "https://bsc-testnet.nodereal.io/v1/ea9698803a31428c95ee6098cbcf529e",
            accounts: ["3ee200acb8f82894d1ef0ef8653d86d95d80fdc9ac26fb2145159202cda5b49b"],
            chainId: 97,
        },
        bsc_mainnet: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
    allowUnlimitedContractSize: true,
};

export default config;

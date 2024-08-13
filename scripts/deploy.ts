// npx hardhat run scripts/deploy.ts --network tBSC
import { artifacts, ethers } from "hardhat";
import path from "path";
import { MyContract, TokenERC20 } from "../typechain-types";

async function main() {
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contracts with the account:", await deployer.getAddress());

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("TokenERC20");
    const token = await Token.deploy("Test ERC20", "tERC20");
    await token.deployed();

    console.log("Token contract deployed to:", token.address);

    const MyContractFactory = await ethers.getContractFactory("MyContract");
    const myContract = await MyContractFactory.deploy(token.address);
    await myContract.deployed();
    console.log("Logic contract deployed to:", myContract.address);

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(token, "TokenERC20");
    saveFrontendFiles(myContract, "MyContract");
}

function saveFrontendFiles(token:TokenERC20| MyContract, name:string) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(path.join(contractsDir, `${name}-address.json`), JSON.stringify({ Token: token.address }, undefined, 2));

    const TokenArtifact = artifacts.readArtifactSync(name);

    fs.writeFileSync(path.join(contractsDir, `${name}.json`), JSON.stringify(TokenArtifact, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

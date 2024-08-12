// npx hardhat run scripts/deploy.ts --network tBSC
import { ethers, upgrades } from "hardhat";

async function main() {
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contracts with the account:", await deployer.getAddress());

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("TokenERC20");
    const token = await Token.deploy("Test ERC20", "tERC20");
    await token.deployed();

    console.log("Token contract deployed to:", token.address);

    const BetContractFactory = await ethers.getContractFactory("LogicContract");
    const LogicContract = await upgrades.deployProxy(BetContractFactory, [token.address], {
        initializer: "__LogicContract_init",
    });
    const logicContract = await LogicContract.deployed();
    console.log("Logic contract deployed to:", logicContract.address);

    // We also save the contract's artifacts and address in the frontend directory
    // saveFrontendFiles(token);
}

// function saveFrontendFiles(token) {
//     const fs = require("fs");
//     const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

//     if (!fs.existsSync(contractsDir)) {
//         fs.mkdirSync(contractsDir);
//     }

//     fs.writeFileSync(path.join(contractsDir, "contract-address.json"), JSON.stringify({ Token: token.address }, undefined, 2));

//     const TokenArtifact = artifacts.readArtifactSync("Token");

//     fs.writeFileSync(path.join(contractsDir, "Token.json"), JSON.stringify(TokenArtifact, null, 2));
// }

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

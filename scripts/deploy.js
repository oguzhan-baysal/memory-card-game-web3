const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MemoryGame contract...");

  // Get the contract factory
  const MemoryGame = await ethers.getContractFactory("MemoryGame");

  // Deploy the contract
  const memoryGame = await MemoryGame.deploy();
  await memoryGame.waitForDeployment();

  const contractAddress = await memoryGame.getAddress();
  
  console.log("MemoryGame contract deployed to:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Gas used in deployment:", await ethers.provider.getTransactionReceipt(memoryGame.deploymentTransaction().hash).then(receipt => receipt.gasUsed.toString()));

  // Save contract address and ABI for frontend
  const fs = require("fs");
  const contractsDir = "./frontend/src/contracts";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ MemoryGame: contractAddress }, undefined, 2)
  );

  // Save ABI
  const MemoryGameArtifact = await ethers.getContractFactory("MemoryGame");
  fs.writeFileSync(
    contractsDir + "/MemoryGame.json",
    JSON.stringify(MemoryGameArtifact.interface.format('json'), null, 2)
  );

  console.log("Contract address and ABI saved to frontend/src/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
const hre = require("hardhat");

async function main() {
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.waitForDeployment();
  console.log("SimpleStorage deployed to:", simpleStorage.target);

  // Example interaction after deploy to verify things are working.
  const tx = await simpleStorage.set(42);
  await tx.wait();
  console.log("Initial stored value:", await simpleStorage.get());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

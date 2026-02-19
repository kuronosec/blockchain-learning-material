const hre = require("hardhat");

async function main() {
  const [addressArg, valueArg] = process.argv.slice(2);
  const contractAddress = addressArg || process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error(
      "Missing contract address. Usage: yarn local:interact <CONTRACT_ADDRESS> [NEW_VALUE]"
    );
  }

  const newValue = valueArg !== undefined ? Number(valueArg) : 123;
  if (!Number.isInteger(newValue) || newValue < 0) {
    throw new Error("NEW_VALUE must be a non-negative integer.");
  }

  const simpleStorage = await hre.ethers.getContractAt(
    "SimpleStorage",
    contractAddress
  );

  const currentValue = await simpleStorage.get();
  console.log("Current stored value:", currentValue.toString());

  const tx = await simpleStorage.set(newValue);
  await tx.wait();
  console.log("Updated value to:", newValue);

  const updatedValue = await simpleStorage.get();
  console.log("Stored value now:", updatedValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

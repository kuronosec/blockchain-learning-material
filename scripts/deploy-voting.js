const hre = require("hardhat");

function parseCandidates(rawArg) {
  const input = rawArg || process.env.CANDIDATES || "Alice,Bob";
  const candidates = input
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (candidates.length === 0) {
    throw new Error("Provide at least one candidate name.");
  }

  return candidates;
}

async function main() {
  const candidates = parseCandidates(process.env.CANDIDATES);

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidates);
  await voting.waitForDeployment();

  console.log("Voting deployed to:", voting.target);
  console.log("Candidates:", candidates.join(", "));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

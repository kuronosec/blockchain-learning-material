const hre = require("hardhat");

function parseCandidateIndex(rawArg) {
  const value = rawArg ?? "0";
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error("CANDIDATE_INDEX must be a non-negative integer.");
  }

  return parsed;
}

async function printCandidates(voting, count) {
  console.log("Current results:");

  for (let i = 0; i < count; i++) {
    const [name, voteCount] = await voting.getCandidate(i);
    console.log(`- [${i}] ${name}: ${voteCount.toString()} votes`);
  }
}

async function main() {
  const [addressArg, candidateArg] = process.argv.slice(2);
  const contractAddress = addressArg || process.env.VOTING_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error(
      "Missing contract address. Usage: node scripts/interact-voting.js <CONTRACT_ADDRESS> [CANDIDATE_INDEX]"
    );
  }

  const candidateIndex = parseCandidateIndex(candidateArg);

  const voting = await hre.ethers.getContractAt("Voting", contractAddress);
  const [voter] = await hre.ethers.getSigners();

  const count = Number(await voting.getCandidatesCount());
  if (candidateIndex >= count) {
    throw new Error(`Invalid candidate index. Must be between 0 and ${count - 1}.`);
  }

  await printCandidates(voting, count);

  const alreadyVoted = await voting.hasAddressVoted(voter.address);
  console.log("Voter:", voter.address);
  console.log("Has already voted:", alreadyVoted);

  if (!alreadyVoted) {
    const tx = await voting.vote(candidateIndex);
    await tx.wait();
    console.log("Vote submitted for candidate index:", candidateIndex);
  } else {
    console.log("Skipping vote because this address already voted.");
  }

  await printCandidates(voting, count);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

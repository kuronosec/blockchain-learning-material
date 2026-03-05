const hre = require("hardhat");

const AMOUNT_PER_RECIPIENT_POL = "2";

function parseRecipients(rawArgs) {
  const combinedArgs = rawArgs.join(",");
  const source = combinedArgs || process.env.RECIPIENTS || "";

  const recipients = source
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    throw new Error(
      "Missing recipients. Usage: yarn amoy:send-pol 0xAddr1,0xAddr2 or RECIPIENTS=0xAddr1,0xAddr2 yarn amoy:send-pol"
    );
  }

  const invalid = recipients.filter((address) => !hre.ethers.isAddress(address));
  if (invalid.length > 0) {
    throw new Error(`Invalid recipient address(es): ${invalid.join(", ")}`);
  }

  return recipients;
}

async function main() {
  const recipients = parseRecipients(process.argv.slice(2));
  const [sender] = await hre.ethers.getSigners();
  const amountPerRecipient = hre.ethers.parseEther(AMOUNT_PER_RECIPIENT_POL);

  console.log(`Network: ${hre.network.name}`);
  console.log(`Sender: ${sender.address}`);
  console.log(`Recipients: ${recipients.length}`);
  console.log(`Amount per recipient: ${AMOUNT_PER_RECIPIENT_POL} POL`);

  const totalRequired = amountPerRecipient * BigInt(recipients.length);
  const balance = await hre.ethers.provider.getBalance(sender.address);

  if (balance < totalRequired) {
    throw new Error(
      `Insufficient balance. Need at least ${hre.ethers.formatEther(totalRequired)} POL, current balance is ${hre.ethers.formatEther(balance)} POL (gas not included).`
    );
  }

  for (const recipient of recipients) {
    const tx = await sender.sendTransaction({
      to: recipient,
      value: amountPerRecipient
    });

    console.log(`Sent ${AMOUNT_PER_RECIPIENT_POL} POL to ${recipient}. Tx: ${tx.hash}`);
    await tx.wait();
  }

  console.log("All transfers completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

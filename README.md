# Blockchain Learning Material

Minimal Hardhat setup with a single `SimpleStorage` contract for local or testnet practice.

## Prerequisites
- Node.js 18+
- npm

## Setup
```bash
npm install
```

## Useful scripts
- `npx hardhat compile` – build the contracts.
- `npx hardhat test` – run sample tests.
- `npx hardhat node` – start a local JSON-RPC node.
- `npm run deploy` – deploy `SimpleStorage` to the local node (run the node first).
- `npx hardhat run scripts/deploy.js --network sepolia` – deploy to Sepolia after setting `.env`.

## Configure testnet (optional)
Copy `.env.example` to `.env` and fill:
- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY` (only if you want verification)

## What the contract does
`contracts/SimpleStorage.sol` stores a single `uint256` value. Call `set(newValue)` to update and `get()` to read it. Each update emits `ValueUpdated`.

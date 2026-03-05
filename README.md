# Blockchain Learning Material

Minimal Hardhat setup with `SimpleStorage` and `Voting` contracts for local or testnet practice.

## Prerequisites
- Node.js 18+
- Yarn
- Git

## Install Git and Yarn
### Ubuntu / Debian
```bash
sudo apt update
sudo apt install -y git curl
curl -o- -L https://yarnpkg.com/install.sh | bash
```

### macOS (Homebrew)
```bash
brew install git yarn
```

### Windows (winget)
```powershell
winget install --id Git.Git -e
winget install --id Yarn.Yarn -e
```

## Add Yarn and Hardhat to terminal commands
If you get `command not found` for `yarn` or `hardhat`, add them to your shell `PATH`.

### Linux / macOS (bash or zsh)
```bash
echo 'export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

For bash, replace `~/.zshrc` with `~/.bashrc`.

To use local `hardhat` directly in the current project terminal:
```bash
export PATH="$(pwd)/node_modules/.bin:$PATH"
```

### Windows (PowerShell)
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$HOME\\AppData\\Local\\Yarn\\bin", "User")
```
Then restart the terminal.

### Verify
```bash
yarn --version
yarn hardhat --version
```

## Setup
```bash
yarn install
```

If you are on Windows, this install step is required before any `*:interact` script so `cross-env` is available.

## Run a local Ethereum node
1. Install dependencies:
```bash
yarn setup
```
2. Start local node (keep this terminal open):
```bash
yarn local:node
```
3. In another terminal, deploy to local node:
```bash
yarn local:deploy
```
4. Interact with deployed contract (replace with your deployed address):
```bash
yarn local:interact <CONTRACT_ADDRESS> [NEW_VALUE]
```

Hardhat local JSON-RPC endpoint: `http://127.0.0.1:8545` (chain id `31337`).

## Use the Voting contract locally
1. Make sure your local node is running:
```bash
yarn local:node
```
2. In another terminal, deploy `Voting` with default candidates (`Alice,Bob`):
```bash
yarn local:voting:deploy
```
Or deploy with custom candidates:
Linux / macOS:
```bash
CANDIDATES="Alice,Bob,Charlie" yarn local:voting:deploy
```
Windows PowerShell:
```powershell
$env:CANDIDATES="Alice,Bob,Charlie"; yarn local:voting:deploy
```
3. Interact with deployed contract (replace with your deployed address):
```bash
yarn local:voting:interact <CONTRACT_ADDRESS> [CANDIDATE_INDEX]
```

The interact script prints current results, checks whether the current signer already voted, and submits a vote if not.

## Deploy and interact on Polygon Amoy (both contracts)
1. Copy `.env.example` to `.env` and set:
```bash
AMOY_RPC_URL=https://polygon-amoy.infura.io/v3/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```
2. Deploy `SimpleStorage`:
```bash
yarn amoy:simple:deploy
```
3. Interact with `SimpleStorage` (replace with deployed address):
```bash
yarn amoy:simple:interact <CONTRACT_ADDRESS> [NEW_VALUE]
```
4. Deploy `Voting` (defaults to `Alice,Bob`):
```bash
yarn amoy:voting:deploy
```
Or with custom candidates:
Linux / macOS:
```bash
CANDIDATES="Alice,Bob,Charlie" yarn amoy:voting:deploy
```
Windows PowerShell:
```powershell
$env:CANDIDATES="Alice,Bob,Charlie"; yarn amoy:voting:deploy
```
5. Interact with `Voting`:
```bash
yarn amoy:voting:interact <CONTRACT_ADDRESS> [CANDIDATE_INDEX]
```

## Useful scripts
- `yarn hardhat compile` – build the contracts.
- `yarn hardhat test` – run sample tests.
- `yarn hardhat node` – start a local JSON-RPC node.
- `yarn deploy` – deploy `SimpleStorage` to the local node (run the node first).
- `yarn local:node` – start local node on `127.0.0.1:8545`.
- `yarn local:deploy` – deploy `SimpleStorage` to local node.
- `yarn local:interact <CONTRACT_ADDRESS> [NEW_VALUE]` – read and update `SimpleStorage` on local node.
- `CANDIDATES="Alice,Bob,Charlie" yarn local:voting:deploy` – deploy `Voting` to local node with optional candidate list.
- `yarn local:voting:interact <CONTRACT_ADDRESS> [CANDIDATE_INDEX]` – view results and cast a vote from the current signer.
- `yarn amoy:simple:deploy` – deploy `SimpleStorage` to Polygon Amoy.
- `yarn amoy:simple:interact <CONTRACT_ADDRESS> [NEW_VALUE]` – read and update `SimpleStorage` on Polygon Amoy.
- `CANDIDATES="Alice,Bob,Charlie" yarn amoy:voting:deploy` – deploy `Voting` to Polygon Amoy with optional candidate list.
- `yarn amoy:voting:interact <CONTRACT_ADDRESS> [CANDIDATE_INDEX]` – view results and cast a vote on Polygon Amoy.
- `yarn hardhat run scripts/deploy.js --network sepolia` – deploy to Sepolia after setting `.env`.
- `yarn amoy:send-pol 0xRecipient1,0xRecipient2` – send `2 POL` to each recipient on Polygon Amoy.

## Configure testnet (optional)
Copy `.env.example` to `.env` and fill:
- `SEPOLIA_RPC_URL`
- `AMOY_RPC_URL` (for Polygon Amoy scripts)
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY` (only if you want verification)

## Send 2 POL on Polygon Amoy to multiple recipients
1. Ensure `.env` includes:
```bash
AMOY_RPC_URL=https://polygon-amoy.infura.io/v3/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```
2. Run:
```bash
yarn amoy:send-pol 0xRecipient1,0xRecipient2,0xRecipient3
```
Or with env var:
```bash
RECIPIENTS=0xRecipient1,0xRecipient2 yarn amoy:send-pol
```

The script sends exactly `2 POL` to each address sequentially and waits for each transaction confirmation.

## What the contract does
`contracts/SimpleStorage.sol` stores a single `uint256` value. Call `set(newValue)` to update and `get()` to read it. Each update emits `ValueUpdated`.

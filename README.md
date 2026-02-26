# Blockchain Learning Material

Minimal Hardhat setup with a single `SimpleStorage` contract for local or testnet practice.

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

If you are on Windows, this install step is required before `yarn local:interact` so `cross-env` is available.

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

## Useful scripts
- `yarn hardhat compile` – build the contracts.
- `yarn hardhat test` – run sample tests.
- `yarn hardhat node` – start a local JSON-RPC node.
- `yarn deploy` – deploy `SimpleStorage` to the local node (run the node first).
- `yarn local:node` – start local node on `127.0.0.1:8545`.
- `yarn local:deploy` – deploy `SimpleStorage` to local node.
- `yarn local:interact <CONTRACT_ADDRESS> [NEW_VALUE]` – read and update `SimpleStorage` on local node.
- `yarn hardhat run scripts/deploy.js --network sepolia` – deploy to Sepolia after setting `.env`.

## Configure testnet (optional)
Copy `.env.example` to `.env` and fill:
- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY` (only if you want verification)

## What the contract does
`contracts/SimpleStorage.sol` stores a single `uint256` value. Call `set(newValue)` to update and `get()` to read it. Each update emits `ValueUpdated`.

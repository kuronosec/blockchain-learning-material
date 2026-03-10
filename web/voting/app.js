const AMOY_CHAIN_ID_HEX = "0x13882";
const STORAGE_KEY = "voting_contract_address";

const VOTING_ABI = [
  "function getCandidatesCount() view returns (uint256)",
  "function getCandidate(uint256) view returns (string name, uint256 voteCount)",
  "function hasAddressVoted(address) view returns (bool)",
  "function vote(uint256)"
];

const state = {
  provider: null,
  signer: null,
  contract: null,
  account: null
};

const ui = {
  connectBtn: document.getElementById("connectBtn"),
  switchAmoyBtn: document.getElementById("switchAmoyBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  loadContractBtn: document.getElementById("loadContractBtn"),
  account: document.getElementById("account"),
  network: document.getElementById("network"),
  hasVoted: document.getElementById("hasVoted"),
  contractAddress: document.getElementById("contractAddress"),
  candidates: document.getElementById("candidates"),
  status: document.getElementById("status")
};

function setStatus(message, isError = false) {
  ui.status.textContent = message;
  ui.status.classList.toggle("error", isError);
}

function shortenAddress(address) {
  if (!address || address.length < 12) return address || "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function resetCandidates() {
  ui.candidates.innerHTML = "";
}

async function updateNetworkLabel() {
  if (!state.provider) {
    ui.network.textContent = "Unknown";
    return;
  }

  const network = await state.provider.getNetwork();
  const chainId = Number(network.chainId);
  const label = chainId === 80002 ? "Polygon Amoy (80002)" : `${network.name} (${chainId})`;
  ui.network.textContent = label;
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus("MetaMask not found. Install MetaMask first.", true);
    return;
  }

  state.provider = new ethers.BrowserProvider(window.ethereum);
  await state.provider.send("eth_requestAccounts", []);
  state.signer = await state.provider.getSigner();
  state.account = await state.signer.getAddress();

  ui.account.textContent = shortenAddress(state.account);
  await updateNetworkLabel();
  setStatus("Wallet connected.");
}

async function switchToAmoy() {
  if (!window.ethereum) {
    setStatus("MetaMask not found. Install MetaMask first.", true);
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: AMOY_CHAIN_ID_HEX }]
    });
    await updateNetworkLabel();
    setStatus("Switched to Polygon Amoy.");
  } catch (error) {
    setStatus(`Failed to switch network: ${error.message}`, true);
  }
}

function getAddressFromInput() {
  const input = ui.contractAddress.value.trim();
  if (!ethers.isAddress(input)) {
    throw new Error("Enter a valid contract address.");
  }
  return input;
}

async function ensureConnected() {
  if (!state.signer) {
    await connectWallet();
  }
}

async function updateHasVoted() {
  if (!state.contract || !state.account) {
    ui.hasVoted.textContent = "Unknown";
    return;
  }

  const voted = await state.contract.hasAddressVoted(state.account);
  ui.hasVoted.textContent = voted ? "Yes" : "No";
}

async function vote(candidateIndex) {
  try {
    await ensureConnected();
    if (!state.contract) {
      throw new Error("Load a contract first.");
    }

    setStatus(`Submitting vote for candidate #${candidateIndex}...`);
    const tx = await state.contract.vote(candidateIndex);
    setStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
    await tx.wait();
    setStatus("Vote confirmed.");
    await renderCandidates();
    await updateHasVoted();
  } catch (error) {
    setStatus(error.reason || error.message, true);
  }
}

async function renderCandidates() {
  if (!state.contract) {
    resetCandidates();
    return;
  }

  const count = Number(await state.contract.getCandidatesCount());
  resetCandidates();

  for (let i = 0; i < count; i += 1) {
    const [name, voteCount] = await state.contract.getCandidate(i);
    const card = document.createElement("div");
    card.className = "candidate";

    const nameEl = document.createElement("strong");
    nameEl.textContent = `#${i} ${name}`;

    const votesEl = document.createElement("p");
    votesEl.textContent = `Votes: ${voteCount.toString()}`;

    const voteBtn = document.createElement("button");
    voteBtn.textContent = `Vote for ${name}`;
    voteBtn.addEventListener("click", async () => {
      await vote(i);
    });

    card.appendChild(nameEl);
    card.appendChild(votesEl);
    card.appendChild(voteBtn);
    ui.candidates.appendChild(card);
  }
}

async function loadContract() {
  try {
    await ensureConnected();
    const address = getAddressFromInput();
    localStorage.setItem(STORAGE_KEY, address);

    state.contract = new ethers.Contract(address, VOTING_ABI, state.signer);
    await renderCandidates();
    await updateHasVoted();
    setStatus("Contract loaded.");
  } catch (error) {
    setStatus(error.reason || error.message, true);
  }
}

function bindEvents() {
  ui.connectBtn.addEventListener("click", connectWallet);
  ui.switchAmoyBtn.addEventListener("click", switchToAmoy);
  ui.loadContractBtn.addEventListener("click", loadContract);
  ui.refreshBtn.addEventListener("click", async () => {
    try {
      await updateNetworkLabel();
      await renderCandidates();
      await updateHasVoted();
      setStatus("Refreshed.");
    } catch (error) {
      setStatus(error.reason || error.message, true);
    }
  });

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async () => {
      state.signer = null;
      state.account = null;
      state.contract = null;
      ui.account.textContent = "Not connected";
      ui.hasVoted.textContent = "Unknown";
      resetCandidates();
      setStatus("Account changed. Reconnect wallet.");
    });

    window.ethereum.on("chainChanged", async () => {
      await updateNetworkLabel();
      setStatus("Network changed.");
    });
  }
}

function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    ui.contractAddress.value = saved;
  }
  bindEvents();
}

init();

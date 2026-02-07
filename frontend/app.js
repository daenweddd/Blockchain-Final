// Sepolia network config and contract addresses
const SEPOLIA = {
  name: "Sepolia",
  chainIdDec: 11155111,
  chainIdHex: "0xaa36a7",
  rpcUrls: ["https://rpc.sepolia.org"],
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
  contracts: {
    crowdfunding: "0x3006A2ff8572030013D2f304476Fce6f5f460fB2",
    token: "0x45f4B2520d8B5b9fa4D6ff6aBeDa8df72C6409af",
  },
};
// Addresses (localhost) — ok
const CROWDFUNDING_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // CharityCrowdfunding
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";        // RewardToken


// Minimal ABI with only needed functions
const CROWDFUNDING_ABI = [
  "function campaignCount() view returns (uint256)",
  "function getCampaign(uint256 id) view returns (string,uint256,uint256,address,address,uint256,bool,bool)",
  "function getStatus(uint256 id) view returns (bool,bool,bool,bool)",
  "function createCampaign(string,uint256,uint256,address) returns (uint256)",
  "function contribute(uint256) payable",
  "function contributions(uint256,address) view returns (uint256)",
  "function finalizeCampaign(uint256)",
  "function refund(uint256)",
];

const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// App state (wallet + contracts)
let provider, signer, account;
let crowdfunding, token;

// Log element for messages
const logEl = document.getElementById("log");
const log = (m) => (logEl.textContent += m + "\n");

// Simple error formatter
const prettyError = (e) => {
  return (
    e?.shortMessage ||
    e?.reason ||
    e?.errorName ||
    e?.data?.message ||
    e?.message ||
    String(e)
  );
};

// Create Etherscan tx link
function explorerTx(hash) {
  return `${SEPOLIA.blockExplorerUrls[0]}/tx/${hash}`;
}

// Show network warning text
function setWarn(text) {
  const el = document.getElementById("netWarn");
  if (el) el.textContent = text || "";
}

// Enable or disable UI buttons
function setUiEnabled(enabled) {
  const ids = [
    "createBtn",
    "donateBtn",
    "refreshBtn",
    "loadBtn",
    "myContribBtn",
    "finalizeBtn",
    "refundBtn",
  ];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) el.disabled = !enabled;
  }
}

// Switch wallet to Sepolia network
async function switchToSepolia() {
  if (!window.ethereum) throw new Error("MetaMask not found");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA.chainIdHex }],
    });
  } catch (e) {
    // Add network if not exists
    if (e?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: SEPOLIA.chainIdHex,
          chainName: SEPOLIA.name,
          rpcUrls: SEPOLIA.rpcUrls,
          nativeCurrency: SEPOLIA.nativeCurrency,
          blockExplorerUrls: SEPOLIA.blockExplorerUrls,
        }],
      });
    } else {
      throw e;
    }
  }
}

// Check wallet and contracts are ready
function requireConnected() {
  if (!provider || !signer || !account || !crowdfunding || !token) {
    throw new Error("Not connected. Click Connect MetaMask.");
  }
}

// Connect wallet and initialize contracts
async function connect() {
  try {
    if (!window.ethereum) return alert("MetaMask not found");

    setUiEnabled(false);

    // Check addresses are set
    if (!SEPOLIA.contracts.crowdfunding || SEPOLIA.contracts.crowdfunding.startsWith("PASTE_")) {
      log("Paste Sepolia contract addresses in app.js");
      return;
    }

    await switchToSepolia();

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();

    document.getElementById("account").textContent = account;

    const net = await provider.getNetwork();
    const chainIdNow = Number(net.chainId);
    document.getElementById("chain").textContent = String(chainIdNow);

    if (chainIdNow !== SEPOLIA.chainIdDec) {
      setWarn("Wrong network. Switch to Sepolia.");
      return;
    }
    setWarn("");

    // Create contract objects
    crowdfunding = new ethers.Contract(SEPOLIA.contracts.crowdfunding, CROWDFUNDING_ABI, signer);
    token = new ethers.Contract(SEPOLIA.contracts.token, TOKEN_ABI, signer);

    log("Connected to Sepolia");
    setUiEnabled(true);

    await refreshBalances();
  } catch (e) {
    log(prettyError(e));
  }
}

// Reconnect on account or network change
if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => connect());
  window.ethereum.on("chainChanged", () => connect());
}

// Create new campaign
async function createCampaign() {
  try {
    requireConnected();

    const title = document.getElementById("titleEl").value.trim();
    const goalEth = document.getElementById("goalEl").value.trim();
    const duration = Number(document.getElementById("durationEl").value);

    let beneficiary = document.getElementById("beneficiaryEl").value.trim();
    if (!beneficiary) beneficiary = account;

    const tx = await crowdfunding.createCampaign(
      title,
      ethers.parseEther(goalEth),
      duration,
      beneficiary
    );

    log("Create tx: " + explorerTx(tx.hash));
    await tx.wait();
    log("Campaign created");

    await refreshBalances();
    await loadCampaigns();
  } catch (e) {
    log(prettyError(e));
  }
}

// Donate ETH to campaign
async function donate() {
  try {
    requireConnected();

    const id = Number(document.getElementById("cidEl").value);
    const amountEth = document.getElementById("amountEl").value.trim();

    const tx = await crowdfunding.contribute(id, { value: ethers.parseEther(amountEth) });

    log("Donate tx: " + explorerTx(tx.hash));
    await tx.wait();
    log("Donation sent");

    await refreshBalances();
    await loadCampaigns();
    await showMyContribution();
  } catch (e) {
    log(prettyError(e));
  }
}

// Update ETH and token balances
async function refreshBalances() {
  try {
    requireConnected();

    const eth = await provider.getBalance(account);
    document.getElementById("ethBal").textContent = ethers.formatEther(eth);

    const dec = await token.decimals();
    const sym = await token.symbol();
    const t = await token.balanceOf(account);
    document.getElementById("tokBal").textContent = `${ethers.formatUnits(t, dec)} ${sym}`;
  } catch (e) {
    log(prettyError(e));
  }
}

// Load all campaigns from blockchain
async function loadCampaigns() {
  try {
    requireConnected();

    const list = document.getElementById("campaignList");
    list.innerHTML = "";

    const count = Number(await crowdfunding.campaignCount());
    log("Campaign count: " + count);

    for (let id = 0; id < count; id++) {
      const c = await crowdfunding.getCampaign(id);
      const s = await crowdfunding.getStatus(id);

      const box = document.createElement("div");
      box.style.border = "1px solid #ccc";
      box.style.padding = "8px";
      box.style.margin = "6px 0";
      box.style.borderRadius = "10px";

      box.innerHTML = `
        <b>#${id}</b> ${c[0]}<br/>
        goal: ${ethers.formatEther(c[1])} ETH | raised: ${ethers.formatEther(c[5])} ETH<br/>
        status: active=${s[0]} finalized=${s[2]} successful=${s[3]}
      `;

      list.appendChild(box);
    }
  } catch (e) {
    log(prettyError(e));
  }
}

// Show user contribution
async function showMyContribution() {
  try {
    requireConnected();

    const id = Number(document.getElementById("myCidEl").value);
    const wei = await crowdfunding.contributions(id, account);
    document.getElementById("myContrib").textContent = ethers.formatEther(wei);
  } catch (e) {
    log(prettyError(e));
  }
}

// Finalize campaign after deadline
async function finalize() {
  try {
    requireConnected();

    const id = Number(document.getElementById("finIdEl").value);
    const tx = await crowdfunding.finalizeCampaign(id);

    log("Finalize tx: " + explorerTx(tx.hash));
    await tx.wait();
    log("Campaign finalized");

    await refreshBalances();
    await loadCampaigns();
  } catch (e) {
    log(prettyError(e));
  }
}

// Refund if campaign failed
async function refund() {
  try {
    requireConnected();

    const id = Number(document.getElementById("finIdEl").value);
    const tx = await crowdfunding.refund(id);

    log("Refund tx: " + explorerTx(tx.hash));
    await tx.wait();
    log("Refund complete");

    await refreshBalances();
    await loadCampaigns();
    await showMyContribution();
  } catch (e) {
    log(prettyError(e));
  }
}

// Button bindings
document.getElementById("connectBtn").onclick = connect;
document.getElementById("createBtn").onclick = createCampaign;
document.getElementById("donateBtn").onclick = donate;
document.getElementById("refreshBtn").onclick = refreshBalances;
document.getElementById("loadBtn").onclick = loadCampaigns;
document.getElementById("myContribBtn").onclick = showMyContribution;
document.getElementById("finalizeBtn").onclick = finalize;
document.getElementById("refundBtn").onclick = refund;

// Initial UI state
setUiEnabled(false);
log("Ready. Click Connect MetaMask.");

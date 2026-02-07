// Addresses (localhost) — ok
const CROWDFUNDING_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // CharityCrowdfunding
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";        // RewardToken

const CROWDFUNDING_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rewardTokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AlreadyFinalized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "CampaignEnded",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "CampaignNotFound",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidBeneficiary",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidDuration",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidGoal",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotRefundable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NothingToRefund",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TooEarly",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TransferFailed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ZeroContribution",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "goal",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "CampaignCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountWei",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardMinted",
          "type": "uint256"
        }
      ],
      "name": "Contributed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "successful",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalRaised",
          "type": "uint256"
        }
      ],
      "name": "Finalized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountWei",
          "type": "uint256"
        }
      ],
      "name": "Refunded",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "REWARD_RATE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "campaignCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "campaigns",
      "outputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "goal",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalRaised",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "finalized",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "successful",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "contribute",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "contributions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "goalWei",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "durationSeconds",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "createCampaign",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "finalizeCampaign",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "ended",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "finalized",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "successful",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "refund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardToken",
      "outputs": [
        {
          "internalType": "contract RewardToken",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
const TOKEN_ABI =[
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotMinter",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ZeroAddress",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minter",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_minter",
          "type": "address"
        }
      ],
      "name": "setMinter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

let provider, signer, account;
let crowdfunding, token;

const log = (m) => (document.getElementById("log").textContent += m + "\n");

function prettyError(e) {
 
  return e?.shortMessage || e?.reason || e?.message || String(e);
}

function requireConnected() {
  if (!provider || !signer || !account || !crowdfunding || !token) {
    throw new Error("Not connected. Click Connect MetaMask first.");
  }
}

async function connect() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();

    const network = await provider.getNetwork();

    document.getElementById("account").textContent = account;
    document.getElementById("chain").textContent = network.chainId.toString();

    // network warning
    const warn = document.getElementById("netWarn");
    warn.textContent = "";
    if (network.chainId !== 31337n) {
      warn.textContent = "Switch to Hardhat Local (chainId 31337). RPC: http://127.0.0.1:8545";
    }

    crowdfunding = new ethers.Contract(CROWDFUNDING_ADDRESS, CROWDFUNDING_ABI, signer);
    token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

    log(" Connected");
  } catch (e) {
    log( prettyError(e));
  }
}

async function createCampaign() {
  try {
    requireConnected();

    const title = document.getElementById("title").value.trim();
    const goalEth = document.getElementById("goal").value.trim(); // "0.1"
    const duration = Number(document.getElementById("duration").value);

    let beneficiary = document.getElementById("beneficiary").value.trim();
    if (!beneficiary) beneficiary = account;

    const tx = await crowdfunding.createCampaign(
      title,
      ethers.parseEther(goalEth),
      duration,
      beneficiary
    );

    log("Create tx: " + tx.hash);
    await tx.wait();
    log( "Campaign created");
  } catch (e) {
    log(prettyError(e));
  }
}

async function donate() {
  try {
    requireConnected();

    const id = Number(document.getElementById("cid").value);
    const amountEth = document.getElementById("amount").value.trim(); // "0.01"

    const tx = await crowdfunding.contribute(id, {
      value: ethers.parseEther(amountEth),
    });

    log("Donate tx: " + tx.hash);
    await tx.wait();
    log(" Donated");
  } catch (e) {
    log(prettyError(e)); 
  }
}

async function refreshBalances() {
  try {
    requireConnected();

    const eth = await provider.getBalance(account);
    document.getElementById("ethBal").textContent = ethers.formatEther(eth);

    const t = await token.balanceOf(account);
    document.getElementById("tokBal").textContent = ethers.formatUnits(t, 18);
  } catch (e) {
    log(prettyError(e));
  }
}

async function loadCampaigns() {
  try {
    requireConnected();

    const list = document.getElementById("campaignList");
    list.innerHTML = "";

    const count = Number(await crowdfunding.campaignCount());
    log("Campaign count: " + count);

    for (let id = 0; id < count; id++) {
      const c = await crowdfunding.campaigns(id);
      const status = await crowdfunding.getStatus(id);

      const title = c[0];
      const goalEth = ethers.formatEther(c[1]);
      const deadline = Number(c[2]);
      const creator = c[3];
      const beneficiary = c[4];
      const totalRaisedEth = ethers.formatEther(c[5]);

      const active = status[0];
      const ended = status[1];
      const finalized = status[2];
      const successful = status[3];

      const row = document.createElement("div");
      row.style.border = "1px solid #ccc";
      row.style.padding = "8px";
      row.style.margin = "6px 0";

      row.innerHTML = `
        <b>#${id}</b> ${title}<br/>
        goal: ${goalEth} ETH | raised: ${totalRaisedEth} ETH<br/>
        deadline (unix): ${deadline}<br/>
        creator: ${creator}<br/>
        beneficiary: ${beneficiary}<br/>
        status: active=${active} ended=${ended} finalized=${finalized} successful=${successful}
      `;

      list.appendChild(row);
    }
  } catch (e) {
    log(prettyError(e));
  }
}

async function showMyContribution() {
  try {
    requireConnected();

    const id = Number(document.getElementById("myCid").value);
    const wei = await crowdfunding.contributions(id, account);
    document.getElementById("myContrib").textContent = ethers.formatEther(wei);
  } catch (e) {
    log(prettyError(e));
  }
}

async function finalize() {
  try {
    requireConnected();

    const id = Number(document.getElementById("finId").value);
    const tx = await crowdfunding.finalizeCampaign(id);

    log("Finalize tx: " + tx.hash);
    await tx.wait();
    log("Finalized");
  } catch (e) {
    log(prettyError(e)); // TooEarly / AlreadyFinalized / CampaignNotFound
  }
}

async function refund() {
  try {
    requireConnected();

    const id = Number(document.getElementById("finId").value);
    const tx = await crowdfunding.refund(id);

    log("Refund tx: " + tx.hash);
    await tx.wait();
    log("Refunded");
  } catch (e) {
    log(prettyError(e)); // NothingToRefund / NotRefundable / TooEarly
  }
}


document.getElementById("connect").onclick = connect;
document.getElementById("create").onclick = createCampaign;
document.getElementById("donate").onclick = donate;
document.getElementById("refresh").onclick = refreshBalances;
document.getElementById("load").onclick = loadCampaigns;
document.getElementById("myContribBtn").onclick = showMyContribution;
document.getElementById("finalize").onclick = finalize;
document.getElementById("refund").onclick = refund;

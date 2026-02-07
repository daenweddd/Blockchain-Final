# Charity DApp — Final Examination Project (Blockchain 1)

**Course:** Blockchain 1  
**Project type:** DApp (Solidity + JavaScript + MetaMask)  
**Network:** Ethereum Testnet (Sepolia) 
**Stack:** Solidity, Hardhat, Ethers.js, MetaMask, HTML/CSS

This project is an educational decentralized crowdfunding application that runs **on Ethereum test network** and uses **free test ETH**. It also issues an internal **ERC-20 reward token** for contributions.

## 1) Project Overview

The DApp allows users to:
- create crowdfunding campaigns (title, goal, duration, beneficiary)
- contribute test ETH to active campaigns
- automatically receive ERC-20 reward tokens proportional to contribution
- finalize campaigns after deadline
- refund contributors if the campaign failed (after finalize)


## 2) Architecture

**Smart Contracts (Solidity):**
- `RewardToken.sol` — ERC-20 token, minting allowed only for one `minter` (crowdfunding contract)
- `CharityCrowdfunding.sol` — campaign logic (create, contribute, finalize, refund), contribution tracking, and token mint on donation

**Frontend (HTML/CSS/JS):**
- `index.html` — UI (forms + buttons + campaign list + logs)
- `app.js` — MetaMask connection, Sepolia network check/switch, contract calls via Ethers.js, UI updates
- `styles.css` — simple UI styling

**Deployment (Hardhat):**
- `scripts/deploy.js` — deploy token + crowdfunding contract, then set token minter to crowdfunding contract

---

## 3) Smart Contract Logic (short)

### CharityCrowdfunding.sol
- `createCampaign(title, goalWei, durationSeconds, beneficiary)`  
  Creates a new campaign with validation:
  - title cannot be empty
  - goal > 0
  - duration between `MIN_DURATION` and `MAX_DURATION`
  - beneficiary cannot be zero address

- `contribute(id)` (payable)  
  Accepts ETH if campaign is active, updates:
  - `contributions[id][user]`
  - `campaign.totalRaised`
  Then mints reward tokens:
  - `rewardAmount = msg.value * REWARD_RATE`

- `finalizeCampaign(id)`  
  Works only after deadline and only once.
  - If `totalRaised >= goal` → success → sends ETH to beneficiary
  - Else → failed → funds remain for refunds

- `refund(id)`  
  Allowed only if:
  - campaign is finalized
  - campaign failed
  - user contributed > 0  
  Then sends ETH back and sets user contribution to 0.

- `getStatus(id)` and `getCampaign(id)`  
  Read helpers for frontend (one-call getters).

### RewardToken.sol
- ERC-20 token (OpenZeppelin)
- `owner` can call `setMinter(address)`
- only `minter` can call `mint(to, amount)`

---

## 4) Functional Requirements Checklist

 **Test network only (Sepolia)**  
 **MetaMask integration** (request accounts, chain validation, transactions)  
 **Campaign creation** (title, goal, duration/deadline, beneficiary)  
 **Contributions with test ETH**  
 **Contribution tracking per user** (`contributions`)  
 **Finalize after deadline**  
 **Refund if failed** (after finalize + contributed)  
 **ERC-20 reward token** minted automatically  
 **Frontend shows:** wallet address, chainId, balances (ETH + token), transaction logs, campaigns list

---

## 5) How to Run Locally

### Prerequisites
- Node.js 18+
- MetaMask extension
- Some test ETH on Sepolia
- Live server extension on VS code



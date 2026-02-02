const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // --- 1. Deploy RewardToken ---
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy("SupportBadge", "SBT");
  await rewardToken.waitForDeployment();

  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("RewardToken deployed to:", rewardTokenAddress);

  // --- 2. Deploy CharityCrowdfunding ---
  const Crowdfunding = await hre.ethers.getContractFactory("CharityCrowdfunding");
  const crowdfunding = await Crowdfunding.deploy(rewardTokenAddress);
  await crowdfunding.waitForDeployment();

  const crowdfundingAddress = await crowdfunding.getAddress();
  console.log("Crowdfunding deployed to:", crowdfundingAddress);

  // --- 3. Set minter ---
  const tx = await rewardToken.setMinter(crowdfundingAddress);
  await tx.wait();

  console.log("Minter set to Crowdfunding contract");
  console.log("DEPLOY FINISHED ");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

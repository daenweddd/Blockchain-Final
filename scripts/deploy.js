const hre = require("hardhat");

async function main() {

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();

  // Get current network info
  const net = await hre.ethers.provider.getNetwork();

  console.log("Deploying with:", deployer.address);
  console.log("Network chainId:", net.chainId.toString());

  // Deploy RewardToken
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy("SupportBadge", "RWD");
  await rewardToken.waitForDeployment();

  const tokenAddress = await rewardToken.getAddress();
  console.log("RewardToken:", tokenAddress);

  // Deploy CharityCrowdfunding
  const Crowdfunding = await hre.ethers.getContractFactory("CharityCrowdfunding");
  const crowdfunding = await Crowdfunding.deploy(tokenAddress);
  await crowdfunding.waitForDeployment();

  const crowdfundingAddress = await crowdfunding.getAddress();
  console.log("CharityCrowdfunding:", crowdfundingAddress);

  // Set minter role 
  const tx = await rewardToken.setMinter(crowdfundingAddress);
  await tx.wait();
  console.log("Minter set");

  // Output addresses for frontend
  console.log("\n== COPY TO FRONTEND CONFIG ==");
  console.log("CROWDFUNDING_ADDRESS =", crowdfundingAddress);
  console.log("TOKEN_ADDRESS        =", tokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

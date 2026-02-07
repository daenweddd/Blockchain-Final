const hre = require("hardhat");

async function main() {

  // Get the first account from Hardhat
  const [deployer] = await hre.ethers.getSigners();

  const net = await hre.ethers.provider.getNetwork();

  console.log("Deploying with:", deployer.address);
  console.log("Network chainId:", net.chainId.toString());

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");

  const rewardToken = await RewardToken.deploy("SupportBadge", "RWD");

  // Wait until deployment is finished
  await rewardToken.waitForDeployment();

  // Get deployed token address
  const tokenAddress = await rewardToken.getAddress();
  console.log("RewardToken:", tokenAddress);

  const Crowdfunding = await hre.ethers.getContractFactory("CharityCrowdfunding");

  // Deploy crowdfunding contract
  const crowdfunding = await Crowdfunding.deploy(tokenAddress);

  await crowdfunding.waitForDeployment();

  // Get deployed crowdfunding address
  const crowdfundingAddress = await crowdfunding.getAddress();
  console.log("CharityCrowdfunding:", crowdfundingAddress);

  // Allow crowdfunding contract to mint reward tokens
  const tx = await rewardToken.setMinter(crowdfundingAddress);
  await tx.wait();


  console.log("CROWDFUNDING_ADDRESS =", crowdfundingAddress);
  console.log("TOKEN_ADDRESS        =", tokenAddress);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

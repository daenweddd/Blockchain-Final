const hre = require("hardhat");

async function main() {

  // Get the first account from Hardhat
  const [deployer] = await hre.ethers.getSigners();
  const net = await hre.ethers.provider.getNetwork();

<<<<<<< HEAD
=======
  const net = await hre.ethers.provider.getNetwork();

>>>>>>> 1c41e9b02403120c588aac21043187c313de4892
  console.log("Deploying with:", deployer.address);
  console.log("Network chainId:", net.chainId.toString());

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
<<<<<<< HEAD
  const rewardToken = await RewardToken.deploy("SupportBadge", "RWD");
=======

  const rewardToken = await RewardToken.deploy("SupportBadge", "RWD");

  // Wait until deployment is finished
>>>>>>> 1c41e9b02403120c588aac21043187c313de4892
  await rewardToken.waitForDeployment();
  const tokenAddress = await rewardToken.getAddress();
  console.log("RewardToken:", tokenAddress);

<<<<<<< HEAD
  const Crowdfunding = await hre.ethers.getContractFactory("CharityCrowdfunding");
  const crowdfunding = await Crowdfunding.deploy(tokenAddress);
  await crowdfunding.waitForDeployment();
  const crowdfundingAddress = await crowdfunding.getAddress();
  console.log("CharityCrowdfunding:", crowdfundingAddress);

=======
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
>>>>>>> 1c41e9b02403120c588aac21043187c313de4892
  const tx = await rewardToken.setMinter(crowdfundingAddress);
  await tx.wait();
  console.log("Minter set ✅");

<<<<<<< HEAD
  console.log("\n== COPY TO FRONTEND CONFIG ==");
=======

>>>>>>> 1c41e9b02403120c588aac21043187c313de4892
  console.log("CROWDFUNDING_ADDRESS =", crowdfundingAddress);
  console.log("TOKEN_ADDRESS        =", tokenAddress);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

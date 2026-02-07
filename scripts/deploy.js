const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const net = await hre.ethers.provider.getNetwork();

  console.log("Deploying with:", deployer.address);
  console.log("Network chainId:", net.chainId.toString());

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy("SupportBadge", "RWD");
  await rewardToken.waitForDeployment();
  const tokenAddress = await rewardToken.getAddress();
  console.log("RewardToken:", tokenAddress);

  const Crowdfunding = await hre.ethers.getContractFactory("CharityCrowdfunding");
  const crowdfunding = await Crowdfunding.deploy(tokenAddress);
  await crowdfunding.waitForDeployment();
  const crowdfundingAddress = await crowdfunding.getAddress();
  console.log("CharityCrowdfunding:", crowdfundingAddress);

  const tx = await rewardToken.setMinter(crowdfundingAddress);
  await tx.wait();
  console.log("Minter set ✅");

  console.log("\n== COPY TO FRONTEND CONFIG ==");
  console.log("CROWDFUNDING_ADDRESS =", crowdfundingAddress);
  console.log("TOKEN_ADDRESS        =", tokenAddress);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

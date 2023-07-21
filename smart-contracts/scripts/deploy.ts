import { ethers } from "hardhat";

async function main() {
  const promise = await ethers.deployContract("PromiseToFriends");
  await promise.waitForDeployment();
  console.log(`PromiseToFriends contract deployed to ${promise.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

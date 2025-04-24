const { ethers } = require("hardhat");

async function main() {
  // 1. Deploy ERC721 token
  const Token = await ethers.getContractFactory("RealEstateToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("RealEstateToken at:", await token.getAddress());

  // 2. Deploy Marketplace
  const Market = await ethers.getContractFactory("Marketplace");
  const market = await Market.deploy(await token.getAddress());
  await market.waitForDeployment();
  console.log("Marketplace at:   ", await market.getAddress());

  // Grant marketplace the MINTER role if needed, or keep admin separate
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const hre = require("hardhat");

const deployment = async (hre) => {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;
  const chainId = await getChainId();

  console.log(`Chain ID: ${chainId}`);

  const { deployer } = await getNamedAccounts();

  const NFT = await deploy("StallionNFT", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("NFT:", NFT.address);
};

module.exports = deployment;

deployment.tags = ["nft"];

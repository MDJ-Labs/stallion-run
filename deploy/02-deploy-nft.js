const hre = require("hardhat");

const deployment = async (hre) => {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;
  const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
  } = require("../helper-hardhat-config");
  const { verify } = require("../utils/verify");
  const chainId = await getChainId();

  console.log(`Chain ID: ${chainId}`);

  const { deployer } = await getNamedAccounts();
  const {log} = await deployments;

  const arguments = [];

  const NFT = await deploy("StallionNFT", {
    from: deployer,
    args: arguments,
    log: true,
  });

  console.log("NFT:", NFT.address);

  // Verify the deployment
if (
  !developmentChains.includes(network.name) &&
  process.env.ETHERSCAN_API_KEY
) {
  log("Verifying...");
  await verify(NFT.address, arguments);
}
};

module.exports = deployment;

deployment.tags = ["nft"];

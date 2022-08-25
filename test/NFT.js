const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { Contract, BigNumber } = require("ethers");

describe("NFT", function () {
  let NFT;

  describe("NFT contract", function () {
    it("should deploy NFT and have right owner", async () => {
      const [owner] = await ethers.getSigners();

      const NFTContract = await ethers.getContractFactory("StallionNFT");
      NFT = await NFTContract.deploy();

      let contractOwner = await NFT.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("should have the right name and symbol", async () => {
      const name = await NFT.name();
      const symbol = await NFT.symbol();
      expect(name).to.equal("StallionRun");
      expect(symbol).to.equal("SRN");
    });

    describe("mint", function () {
      it("should mint a single nft", async () => {
        const [owner, addr1] = await ethers.getSigners();

        const tx = await NFT.connect(addr1).mint(0, {
          value: ethers.utils.parseEther("0.0001"),
        });

        const receipt = await tx.wait();
        expect(receipt.status).to.equal(1);

        expect(await NFT.balanceOf(addr1.address)).to.equal(1);
      });
    });

    describe("tokenURI", function () {
      it("Should return the correct tokenURI", async function () {
        const tokenURI = await NFT.tokenURI(1);
        expect(tokenURI).to.equal(
          "https://ipfs.io/ipfs/bafybeieic5yzvavzl4udjzcg4tnun3bqwp4ec2lgd6dayfobm5otez3nmu/metadata/1"
        );
      });
    });

    describe("withdraw", function () {
      it("it should send funds to the owner", async () => {
        const provider = ethers.provider;
        const [owner] = await ethers.getSigners();

        expect(await NFT.withdraw()).to.changeEtherBalance(
          owner.address,
          ethers.utils.parseEther("0.0001")
        );

        const contractBalanceAfter = await provider.getBalance(NFT.address);

        expect(contractBalanceAfter).to.equal(0);
      });
    });
  });
});

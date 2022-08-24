const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Contract, BigNumber } = require("ethers");

describe("NFT", function () {
  let NFT;

  describe("NFT contract", function () {
    it("should deploy NFT", async () => {
      const [owner] = await ethers.getSigners();

      const NFT = await ethers.getContractFactory("StallionNFT");
      NFT = await NFT.deploy(owner.address);
    });

    it("should have the right name and symbol", async () => {
      const name = await NFT.name();
      const symbol = await NFT.symbol();
      expect(name).to.equal("StallionRun");
      expect(symbol).to.equal("SRN");
    });

    it("it should have right owner", async () => {
      const [owner] = await ethers.getSigners();

      const contractOwner = await NFT.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    describe("mint", function () {
      it("should mint a single nft", async () => {
        const [owner, addr1] = await ethers.getSigners();

        const tx = await NFT.connect(addr1)["mint()"]({
          value: ethers.utils.parseEther("0.01"),
        });

        const receipt = await tx.wait();
        expect(receipt.status).to.equal(1);

        expect(await NFT.balanceOf(addr1.address)).to.equal(1);
      });
    });

    describe("tokenURI", function () {
      it("Should return the correct tokenURI", async function () {
        const token = await NFT.tokenURI(1);
        expect(token).to.equal(
          "https://bafybeieic5yzvavzl4udjzcg4tnun3bqwp4ec2lgd6dayfobm5otez3nmu.ipfs.dweb.link/metadata/1"
        );
      });
    });

    describe("withdraw", function () {
      it("it should send funds to the owner", async () => {
        const provider = ethers.provider;
        const [owner] = await ethers.getSigners();

        const ownerBalanceBefore = await owner.getBalance();
        const contractBalanceBefore = await provider.getBalance(NFT.address);

        const totalSupply = await NFT.totalSupply();
        const withdrawTx = await NFT.withdraw();
        const receipt = await withdrawTx.wait();
        expect(receipt.status).to.equal(1);

        const contractBalanceAfter = await provider.getBalance(NFT.address);

        const ownerBalanceAfter = await owner.getBalance();

        expect(contractBalanceAfter).to.equal(0);
        expect(ownerBalanceAfter).to.greaterThan(ownerBalanceBefore);
      });
    });
  });
});

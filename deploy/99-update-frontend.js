const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { ethers, network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const stallionRun = await ethers.getContract("StallionRun")
    fs.writeFileSync(frontEndAbiFile, stallionRun.interface.format(ethers.utils.FormatTypes.json)) //ethers has a contract.interface
}

async function updateContractAddresses() {
    const stallionRun = await ethers.getContract("StallionRun")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(stallionRun.address)) {
            contractAddresses[network.config.chainId.toString()].push(stallionRun.address)
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [stallionRun.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
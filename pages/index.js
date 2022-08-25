import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";

const contractAddress = "0xeb3ac2678Add1461e126235D257AC6caB2a00335";

const abi = [
  {
    inputs: [
      { internalType: "enum StallionNFT.Level", name: "_level", type: "uint8" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "bulletSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hopeSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "flashSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export default function Home() {
  const [install, setInstall] = useState(false);
  const [network, setNetwork] = useState(false);
  const [account, setAccount] = useState(null);
  const [mintedBullets, setMintedBullets] = useState(0);
  const [mintedHopes, setMintedHopes] = useState(0);
  const [mintedFlashes, setMintedFlashes] = useState(0);

  useEffect(() => {
    const getNetwork = async () => {
      const networkVersion = await window.ethereum.networkVersion;
      setNetwork(networkVersion == 5);
      window.ethereum.on("chainChanged", (networkVersion) => {
        networkVersion = parseInt(networkVersion).toString();
        setNetwork(networkVersion == 5);
        console.log("Chain Changed", networkVersion);
      });
    };
    setInstall(!window.ethereum);
    getNetwork();
    window.ethereum.on("accountsChanged", () => {
      setAccount(window.ethereum.selectedAddress);
    });
    nftsMinted();
  }, []);

  const mintBullet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      await contract.mint(0, {
        value: ethers.utils.parseEther("0.001"),
      });
      nftsMinted();
    } catch (error) {
      console.error(error);
    }
  };

  const mintHope = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      await contract.mint(1, {
        value: ethers.utils.parseEther("0.002"),
      });
      nftsMinted();
    } catch (error) {
      console.error(error);
    }
  };

  const mintFlash = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      await contract.mint(2, {
        value: ethers.utils.parseEther("0.003"),
      });
      nftsMinted();
    } catch (error) {
      console.error(error);
    }
  };

  const nftsMinted = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    let bulletSupplyBI = await contract.bulletSupply();
    let hopeSupplyBI = await contract.hopeSupply();
    let flashSupplyBI = await contract.flashSupply();
    let bulletSupply = parseInt(bulletSupplyBI);
    let hopeSupply = parseInt(hopeSupplyBI);
    let flashSupply = parseInt(flashSupplyBI);
    setMintedBullets(bulletSupply);
    setMintedHopes(hopeSupply);
    setMintedFlashes(flashSupply);
  };

  if (install) return <h2>Install Metamask!</h2>;

  if (!account)
    return (
      <>
        <h2>Connect Wallet!</h2>
        <button
          onClick={() =>
            window.ethereum.request({ method: "eth_requestAccounts" })
          }
        >
          Connect
        </button>
      </>
    );

  if (!network) return <h2>Wrong Network!</h2>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Stallion Run Mint Page</title>
        <meta name="description" content="Stallion Run Mint Page" />
      </Head>

      <div>
        <h1>Mint your NFT Horse!</h1>
        <h2>Total Bullets Minted: {mintedBullets}</h2>
        <h2>Total Hopes Minted: {mintedHopes}</h2>
        <h2>Total Flashes Minted: {mintedFlashes}</h2>
        <button onClick={() => mintBullet()}>Mint Bullet</button>
        <button onClick={() => mintHope()}>Mint Hope</button>
        <button onClick={() => mintFlash()}>Mint Flash</button>
        <button onClick={() => nftsMinted()}>Update supply</button>
      </div>
    </div>
  );
}

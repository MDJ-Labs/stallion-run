import styles from "../styles/Mint.module.css";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";

const Mint = () => {
  const [mintedBullets, setMintedBullets] = useState(0);
  const [mintedHopes, setMintedHopes] = useState(0);
  const [mintedFlashes, setMintedFlashes] = useState(0);
  const [horse, setHorse] = useState();

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const stallionRunAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  useEffect(() => {
    if (isWeb3Enabled && stallionRunAddress) {
      nftsMinted();
      getHorse();
    }
  }, [isWeb3Enabled, mintedBullets, mintedHopes, mintedFlashes, horse]);

  const mintBullet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stallionRunAddress, abi, signer);
      await contract.mint(0, {
        value: ethers.utils.parseEther("0.001"),
      });
      nftsMinted();
      getHorse();
    } catch (error) {
      console.error(error);
    }
  };

  const mintHope = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stallionRunAddress, abi, signer);
      await contract.mint(1, {
        value: ethers.utils.parseEther("0.002"),
      });
      nftsMinted();
      getHorse();
    } catch (error) {
      console.error(error);
    }
  };

  const mintFlash = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stallionRunAddress, abi, signer);
      await contract.mint(2, {
        value: ethers.utils.parseEther("0.003"),
      });
      nftsMinted();
      getHorse();
    } catch (error) {
      console.error(error);
    }
  };

  const nftsMinted = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(stallionRunAddress, abi, provider);
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

  const getHorse = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(stallionRunAddress, abi, provider);
    const horse = await contract.ownedHorseName(
      window.ethereum.selectedAddress
    );
    setHorse(horse);
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl bg-white px-4 mt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-black sm:text-5xl sm:leading-tight sm:tracking-tight">
          Mint your NFT Horse
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-500">
          To enter the race you have to mint a horse!
        </p>
      </div>
      {horse != "none" ? (
        <p className="text-center text-2xl font-bold text-black mt-10">
          Your Horse: {horse}
        </p>
      ) : null}
      {stallionRunAddress ? (
        <div className="mx-auto max-w-7xl grid grid-cols-3 gap-8 pb-24 py-12 px-4 sm:px-6 lg:px-8">
          <div className={styles.card}>
            <p className={styles.cardMinted}>{mintedBullets}/3000</p>
            <h1 className={styles.cardTitle}>Bullet</h1>
            <p className={styles.cardDesc}>
              Bullet is a horse with average speed. Speed increment: 3.
            </p>
            <div className={styles.cardPriceCont}>
              <span>{0.001} ETH</span>
            </div>
            <div className="mt-5">
              <Image
                src="/images/Bullet.jpeg"
                alt="Bullet Image"
                width={280}
                height={230}
              ></Image>
            </div>
            <button className={styles.cardMint} onClick={() => mintBullet()}>
              Mint Bullet
            </button>
          </div>
          <div className={styles.card}>
            <p className={styles.cardMinted}>{mintedHopes}/3000</p>
            <h1 className={styles.cardTitle}>Hope</h1>
            <p className={styles.cardDesc}>
              Hope is a horse with fast speed. Speed increment: 6.
            </p>
            <div className={styles.cardPriceCont}>
              <span>{0.002} ETH</span>
            </div>
            <div className="mt-5">
              <Image
                src="/images/Hope.jpeg"
                alt="Hope Image"
                width={280}
                height={230}
              ></Image>
            </div>
            <button className={styles.cardMint} onClick={() => mintHope()}>
              Mint Hope
            </button>
          </div>
          <div className={styles.card}>
            <p className={styles.cardMinted}>{mintedFlashes}/3000</p>
            <h1 className={styles.cardTitle}>Flash</h1>
            <p className={styles.cardDesc}>
              Bullet is a horse with insane speed. Speed Increment: 9.
            </p>
            <div className={styles.cardPriceCont}>
              <span>{0.003} ETH</span>
            </div>
            <div className="mt-5">
              <Image
                src="/images/Flash.jpeg"
                alt="Flash Image"
                width={280}
                height={230}
              ></Image>
            </div>
            <button className={styles.cardMint} onClick={() => mintFlash()}>
              Mint Flash
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-red-200 font-semibold text-2xl absolute bottom-5 left-1/5 md:left-1/3">
          Please connect to a supported chain
        </div>
      )}
    </div>
  );
};

export default Mint;

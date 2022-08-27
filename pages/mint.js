import {useWeb3Contract} from 'react-moralis'
import styles from "../styles/Mint.module.css";

const Mint = () => {

    const {runContractFunction: mint} = useWeb3Contract({
        abi: //,
        contractAddress: //,
        functionName: //,
        params: {},
        msgValue: //,

    })

  return (
    <div className="container mx-auto">
      <div className="mx-auto max-w-7xl bg-white px-4 mt-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-black sm:text-5xl sm:leading-tight sm:tracking-tight">
          Mint your NFT Horse
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-500">
          To enter the race you have to mint a horse!
        </p>
      </div>
      <div className="mx-auto max-w-7xl grid grid-cols-3 gap-8 py-24 px-4 sm:px-6 lg:px-8">
        <div className={styles.card}>
          <p className={styles.cardMinted}>{mintedBullets}/3000</p>
          <h1 className={styles.cardTitle}>Bullet</h1>
          <p className={styles.cardDesc}>
            Bullet is a horse with average speed. Speed increment: 3.
          </p>
          <div className={styles.cardPriceCont}>
            <p className={styles.cardPrice}>
              <span>{0.001}</span>
              <span> ETH</span>
            </p>
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
            <p className={styles.cardPrice}>
              <span>{0.002}</span>
              <span> ETH</span>
            </p>
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
            <p className={styles.cardPrice}>
              <span>{0.003}</span>
              <span> ETH</span>
            </p>
          </div>
          <button className={styles.cardMint} onClick={() => mintFlash()}>
            Mint Flash
          </button>
        </div>
      </div>
    </div>
  )
}

export default Mint
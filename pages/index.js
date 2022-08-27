import Head from "next/head"
import Header from "../components/Header"
import { useMoralis } from "react-moralis"

const supportedChains = ["31337", "5"];

function Home() {

  const { isWeb3Enabled, chainId } = useMoralis();


  return (
    <div className="mx-10">
      <Head>
        <title>Stallion Run - Decentralized Horse Racing Game</title>
        <meta name="description" content="A Decentralized Horse Racing Game built on Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(parseInt(chainId).toString()) ? (
            <div className="flex flex-row">
            {/* <RaceComponent /> */}
            </div>
          ) : (
            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
          )}
        </div>
      ) : (
        <div>Please connect to a Wallet</div>
      )}
    </div>
  )
}

export default Home

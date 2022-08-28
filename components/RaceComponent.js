import {abi, contractAddresses} from '../constants'
import {useMoralis} from 'react-moralis'
import { useEffect, useState } from 'react'
import {ethers} from 'ethers'

const RaceComponent = () => {

    const [inProgress, setInProgress] = useState(0)
    const [players, setPlayers] = useState([])
    const [playersEntered, setPlayersEntered] = useState(0)
    const [winner, setWinner] = useState("")
    const [prevWinner, setPrevWinner] = useState("")

    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const stallionRunAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null 



    useEffect(() => {
        if(isWeb3Enabled && stallionRunAddress) {
        updatePlayersNumber()
        }
    }, [isWeb3Enabled, playersEntered])

    useEffect(() => {
        if(playersEntered > 0) {
            updatePlayer()
        }  
    }, [playersEntered])

    useEffect(() => {
        if(inProgress == 1) {
            executeRace()
        }
    }, [inProgress])

    const enterRace = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(stallionRunAddress, abi, signer);
            await contract.enterRace({value: ethers.utils.parseEther("0.001")})
            updatePlayersNumber()
        } catch(error) {
            console.log(error)
        }
    } 

    const updatePlayersNumber = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(stallionRunAddress, abi, provider)
        const numPlayersBI = await contract.getNumPlayers()
        const numPlayers = parseInt(numPlayersBI)
        setPlayersEntered(numPlayers)
    }

    const updatePlayer = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(stallionRunAddress, abi, provider)
        const playerIndex = playersEntered - 1
        const newIndex = playerIndex.toString()

        const newPlayer = await contract.getPlayerAddress(newIndex)
        const newPlayerLevelBI = await contract.ownedHorseLevel(newPlayer)
        const newPlayerLevel = parseInt(newPlayerLevelBI)
        const newPlayerHorseArr = await contract.ownedHorseName(newPlayer)
        const newPlayerHorse = newPlayerHorseArr.toString()
        const newPlayerObject = {address: newPlayer, level: newPlayerLevel, horse: newPlayerHorse}
        // setPlayers([...players, newPlayerObject])
        setPlayers(prev => [...prev, newPlayerObject])

        if(playersEntered === 3) {
            const progressBI = await contract.getRaceState()
            const progress = parseInt(progressBI)
            setInProgress(progress)
            console.log(inProgress)

            executeRace()
        }
    }

    const executeRace = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(stallionRunAddress, abi, provider)
        const winner = await contract.getRecentWinner()
        const {0: variable_1, 1: variable_2} = winner;
        const newWinner = variable_1.toString()

        if(winner && newWinner !== "0x0000000000000000000000000000000000000000") {
            setWinner(newWinner)

            setTimeout(() => {
                setInProgress(0)
                setPlayers([])
                setPlayersEntered(0)
                setWinner("")
              }, "300000")
              
        }


    }

  return (
    <div className="mx-2 sm:mx-4 md:mx-10">
        <div className="w-full my-4 py-4 border-1 bg-gray-100 border-gray-400 rounded-xl shadow-2xl">
            <div className="text-center font-rakkas text-green-800 font-semibold text-xl lg:text-2xl uppercase py-2">Participants</div>
                {players.length > 0 ? (
                    players.map((player, i) =>  {
                        return (
                            <div key={i} className="flex flex-row flex-wrap justify-center gap-x-10 md:gap-x-20 lg:gap-x-48 gap-y-2 md:gap-y-4 lg:gap-y-10 mt-4 text-red-400 font-semibold lg:text-xl">
                                <div>{player.address}</div>
                                <div>Level-{player.level}</div>
                                <div>Horse name: {player.horse}</div>
                            </div>
                        )
                    })
                ) : (<div className="text-center">No Players Yet</div>)}
        </div>

        <div className="mt-8 lg:mt-16 text-center">
            <button className="py-10 px-10 rounded-full bg-gray-200 text-xl sm:text-2xl lg:text-3xl text-green-800 uppercase font-bold border-4 border-lime-300 hover:border-lime-600 font-rakkas" onClick={enterRace}>Enter Race</button>
        </div>

        <div className="my-8 text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-800 font-rakkas">{playersEntered} / 3</div>
        </div>
        {winner ? (
            <div className="text-center">
                <div className="bg-lime-200 border-4 border-green-600 px-4 py-4 rounded-xl text-xl sm:text-2xl lg:text-3xl shadow-lg shadow-lime-800"><span className="mx-6">Winner:</span> <span className="mx-6">{winner}</span></div>
            </div>
        ) : (
            playersEntered === 3 ? (<div className="text-center">Calculating Winner...</div>) : (null)
        )}

    </div>
    
  )
}

export default RaceComponent
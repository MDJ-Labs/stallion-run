import {useMoralis} from 'react-moralis'
import {ConnectButton} from 'web3uikit'
import Link from 'next/link';
import { GiHorseHead } from "react-icons/gi";

function Header() {
  return (
    <nav className="flex items-center justify-between bg-green-600 p-6 mb-6">
    <div className="flex items-center flex-shrink-0 text-white gap-2">
        <GiHorseHead size={40} />
        <Link href="/"><a className="font-semibold text-3xl md:text-4xl font-rakkas tracking-tight">Stallion Run</a></Link>
    </div>
    <div className="flex justify-center lg:w-auto">
        <div className="text-sm justify-center">
        <Link href="/">
            <a className="block mt-4 lg:inline-block lg:mt-0 text-white text-xl lg:text-3xl font-rakkas uppercase hover:font-bold hover:duration-100 mx-2 lg:mx-6">Home</a>
        </Link>
        <Link href="/mint">
            <a className="block mt-4 lg:inline-block lg:mt-0 text-white text-xl lg:text-3xl font-rakkas uppercase hover:font-bold hover:duration-100 mx-2 lg:mx-6">Mint</a>
        </Link>
        </div>
    </div>
    <div>
        <ConnectButton moralisAuth={false} />
    </div>
</nav>

  )
}

export default Header
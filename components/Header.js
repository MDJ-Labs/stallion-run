import {useMoralis} from 'react-moralis'
import {ConnectButton} from 'web3uikit'
import Link from 'next/link';
import { GiHorseHead } from "react-icons/gi";

function Header() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-green-600 p-6 mb-6">
  <div className="flex items-center flex-shrink-0 text-white gap-2">
    <GiHorseHead size={40} />
    <Link href="/"><a className="font-semibold text-4xl font-rakkas tracking-tight">Stallion Run</a></Link>
  </div>
  <div className="block lg:hidden">
    <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
      <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    </button>
  </div>
  <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto lg:text-center">
    <div className="text-sm lg:flex-grow justify-center">
      <Link href="/mint">
        <a className="block mt-4 lg:inline-block lg:mt-0 text-white text-3xl font-rakkas uppercase hover:font-bold hover:duration-100 mr-4">Mint</a>
      </Link>
    </div>
    <div>
        <ConnectButton moralisAuth={false} />
    </div>
  </div>
</nav>

  )
}

export default Header
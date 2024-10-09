import web3AuthLogo from '@/assets/web3auth_logo.png'
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth } from '@web3auth/modal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { WalletClient, createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

// Get the CLIENT_ID from the Web3Auth dashboard.
const CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://ethereum-sepolia-rpc.publicnode.com',
  displayName: 'Ethereum Sepolia Testnet',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
})

const web3auth =
  CLIENT_ID &&
  new Web3Auth({
    clientId: CLIENT_ID,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider
  })

export default function Web3AuthComponent() {
  const [provider, setProvider] = useState<WalletClient | null>(null)
  const [signer, setSigner] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        if (!CLIENT_ID || !web3auth) return

        await web3auth.initModal()
        const client = createWalletClient({
          chain: sepolia,
          transport: custom(web3auth.provider!)
        })

        if (web3auth.connected) {
          setProvider(client)
          setSigner((await client.getAddresses())[0])
        }
      } catch (error) {
        console.error(error)
      }
    }
    init()
  }, [])

  const login = async () => {
    try {
      if (!web3auth) return

      const web3authProvider = await web3auth.connect()
      const client = createWalletClient({
        chain: sepolia,
        transport: custom(web3authProvider!)
      })

      if (web3auth.connected) {
        setProvider(client)
        setSigner((await client.getAddresses())[0])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    if (!web3auth) return

    await web3auth.logout()

    setProvider(null)
    setSigner(null)
  }

  const unloggedInView = <button onClick={login}>Connect</button>

  const loggedInView = <button onClick={logout}>Disconnect</button>

  return (
    <div className="card">
      <div className="title">
        <Image src={web3AuthLogo} alt="Web3Auth" height="30" />
        <h2>Web3Auth</h2>
      </div>
      {!CLIENT_ID ? (
        <pre>Not configured</pre>
      ) : (
        <>
          <pre>{signer || 'Not connected'}</pre>
          {signer ? loggedInView : unloggedInView}
        </>
      )}
    </div>
  )
}

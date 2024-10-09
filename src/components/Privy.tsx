import privyLogo from '@/assets/privy_logo.png'
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { WalletClient, createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

// Get the APP_ID from the Privy dashboard.
const APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID

function PrivyApp() {
  const { login, logout, ready, authenticated } = usePrivy()
  const { ready: readyWallets, wallets } = useWallets()
  const [provider, setProvider] = useState<WalletClient | null>(null)
  const [signer, setSigner] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      if (!APP_ID) return

      if (ready && authenticated && readyWallets && wallets.length > 0) {
        const ethereumProvider = await wallets[0].getEthereumProvider()
        const client = createWalletClient({
          chain: sepolia,
          transport: custom(ethereumProvider)
        })

        setProvider(client)
        setSigner(wallets[0].address)
      }
    }
    init()
  }, [ready, authenticated, readyWallets, wallets])

  const connect = async () => {
    try {
      login()
    } catch (error) {
      console.error(error)
    }
  }

  const disconnect = async () => {
    logout()

    setProvider(null)
    setSigner(null)
  }

  const unloggedInView = <button onClick={connect}>Connect</button>

  const loggedInView = <button onClick={disconnect}>Disconnect</button>

  return (
    <div className="card">
      <div className="title">
        <Image src={privyLogo} alt="Magic" height="30" />
        <h2>Privy</h2>
      </div>
      <pre>{signer || 'Not connected'}</pre>
      {signer ? loggedInView : unloggedInView}
    </div>
  )
}

export default function PrivyComponent() {
  if (!APP_ID) {
    return (
      <div className="card">
        <div className="title">
          <Image src={privyLogo} alt="Magic" height="30" />
          <h2>Privy</h2>
        </div>
        <pre>Not configured</pre>
      </div>
    )
  }

  return (
    <PrivyProvider
      appId={APP_ID}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets' // defaults to 'off'
        }
      }}
    >
      <PrivyApp />
    </PrivyProvider>
  )
}

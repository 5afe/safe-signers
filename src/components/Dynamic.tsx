import dynamicLogo from '@/assets/dynamic_logo.png'
import {
  EthereumWalletConnectors,
  isEthereumWallet
} from '@dynamic-labs/ethereum'
import {
  DynamicContextProvider,
  useDynamicContext,
  useIsLoggedIn
} from '@dynamic-labs/sdk-react-core'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { WalletClient } from 'viem'

// Get the ENVIRONMENT_ID from the Dynamic dashboard
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID

function DynamicApp() {
  const { primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()
  const [provider, setProvider] = useState<WalletClient | null>(null)
  const [signerAddress, setSignerAddress] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      if (isLoggedIn && primaryWallet && isEthereumWallet(primaryWallet)) {
        const client = await primaryWallet.getWalletClient()

        setProvider(client)
        setSignerAddress(primaryWallet.address)
      }
    }
    init()
  }, [isLoggedIn, primaryWallet])

  const disconnect = async () => {
    await handleLogOut()
    setProvider(null)
    setSignerAddress(null)
  }

  const unloggedInView = (
    <button onClick={() => setShowAuthFlow(true)}>Connect</button>
  )

  const loggedInView = <button onClick={disconnect}>Disconnect</button>

  return (
    <div className="card">
      <div className="title">
        <Image src={dynamicLogo} alt="Dynamic" height="30" />
        <h2>Dynamic</h2>
      </div>
      <pre>{signerAddress || 'Not connected'}</pre>
      {signerAddress ? loggedInView : unloggedInView}
    </div>
  )
}

export default function DynamicComponent() {
  if (!ENVIRONMENT_ID) {
    return (
      <div className="card">
        <div className="title">
          <Image src={dynamicLogo} alt="Dynamic" height="30" />
          <h2>Dynamic</h2>
        </div>
        <pre>Not configured</pre>
      </div>
    )
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors]
      }}
    >
      <DynamicApp />
    </DynamicContextProvider>
  )
}

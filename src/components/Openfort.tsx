import openfortLogo from '@/assets/openfort_logo.png'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { WalletClient, createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
import { WagmiProvider, createConfig } from 'wagmi'
import {
  AccountTypeEnum,
  AuthProvider,
  OpenfortProvider,
  OpenfortButton,
  useUser,
  useWallets,
  useOpenfort,
  getDefaultConfig,
  RecoveryMethod
} from '@openfort/react'

// Get the credentials from environment variables
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY
const SHIELD_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'Safe Signers Demo',
    chains: [sepolia],
    ssr: true
  })
)

const queryClient = new QueryClient()

const customTheme = {
  '--ck-connectbutton-background': '#12ff80',
  '--ck-connectbutton-color': '#000000',
  '--ck-connectbutton-hover-background': '#18dc74'
}

function OpenfortApp() {
  const { isAuthenticated } = useUser()
  const { wallets } = useWallets()
  const { client } = useOpenfort()
  const [provider, setProvider] = useState<WalletClient | null>(null)
  const [signer, setSigner] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      if (isAuthenticated && wallets.length > 0) {
        try {
          setSigner(wallets[0].address)

          // Get the Ethereum provider from Openfort client
          const ethereumProvider =
            await client.embeddedWallet.getEthereumProvider()

          const walletClient = createWalletClient({
            chain: sepolia,
            transport: custom(ethereumProvider)
          })

          setProvider(walletClient)
        } catch (error) {
          console.error('Error initializing wallet:', error)
        }
      } else {
        setProvider(null)
        setSigner(null)
      }
    }
    init()
  }, [isAuthenticated, wallets, client])

  return (
    <div className="card">
      <div className="title">
        <Image src={openfortLogo} alt="Openfort" height="30" />
        <h2>Openfort</h2>
      </div>
      <pre>{signer || 'Not connected'}</pre>
      <OpenfortButton
        label={"Connect"}
      />
    </div>
  )
}

export default function OpenfortComponent() {
  if (!PUBLISHABLE_KEY || !SHIELD_PUBLISHABLE_KEY) {
    return (
      <div className="card">
        <div className="title">
          <Image src={openfortLogo} alt="Openfort" height="30" />
          <h2>Openfort</h2>
        </div>
        <pre>Not configured</pre>
      </div>
    )
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          publishableKey={PUBLISHABLE_KEY}
          walletConfig={{
            shieldPublishableKey: SHIELD_PUBLISHABLE_KEY,
            accountType: AccountTypeEnum.EOA
          }}
          uiConfig={{
            customTheme: customTheme,
            authProviders: [
              AuthProvider.EMAIL,
              AuthProvider.GOOGLE,
              AuthProvider.GUEST
            ],
            walletRecovery: {
                defaultMethod: RecoveryMethod.PASSWORD,
                allowedMethods: [
                    RecoveryMethod.PASSWORD,
                    RecoveryMethod.PASSKEY
                ]
            }
          }}
        >
          <OpenfortApp />
        </OpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


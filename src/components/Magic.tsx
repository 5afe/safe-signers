import magicLogo from '@/assets/magic_logo.png'
import { Magic } from 'magic-sdk'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { WalletClient, createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

// Get the API_KEY from the Magic dashboard.
const API_KEY = process.env.NEXT_PUBLIC_MAGIC_API_KEY

export default function MagicComponent() {
  const [magic, setMagic] = useState<Magic>()
  const [provider, setProvider] = useState<WalletClient | null>(null)
  const [signer, setSigner] = useState<string | null>(null)

  useEffect(() => {
    if (!API_KEY) return

    const magicInstance = new Magic(API_KEY, {
      network: {
        rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
        chainId: 11155111
      }
    })
    setMagic(magicInstance)
  }, [])

  const login = async () => {
    try {
      if (!magic) return

      await magic.wallet.connectWithUI()
      const metadata = await magic.user.getInfo()
      const signer = metadata.publicAddress
      const client = createWalletClient({
        chain: sepolia,
        transport: custom(magic.rpcProvider)
      })

      setProvider(client)
      setSigner(signer)
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    await magic?.user.logout()

    setProvider(null)
    setSigner(null)
  }

  const unloggedInView = <button onClick={login}>Connect</button>

  const loggedInView = <button onClick={logout}>Disconnect</button>

  return (
    <div className="card">
      <div className="title">
        <Image src={magicLogo} alt="Magic" height="30" />
        <h2>Magic</h2>
      </div>
      {!API_KEY ? (
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

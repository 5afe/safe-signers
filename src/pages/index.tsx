import Dynamic from '@/components/Dynamic'
import Magic from '@/components/Magic'
import Privy from '@/components/Privy'
import Web3Auth from '@/components/Web3Auth'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>{'Safe{Core} SDK Signers'}</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="main">
        <h1>Signers</h1>
        <Dynamic />
        <Magic />
        <Privy />
        <Web3Auth />
      </main>
    </>
  )
}

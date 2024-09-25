# Safe Signers

Safe Smart Accounts can be setup with multiple and different signer accounts.

This example application shows how to create signers from different service providers and use them to initialize any of the kits from the Safe{Core} SDK with the required `provider` and `signer` parameters.

| Provider | Documentation |
| -------- | ------- |
| [Dynamic](https://dynamic.xyz)   | [Integrate Dynamic signer](https://docs.safe.global/sdk/signers/dynamic) |
| [Magic](https://magic.link)     | [Integrate Magic signer](https://docs.safe.global/sdk/signers/magic) |
| [Privy](https://privy.io)       | [Integrate Privy signer](https://docs.safe.global/sdk/signers/privy) |
| [Web3Auth](https://web3auth.io) | [Integrate Web3Auth signer](https://docs.safe.global/sdk/signers/web3auth) |

Please read the [Signers section](https://docs.safe.global/sdk/signers) in the Safe documentation to see how to integrate the different providers.

## Prerequisites

You will need some basic experience with [React](https://react.dev/learn), [Next.js](https://nextjs.org/docs). Before progressing with the tutorial, please make sure you have:

- Downloaded and installed [Node.js](https://nodejs.org/en/download/package-manager) and [pnpm](https://pnpm.io/installation).

## Getting Started

To install this example application, run the following commands:

```bash
git clone https://github.com/5afe/safe-signers.git
cd safe-signers
pnpm install
```

This will get a copy of the project installed locally. Now, create an `.env` file at the root of your project, and add the corresponding environment variables:

```
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=
NEXT_PUBLIC_MAGIC_API_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=
```

Run the local development server with the following command:

```bash
pnpm dev
```

Go to `http://localhost:3000` in your browser to see the application.

## Help

Please post any questions on [Stack Exchange](https://ethereum.stackexchange.com/questions/tagged/safe-core) with the `safe-core` tag.

## License

MIT, see [LICENSE](LICENSE).

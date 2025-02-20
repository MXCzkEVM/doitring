# Next.js React Wagmi Starter Kit

leverages the capabilities of [Rainbowkit 2](https://beta.rainbowkit.com/guides/rainbowkit-wagmi-v2) and [Wagmi 2](https://github.com/wevm/wagmi) for seamless wallet integration and authentication. The kit also includes Ethers 5 for interacting with the Ethereum blockchain.

## Features

- ⚡️ Built with speed using [Next.js 14](https://nextjs.org/), [React](https://react.docschina.org/), [Rainbowkit 2](https://beta.rainbowkit.com/guides/rainbowkit-wagmi-v2), [Wagmi 2](https://github.com/wevm/wagmi), and [Ethers 5](https://github.com/ethers-io/ethers.js)
- 🗒 Generate multiple contract types easily with the `pnpm gen:abi` command
- 🗂 File-based routing powered by [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)
- 🎨 Seamless integration with Tailwind CSS using [UnoCSS](https://github.com/unocss/unocss)
- 🔍 [Utilize icons](https://github.com/unocss/unocss/tree/main/packages/preset-icons) from any icon sets using classes with [Icônes](https://icones.netlify.app/)

## Environment

Before running this project, you need to configure the following .env environment variables:

```sh
## harsta network alias
NEXT_PUBLIC_DEFAULT_CHAIN = "geneva"
NEXT_PUBLIC_NFT_URL = "https://geneva-nft.moonchain.com"

NEXT_PUBLIC_PINATA_SECRET_API_KEY = <your-pinata-api-key>
NEXT_PUBLIC_PINATA_API_KEY = <your-pinata-api>

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = <your-stripe-publishable-key>

NEXT_PUBLIC_SERVER_URL = <doitring-server-url>
```

## Getting Started

To start the Blueberry page, ensure that `NEXT_PUBLIC_SERVER_URL` is enabled. If it is not enabled, you can check [packages/server](/packages/server) to enable the service.

Once all environment variables are configured, you can use the following command to enable the development server for the page:

```sh
pnpm dev
```

If you need to deploy to production, use the following commands:

```sh
pnpm build
pnpm start
```

## Credits

- [Rainbowkit](https://github.com/rainbow-me/rainbowkit)
- [Wagmi](https://wagmi.sh/react/getting-started)
- [Next.js](https://nextjs.org/)

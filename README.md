# Geoscriptions

project consisting of a client-side application built with Next.js and a server-side application built with NestJS.

## Directories

The project use monorepo for multiple packages is organized into the following directories:

- [packages/analyzkit](/packages/analyzkit/):  Used for data analysis of BlueberryRing in moonchain.
- [packages/frontend](/packages//frontend/): Contains the client-side application built with Next.js.
- [packages/solidity](/packages/solidity/):  Contains the contracts built with hardhat.
- [packages/server](/packages/server):  Contains the server-side application built with NestJS.

## Getting Started

To get started with the development of the project, follow the steps below:

1. Clone the repository.
2. Navigate to the root directory of the project.
3. Run `pnpm install` to install dependencies
4. Configure the `.env` for `packages/server`
5. Configure the `.env` for `packages/frontend`

### Development

To start the development server for the client-side application, run the following command:

```sh
pnpm dev:client
```

To start the development server for the server-side application, run the following command:

```sh
pnpm dev:server
```

If the server API is changed, it can be run in the client directory to generate client API code

```sh
pnpm build:genapi
```

If the contracts is changed, run the following command:

```sh
pnpm build:solidity
```

## Environment

This project uses [dotenv](https://dotenvx.com/) to manage all environment variables. You can create a project and link it at [vault.dotenv.org](https://vault.dotenv.org/ui/ui1/project/new). Additionally, you can configure a specific project's `.env` separately.

When using [dotenv](https://dotenvx.com/), you need to fill in all the following environment variables, which can be found in the corresponding project documentation.

```sh
# frontend
NEXT_PUBLIC_DEFAULT_CHAIN= "..."
NEXT_PUBLIC_NFT_URL= "..."
NEXT_PUBLIC_PINATA_SECRET_API_KEY= "..."
NEXT_PUBLIC_PINATA_API_KEY= "..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= "..."
NEXT_PUBLIC_SERVER_URL= "..."

# server
NEST_PRISMA_DATABASE_URL= "..."
NEST_SERVER_PORT= "..."
NEST_DEFAULT_LAST_BLOCK= "..."
NEST_STRIPE_SECRET_KEY= "..."
NEST_WOOC_CONSUMER_KEY= "..."
NEST_WOOC_CONSUMER_SECRET= "..."
NEST_ADVISOR_REST_URL= "..."

# common
VERIFIER_PRIVATE_KEY= "..."
OWNER_PRIVATE_KEY= "..."
NETWORK= "geneva"
```

Locally, you need to obtain the corresponding environment key by running `npx dotenv-vault@latest keys`, and then fill in the `.env.key`:

```sh
DOTENV_KEY = "..."
```

After that, simply rerun `pnpm install`, which will load the environment variables via `lnv dotenv -r`, covering all projects.

If you need to deploy on `vercel`, you must set the corresponding environment `key` using `npx vercel@latest env add DOTENV_KEY`.

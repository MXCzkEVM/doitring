# Contracts

The core contracts related to Doitring mainly include the following contracts:

- `contracts/DoitRingDevice.sol` Contract related to device registration and synchronous rewards
- `contracts/DoitRingFriend.sol` Contract related to creating Friends and member rewards
- `contracts/erc20/Health.sol` Blueberry token
- `contracts/erc721/DoitRingNFT.sol` Device NFT registration
- `contracts/DoitRingStaked.sol` Contract for staking Blueberry tokens

## Harsta

This project uses Harsta for compilation and subsequent deployment testing.

**Harsta** is a contract development tool based on Hardhat, designed to streamline the development, testing, and referencing of contracts, addresses, ABIs, and contract instances.

**Harsta** simplifies the configuration files for end-to-end development and contract writing. You only need to write one configuration that can be referenced anywhere.

## Environment

Before running this project, you need to configure the following .env environment variables:

```sh
# Owner and deployer of the contracts
OWNER_PRIVATE_KEY = "..."
# Signer for verifying synchronous signatures
VERIFIER_PRIVATE_KEY = "..."
```

## Deployments

For deployment configurations, please refer to the `deployments` field in `harsta.config`. This field contains configurations for all contracts, where `args` represent the initialization parameters during contract deployment.

```ts
import { HarstaRuntimeEnvironment, defineConfig } from 'harsta'

// harsta.config.ts
const config = defineConfig({
  //  ...
  deployments: {
    Storage: { kind: 'transparent' },
    Savings: { kind: 'uups', args: getOwnableArgs },
    DoitRingDevice: { kind: 'uups', args: getVerifieArgs },
    DoitRingFriend: { kind: 'uups', args: getVerifieArgs },
    DoitRingStaked: { kind: 'uups', args: getOwnableArgs },
    Health: {
      args: async env => [
        ...await getOwnableArgs(env),
        'Blueberry',
        'Blueberry',
      ],
    },
    USDT: { args: getOwnableArgs },
  },
})

async function getVerifieArgs(env: HarstaRuntimeEnvironment) {
  return env.getNamedAccounts().then(ns => [ns.owner, ns.verifier])
}

async function getOwnableArgs(env: HarstaRuntimeEnvironment) {
  return env.getNamedAccounts().then(ns => [ns.owner])
}
```

Once you have confirmed the configurations and contracts are correct, you can deploy using the following scripts:

```sh
# Deploy to local testnet (for testing deployments)
pnpm deploy:devnet

# or

# Deploy to testnet (geneva)
pnpm deploy:testnet

# or

# Deploy to mainnet (moonchain)
pnpm deploy:mainnet
```

## Verify

By default, `deploy` will automatically verify deployed contracts. If you need to verify separately, you can use the following script for verification:

```sh
# example
pnpm verify:testnet DoitRingDevice --force
```

## Upgrade

If you need to update contracts after deployment, execute the following command:

```sh
# example
pnpm harsta update DoitRingDevice --target DoitRingDeviceV2
```

After a successful update, run the following command in the current directory and modify and rerun the `frontend` and `server` services:

```sh
pnpm harsta compile --output dist --clean
```

## Tests

`harsta` uses `vitest` to read the corresponding chain configuration and compile code for testing by initializing the environment.

The test directory is located in `harsta/test`. If you need to add new test cases, please note that you should initialize using `harsta/tests` in advance:

```ts
import { contracts } from 'harsta/runtime'
import { initial } from 'harsta/tests'
import { describe, expect, it } from 'vitest'

await initial()
// Proceed with your tests

it('call:contract-1', async () => {
  const contract = contracts.contract1.resolve('singer')
  await contract.func(/* contract func args */)
})
```

Additionally, you can use `fixture` for testing. If the chain is not deployed, it will automatically deploy, which is very useful for local networks.

Forked networks will automatically inherit contract addresses, and you can also use `:` to test contracts that are to be updated.

```ts
import { fixture, initial } from 'harsta/tests'

await initial()

await fixture([
  'Contract1',
  'Contract2:Contract2V2'
])
```

Use `harsta test` for testing, run the following `scripts` for testing:

```sh
# conduct testing on the local network
pnpm test
# conduct testing on the testing network
pnpm test:testnet
# local network fork testnet for testing
pnpm test:fork:testnet
# local network fork mainnet for testing
pnpm test:fork:mainnet
```

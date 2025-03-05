import { contracts, provider, updateSigner } from '@harsta/client'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JsonRpcProvider, Wallet } from 'ethers'

@Injectable()
export class EthersService {
  provider: JsonRpcProvider
  DoitRingStaked: import('@harsta/client/dist/_typechain-contracts').DoitRingStaked
  DoitRingFriend: import('@harsta/client/dist/_typechain-contracts').DoitRingFriend
  DoitRingDevice: import('@harsta/client/dist/_typechain-contracts').DoitRingDevice
  Storage: import('@harsta/client/dist/_typechain-contracts').Storage
  Savings: import('@harsta/client/dist/_typechain-contracts').Savings
  Health: import('@harsta/client/dist/_typechain-contracts').Health
  owner: Wallet
  verifier: Wallet

  constructor(private config: ConfigService) {
    this.verifier = new Wallet(config.get('VERIFIER_PRIVATE_KEY'), provider)
    this.owner = new Wallet(config.get('OWNER_PRIVATE_KEY'), provider)
    this.provider = provider as unknown as JsonRpcProvider
    this.DoitRingStaked = contracts.DoitRingStaked.resolve()
    this.DoitRingFriend = contracts.DoitRingFriend.resolve()
    this.DoitRingDevice = contracts.DoitRingDevice.resolve()
    this.Storage = contracts.Storage.resolve()
    this.Health = contracts.Health.resolve()
    this.Savings = contracts.Savings.resolve(this.owner)
    updateSigner(this.owner)
  }
}

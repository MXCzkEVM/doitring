import { provider, signer } from '@harsta/client'
import { ContractTransaction, Transaction, TransactionReceipt } from 'ethers'
import { waitForTransaction } from './ethers-transaction'
import { postAgent, postAgentProof } from '@/api'

export async function waitForProxyTransaction(transaction: ContractTransaction | Promise<ContractTransaction>, method?: string): Promise<TransactionReceipt | null> {
  return await waitForTransaction(async () => {
    const _transaction = await transaction
    if (!Reflect.get(_transaction, 'metadata'))
      await callForProxyTransaction(_transaction, method)
    const metadata = Reflect.get(_transaction, 'metadata')
    return provider.waitForTransaction(metadata.hash)
  })
}

export async function callForProxyTransaction(transaction: ContractTransaction, method?: string) {
  const hexlifyTransaction = Transaction.from(transaction).toJSON()
  hexlifyTransaction.from = await signer.getAddress()
  const { data: message } = await postAgentProof({
    from: hexlifyTransaction.from,
    to: hexlifyTransaction.to,
    method: method!,
  })
  const signature = await signer.signMessage(message)

  const response = await postAgent({
    data: hexlifyTransaction.data,
    from: hexlifyTransaction.from,
    to: hexlifyTransaction.to,
    method: method!,
    signature,
  })
  if (!response)
    throw new Error('fail in send')

  Reflect.set(transaction, 'metadata', {
    gasPrice: response.gasPrice,
    gasLimit: response.gasLimit,
    hash: response.hash,
  })

  return hexlifyTransaction
}

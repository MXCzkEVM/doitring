import { TransactionResponse, Contract as _Contract } from 'ethers'

export async function waitForTransaction(transaction: any | Promise<any> | (() => any)) {
  let result: any
  if (typeof transaction === 'function') {
    result = await transaction()
  }
  else {
    const trx = await transaction
    result = await trx!.wait()
  }
  return result
}

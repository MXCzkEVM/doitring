import { Contract as _Contract } from 'ethers'

import { toast } from 'react-toastify'
import { DefaultMessages, ErrorMessages } from './ethers-error'
import { i18n } from '@/plugins'

export async function waitForTransaction(transaction: any | Promise<any> | (() => any)) {
  toast.dismiss()

  toast.loading(i18n.t('Waiting for Confirm Tx'))
  try {
    let result: any
    if (typeof transaction === 'function') {
      result = await transaction()
    }
    else {
      const trx = await transaction
      result = await trx!.wait()
    }
    toast.dismiss()
    return result
  }
  catch (error: any) {
    console.log({ error })
    console.log('error.message: ', error?.error?.message)
    toast.dismiss()
    const message = ErrorMessages[error?.error?.data?.data?.slice?.(0, 10) || error?.data]?.()
      || DefaultMessages[error?.error?.message]?.()
      || DefaultMessages[error?.code]?.()
      || i18n.t('An unknown error occurred')
    toast.error(message)
    throw error
  }
}

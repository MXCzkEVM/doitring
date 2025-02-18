import { id } from 'ethers'
import { errors as DefaultErrors } from 'ethers-v5'
import { i18n } from '@/plugins'

function idprefix(errorCallString: string) {
  return id(errorCallString).slice(0, 10)
}

export const ErrorMessages = {
  [idprefix('DeviceRegistered()')]: () => i18n.t('The device has been registered'),
  [idprefix('DeviceEmpty()')]: () => i18n.t('Device is empty unable to register Bluetooth device'),
  [idprefix('ERC721IncorrectOwner()')]: () => i18n.t('Not NFT Owner'),
  [idprefix('DeviceUnregistered()')]: () => i18n.t('Unregistered device'),
  [idprefix('ClaimInvalidClaimed()')]: () => i18n.t('Invalid duplicate claims'),
  [idprefix('InvalidSignature()')]: () => i18n.t('Invalid signature'),
  [idprefix('TransferFailed()')]: () => i18n.t('Insufficient Claim Pool'),
  [idprefix('TransferUnauthorized()')]: () => i18n.t('Unauthorized Transfer'),
  [idprefix('InvalidAccount()')]: () => i18n.t('Insufficient account'),
}

export const DefaultMessages: any = {
  Canceled: () => i18n.t('You have rejected the action Please approve it to proceed'),
  [DefaultErrors.ACTION_REJECTED]: () => i18n.t('You have rejected the action Please approve it to proceed'),
  [DefaultErrors.NUMERIC_FAULT]: () => i18n.t('A numeric operation caused an overflow or underflow'),
  [DefaultErrors.CALL_EXCEPTION]: () => i18n.t('The contract encountered an exception'),
  [DefaultErrors.INSUFFICIENT_FUNDS]: () => i18n.t('You have insufficient funds to complete the transaction'),
  [DefaultErrors.NONCE_EXPIRED]: () => i18n.t('A transaction with the same nonce but a higher gas price was sent making this one obsolete'),
  [DefaultErrors.REPLACEMENT_UNDERPRICED]: () => i18n.t('This transaction was replaced by another one'),
}

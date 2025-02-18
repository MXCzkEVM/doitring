/* eslint-disable ts/no-unused-expressions */
/* eslint-disable no-empty-pattern */
import { storeToState, useWhenever } from '@hairy/react-utils'
import { PropsWithChildren } from 'react'
import { useAccount } from 'wagmi'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useRouter } from 'next/router'
import { isAddress } from 'ethers'
import { contracts } from '@harsta/client'
import { useOverlayInject } from '@overlastic/react'
import { useMount } from 'react-use'
import { GroupBeenInvitedDialog } from '../dialog'
import {
  useFetchResponseIntercept,
  useProxyMiner,
  useProxyMinerDetail,
  useProxyNFTs,
  useProxyUser,
} from '@/hooks'
import { store } from '@/store'
import { helperGetNews } from '@/service'

dayjs.extend(duration)

export function BootstrapProvider(props: PropsWithChildren) {
  const router = useRouter()
  const { address } = useAccount()
  const [reads, setReads] = storeToState(store.config, 'reads')
  const [{}, setHistories] = storeToState(store.user, 'histories')

  const openGroupBeenInvitedDialog = useOverlayInject(GroupBeenInvitedDialog)
  const [inviter, setInviter] = storeToState(store.config, 'inviter')
  const [invite, setInvite] = storeToState(store.config, 'invite')
  const [inviteHandled, setInviteHandled] = storeToState(store.config, 'inviteHandled')
  const [{}, fetchMinerDetail, clearMinerDetail] = useProxyMinerDetail()
  const [{ value: miner }, fetchMiner, clearMiner] = useProxyMiner()
  const [{}, fetchNFTs, clearNFTs] = useProxyNFTs()
  const [{}, fetchUser, clearUser] = useProxyUser()

  async function fetchMinersByDetail() {
    const miner = await fetchMiner()
    miner && fetchMinerDetail(miner)
  }

  useWhenever(miner && !router.query.invite, () => router.pathname === '/' && router.push('/device'))
  useWhenever(!miner && !router.query.invite, () => router.pathname !== '/' && router.push('/'))

  useWhenever(address, fetchMinersByDetail, { immediate: true })
  useWhenever(address, fetchNFTs, { immediate: true })
  useWhenever(address, fetchUser, { immediate: true })

  useWhenever(address, async () => {
    const Savings = contracts.Savings.resolve()
    const event = Savings.filters.Deposited(undefined, address)
    const logs = await Savings.queryFilter(event)
    setHistories(logs.map(log => ({
      amount: log.args.amount,
      memo: log.args.memo,
      receiver: log.args.receiver,
      sender: log.args.sender,
      token: log.args.token,
    })))
  })

  useWhenever(
    router.query.inviter && !router.query.invite,
    async () => {
      if (!isAddress(router.query.inviter))
        return
      if (address && inviter === address)
        return setInviter(undefined)
      const DoitRingDevice = contracts.DoitRingDevice.resolve()
      const sncode = await DoitRingDevice.getDeviceInAddress(router.query.inviter)
      if (sncode)
        setInviter(router.query.inviter)
    },
  )

  useWhenever(router.query.invite, () => {
    if (typeof window.axs !== 'undefined') {
      setInvite(router.query.invite as string)
      setInviteHandled(false)
      return
    }
    const timer = setTimeout(() => window.location.href = 'https://www.mxc.org/axs-app', 3000)
    window.location.href = `https://mxc1usd.com/dapp/https://testnet.blueberryring.com?invite=${router.query.invite}`
    window.addEventListener(
      'visibilitychange',
      () => document.hidden
      && clearTimeout(timer),
    )
  })

  useWhenever(invite && miner && !inviteHandled, () => {
    openGroupBeenInvitedDialog({ invite: invite! })
    setInviteHandled(true)
  })

  useWhenever(!address, () => {
    clearMinerDetail()
    clearMiner()
    clearNFTs()
    clearUser()
  })

  useFetchResponseIntercept(async (response) => {
    const data = await response.clone().json()

    if (data?.statusCode)
      throw data
    return response
  })

  useMount(async () => {
    const news = await helperGetNews()
    const newReads = { ...reads }
    for (const item of news) {
      if (typeof newReads[item.title] === 'undefined')
        newReads[item.title] = false
    }
    setReads(newReads)
  })

  return props.children
}

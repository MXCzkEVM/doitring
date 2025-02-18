import { defaultAddresses } from '@harsta/client'

export async function helperGetLaunchpadDetail() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_NFT_URL}/api/get-collection-launchpad`, {
    body: JSON.stringify({
      chainId: process.env.NEXT_PUBLIC_DEFAULT_CHAIN === 'geneva'
        ? 5167004
        : 18686,
      collection_id: defaultAddresses.DoitRingNFT,
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  return await response.json().then(r => r.data.collection)
}

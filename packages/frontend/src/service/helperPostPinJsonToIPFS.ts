export interface PostPinJsonToIPFSData {
  pinataOptions?: Record<string, string>
  pinataMetadata?: Record<string, string>
  pinataContent?: Record<string, any>
}

const headers = {
  'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
  'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`,
  'Content-Type': 'application/json',
}

export async function helperPostPinJsonToIPFS(data: PostPinJsonToIPFSData) {
  const response = await fetch(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  })
  const result = await response.json()
  return result.IpfsHash as string
}

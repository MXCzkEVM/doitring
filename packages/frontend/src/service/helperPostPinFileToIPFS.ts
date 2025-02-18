export interface PostPinFileToIPFSData {
  file: File
  metadata?: Record<string, string>
}

const headers = {
  pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
  pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`,
}

export async function helperPostPinFileToIPFS(data: PostPinFileToIPFSData) {
  const metadata = data.metadata || { name: data.file.name }

  const body = new FormData()

  body.append('pinataMetadata', JSON.stringify(metadata))
  body.append('file', data.file)

  const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
    method: 'POST',
    body,
    headers,
  })
  const result = await response.json()
  return result.IpfsHash as string
}

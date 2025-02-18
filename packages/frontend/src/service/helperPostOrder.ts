export interface PostOrderBody {
  name: string
  email: string
  region: string
  phone: string
  address: string
  hash: string
  size: string
}

export async function helperPostOrder(body: PostOrderBody) {
  const response = await fetch(`/api/order`, {
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const { number } = await response.json()
  return number
}

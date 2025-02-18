import { storage } from '../../../storage'
import { generateRandom } from '../../../utils'
import { AgentMessageBody, AgentTransactionBody } from '../dtos'

export async function generateMessage(body: AgentMessageBody) {
  const key = `${body.from.slice(0, 16)}:nonce`
  let nonce = await storage.getItem<number>(key) || 0
  nonce++

  await storage.setItem(key, nonce)
  const messages = [
    `sender: ${body.from}`,
    body.method ? `contract: ${body.to}` : `to: ${body.to}`,
    body.method && `method: ${body.method}`,
    `unonce: ${generateRandom(`${key}:${nonce}`)}`,
  ]
  return messages.join('\n')
}

export async function parseMessage(body: Partial<AgentTransactionBody>) {
  const key = `${body.from.slice(0, 16)}:nonce`
  const nonce = await storage.getItem<number>(key) || 0
  const messages = [
    `sender: ${body.from}`,
    body.method ? `contract: ${body.to}` : `to: ${body.to}`,
    body.method && `method: ${body.method}`,
    `unonce: ${generateRandom(`${key}:${nonce}`)}`,
  ]
  return messages.filter(Boolean).join('\n')
}

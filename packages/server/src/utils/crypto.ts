import crypto from 'node:crypto'

export function generateRandom(input: string, algorithm = 'sha256') {
  const hash = crypto.createHash(algorithm)
  hash.update(input)
  const hashValue = hash.digest('hex')

  // Convert the hexadecimal hash value to a decimal number
  const decimal = Number.parseInt(hashValue, 16)
  // Limit the random number to a specific range
  const min = 0
  const max = 100000

  return min + (decimal % (max - min + 1))
}

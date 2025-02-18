import { parseEther } from 'ethers'

export const levels = {
  [1 as number]: {
    points: 0,
    health: 0,
  },
  [2 as number]: {
    points: 100000,
    health: parseEther('100000'),
  },
  [3 as number]: {
    points: 1000000,
    health: parseEther('1000000'),
  },
}

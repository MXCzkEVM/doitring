import { contracts } from 'harsta/runtime'
import { fixture, initial } from 'harsta/tests'
import { describe, expect, it } from 'vitest'

await initial()
await fixture(['Storage'])

describe('storage', () => {
  it('setStorage', async () => {
    const storage = contracts.Storage.resolve('signer')
    await storage.setStorage('store-2', [['avatar', 'eee']]).then(trans => trans.wait())
  })
  it('getStorage', async () => {
    const storage = contracts.Storage.resolve()
    const result = await storage.getStorage('store-1', ['avatar'])
    expect(result[0].length).equal(0)
    expect(result[1].length).equal(0)
  })
  it('setItem', async () => {})
  it('getItem', async () => {})
  it('size', async () => {})
  it('has', async () => {})
})

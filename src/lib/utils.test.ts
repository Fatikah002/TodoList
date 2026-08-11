import { describe, expect, it, vi } from 'vitest'
import { generateId } from './utils'

describe('generateId', () => {
  it('uses crypto.randomUUID when available', () => {
    const randomUUID = vi.fn(() => 'mock-uuid')
    const originalCrypto = globalThis.crypto

    Object.defineProperty(globalThis, 'crypto', {
      value: { randomUUID },
      configurable: true,
    })

    expect(generateId()).toBe('mock-uuid')
    expect(randomUUID).toHaveBeenCalledTimes(1)

    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
    })
  })

  it('falls back to a timestamp-based id when randomUUID is unavailable', () => {
    const originalCrypto = globalThis.crypto

    Object.defineProperty(globalThis, 'crypto', {
      value: {},
      configurable: true,
    })

    const id = generateId()

    expect(id).toMatch(/^todo-/)

    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
    })
  })
})

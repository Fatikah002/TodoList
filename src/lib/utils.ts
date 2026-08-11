import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  const globalCrypto = globalThis.crypto as Crypto & { randomUUID?: () => string }

  if (typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID()
  }

  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

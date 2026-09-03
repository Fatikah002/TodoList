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

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

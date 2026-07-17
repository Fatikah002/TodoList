import type { RepeatType } from './types'

export function getNextDeadline(deadline: string, repeat: RepeatType): string {
  const date = new Date(deadline + 'T00:00:00')

  switch (repeat) {
    case 'daily':
      date.setDate(date.getDate() + 1)
      break
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'monthly': {
      const day = date.getDate()
      date.setMonth(date.getMonth() + 1)
      if (date.getDate() !== day) {
        date.setDate(0)
      }
      break
    }
    case 'none':
      return deadline
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

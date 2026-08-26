export function formatLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatTime12(time24: string): string {
  if (!time24) return ''
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function isSameDay(deadline: string, selectedDate: string) {
  return formatLocalDate(new Date(deadline)) === selectedDate
}

export function isOverdue(
  completed: boolean,
  deadline: string,
  dueTime?: string,
) {
  if (completed) return false
  const deadlineDate = dueTime
    ? new Date(`${deadline}T${dueTime}:00`)
    : new Date(`${deadline}T23:59:59`)
  return deadlineDate < new Date()
}

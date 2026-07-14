export type DeadlineStatus = 'late' | 'today' | 'tomorrow' 

export function getDeadlineStatus(deadline: string): DeadlineStatus | null {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const date = new Date(deadline)
    if (Number.isNaN(date.getTime())) return null

    date.setHours(0, 0, 0, 0)

    const diff = Math.round(
        (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (diff < 0) return 'late'
    if (diff === 0) return 'today'
    if (diff === 1) return 'tomorrow'


    return null
}


export type priority = 'High' | 'Medium' | 'Low' | 'None'
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly'

export type NotificationPreferences = {
  taskDeadlineApproaching: boolean
  taskOverdue: boolean
  achievementUnlocked: boolean
}

export type Todo = {
  id: string
  title: string
  detail: string
  category: string
  priority: priority
  deadline: string
  dueTime: string
  completed: boolean
  completedAt?: string
  repeat: RepeatType
  archived: boolean
}

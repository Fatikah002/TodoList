export type priority = 'High' | 'Medium' | 'Low' | 'None'
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly'

export type Todo = {
  id: number
  title: string
  detail: string
  category: string
  priority: priority
  deadline: string
  completed: boolean
  repeat: RepeatType
}


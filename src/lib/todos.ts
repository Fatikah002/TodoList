import type { Todo } from '@/lib/types'
import type { TodoFormData } from '@/lib/schemas'
import { generateId } from '@/lib/utils'

export function createTodoFromForm(data: TodoFormData): Todo {
  return {
    id: generateId(),
    title: data.title,
    detail: data.detail,
    category: data.category,
    priority: data.priority,
    deadline: data.deadline,
    dueTime: data.dueTime ?? '',
    completed: false,
    repeat: data.repeat,
    archived: false,
  }
}
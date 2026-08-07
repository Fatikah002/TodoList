import { z } from 'zod'

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const todoSchema = z.object({
  title: z.string().min(1, 'Todo must not be empty'),
  detail: z.string(),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['High', 'Medium', 'Low', 'None']),
  deadline: z
    .string()
    .min(1, 'Deadline is required')
    .refine((value) => value >= getTodayDateString(), {
      message: 'Deadline must be today or later',
    }),
  dueTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format HH:MM')
    .optional()
    .or(z.literal('')),
  repeat: z.enum(['none', 'daily', 'weekly', 'monthly']),
})

export type TodoFormData = z.infer<typeof todoSchema>

function createFieldValidator<T>(schema: z.ZodType<T>) {
  return ({ value }: { value: T }) => {
    const result = schema.safeParse(value)

    if (!result.success) {
      return result.error.issues[0].message
    }

    return undefined
  }
}

export const todoFieldValidators = {
  title: createFieldValidator(todoSchema.shape.title),
  category: createFieldValidator(todoSchema.shape.category),
  deadline: createFieldValidator(todoSchema.shape.deadline),
}

export const todosSearchSchema = z.object({
  view: z.enum(['today', 'all']).optional().default('today'),
  status: z.enum(['all', 'completed', 'pending', 'overdue']).optional().default('all'),
  priority: z.enum(['all', 'High', 'Medium', 'Low', 'None']).optional().default('all'),
  category: z.string().optional().default('All'),
  sort: z.enum(['none', 'deadline', 'priority', 'name']).optional().default('none'),
})

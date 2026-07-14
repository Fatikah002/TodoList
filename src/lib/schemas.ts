import { z } from 'zod'

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const todoSchema = z.object({
  title: z.string().min(1, 'Todo tidak boleh kosong'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  priority: z.enum(['High', 'Medium', 'Low', 'None']),
  deadline: z
    .string()
    .min(1, 'Deadline wajib diisi')
    .refine((value) => value >= getTodayDateString(), {
      message: 'Deadline harus hari ini atau setelahnya',
    }),
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




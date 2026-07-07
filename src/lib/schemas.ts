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
  deadline: z
    .string()
    .min(1, 'Deadline wajib diisi')
    .refine((value) => value >= getTodayDateString(), {
      message: 'Deadline harus hari ini atau setelahnya',
    }),
})

export type TodoFormData = z.infer<typeof todoSchema>

export const todoValidators = {
  onChange: ({ value }: { value: unknown }) => {
    const result = todoSchema.safeParse(value)

    if (!result.success) {
      return result.error.flatten().fieldErrors
    }

    return undefined
  },
}

export const todoFieldValidators = {
  title: ({ value }: { value: string }) => {
    const result = todoSchema.shape.title.safeParse(value)

    if (!result.success) {
      return result.error.issues[0].message
    }

    return undefined
  },
  category: ({ value }: { value: string }) => {
    const result = todoSchema.shape.category.safeParse(value)

    if (!result.success) {
      return result.error.issues[0].message
    }

    return undefined
  },
  deadline: ({ value }: { value: string }) => {
    const result = todoSchema.shape.deadline.safeParse(value)

    if (!result.success) {
      return result.error.issues[0].message
    }

    return undefined
  },
}
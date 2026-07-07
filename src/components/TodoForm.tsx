import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { todoFieldValidators, todoValidators } from '@/lib/schemas'
import { categories } from '@/lib/categories'
import { Label } from './ui/label'

type TodoFormProps = {
  onAddTodo: (data: {
    title: string
    category: string
    deadline: string
  }) => void
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [categoryOptions, setCategoryOptions] = useState(
    [...categories] as string[],
  )

  const today = new Date()
  const minDeadline = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const form = useForm({
    defaultValues: {
      title: '',
      category: '',
      deadline: '',
    },

    validators: {
      onChange: todoValidators.onChange,
    },

    onSubmit: async ({ value, formApi }) => {
      const category = value.category.trim()

      if (category && !categoryOptions.includes(category)) {
        setCategoryOptions((prevCategories) => [...prevCategories, category])
      }

      onAddTodo({
        title: value.title,
        category,
        deadline: value.deadline,
      })
      formApi.reset()
    },
  })

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: todoFieldValidators.title,
        }}
      >
        {(field) => {
          const showError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0

          return (
            <div className="flex flex-col gap-1">
              <Label>Title</Label>
              <Input
                placeholder="Add a new todo..."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={
                  showError ? 'border-red-500 focus-visible:ring-red-500' : ''
                }
              />

              {showError && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <form.Field
          name="category"
          validators={{
            onChange: todoFieldValidators.category,
          }}
        >
          {(field) => {
            const showError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0

            return (
              <div className="flex flex-col gap-1">
                <Label>Category</Label>   
                <Input
                  list="category-options"
                  placeholder="Add or choose category"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={
                    showError ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }
                />

                <datalist id="category-options">
                  {categoryOptions.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>

                {showError && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>

        <form.Field
          name="deadline"
          validators={{
            onChange: todoFieldValidators.deadline,
          }}
        >
          {(field) => {
            const showError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0

            return (
              <div className="flex flex-col gap-1">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={field.state.value}
                  min={minDeadline}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={
                    showError ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }
                />

                {showError && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>
      </div>

      <Button type="submit">Add Todo</Button>
    </form>
  )
}

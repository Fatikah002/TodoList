import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { todoFieldValidators } from '@/lib/schemas'
import { categories } from '@/lib/categories'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Todo, RepeatType } from '@/lib/types'

type TodoFormProps = {
  initialData?: {
    title: string
    detail: string
    category: string
    priority: Todo['priority']
    deadline: string
    repeat: RepeatType
  }
  submitLabel?: string
  showCancel?: boolean
  showPriority?: boolean
  showRepeat?: boolean
  onSubmit: (data: {
    title: string
    detail: string
    category: string
    priority: Todo['priority']
    deadline: string
    repeat: RepeatType
  }) => void
  onCancel?: () => void
}

export function TodoForm({
  onSubmit,
  initialData,
  submitLabel,
  showCancel,
  showPriority,
  showRepeat,
  onCancel,
}: TodoFormProps) {
  const [categoryOptions, setCategoryOptions] = useState([
    ...categories,
  ] as string[])

  const today = new Date()
  const minDeadline = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const form = useForm({
    defaultValues: {
      title: initialData?.title ?? '',
      detail: initialData?.detail ?? '',
      category: initialData?.category ?? '',
      priority: initialData?.priority ?? 'None',
      deadline: initialData?.deadline ?? '',
      repeat: initialData?.repeat ?? ('none' ),
    },

    onSubmit: async ({ value, formApi }) => {
      const category = value.category.trim()

      if (category && !categoryOptions.includes(category)) {
        setCategoryOptions((prevCategories) => [...prevCategories, category])
      }

      onSubmit({
        title: value.title,
        detail: value.detail,
        category: category,
        priority: value.priority,
        deadline: value.deadline,
        repeat: value.repeat,
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
                placeholder={
                  submitLabel === 'Save Changes'
                    ? 'Edit todo...'
                    : 'Add a new todo...'
                }
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
      <form.Field name="detail">
        {(field) => {
          const showError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0

          return (
            <div className="flex flex-col gap-1">
              <Label>Detail</Label>
              <Input
                placeholder="Enter todo detail"
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

      {showPriority && (
        <form.Field name="priority">
          {(field) => (
            <div className="flex flex-col gap-1">
              <Label>Priority</Label>

              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value ?? 'None')
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      )}

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

      {showRepeat && (
        <form.Field name="repeat">
          {(field) => (
            <div className="flex flex-col gap-1">
              <Label>Repeat</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as RepeatType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-green-500 text-white hover:bg-green-600"
        >
          {submitLabel ?? 'Add Todo'}
        </Button>

        {showCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

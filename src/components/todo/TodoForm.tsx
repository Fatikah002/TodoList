import { useForm } from '@tanstack/react-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { todoFieldValidators } from '@/lib/schemas'
import type { TodoFormData } from '@/lib/schemas'
import { categories } from '@/lib/categories'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { Combobox } from '@/components/ui/combobox'
import { STORAGE_KEYS } from '@/lib/constants'

function loadCustomCategories(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCustomCategories(cats: string[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(cats))
  } catch {
    // ignore storage errors
  }
}

type TodoFormProps = {
  initialData?: TodoFormData
  submitLabel?: string
  showCancel?: boolean
  showPriority?: boolean
  showRepeat?: boolean
  onSubmit: (data: TodoFormData) => void
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
  const [categoryOptions, setCategoryOptions] = useState<string[]>(() => [
    ...categories,
    ...loadCustomCategories().filter(
      (c) => !categories.includes(c as (typeof categories)[number]),
    ),
  ])

  useEffect(() => {
    const custom = categoryOptions.filter(
      (c) => !categories.includes(c as (typeof categories)[number]),
    )
    saveCustomCategories(custom)
  }, [categoryOptions])

  const form = useForm({
    defaultValues: {
      title: initialData?.title ?? '',
      detail: initialData?.detail ?? '',
      category: initialData?.category ?? '',
      priority: initialData?.priority ?? 'None',
      deadline: initialData?.deadline ?? '',
      dueTime: initialData?.dueTime ?? '',
      repeat: initialData?.repeat ?? 'none',
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
        dueTime: value.dueTime,
        repeat: value.repeat,
      })
      formApi.reset()
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
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
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder={
                    submitLabel === 'Save Changes'
                      ? 'Edit todo...'
                      : 'Add a new todo...'
                  }
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`h-10 pl-3 ${
                    showError ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                />
              </div>

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
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Detail 
            </Label>
            <textarea
              placeholder="Enter todo detail..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            />
          </div>
        )}
      </form.Field>

      {showPriority && (
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="priority">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">
                  Priority 
                </Label>
                <Combobox
                  value={field.state.value === 'None' ? '' : field.state.value}
                  onChange={(val) => field.setValue(val as never)}
                  options={['None', 'High', 'Medium', 'Low']}
                  placeholder="Select priority"
                  showAddOption={false}
                />
              </div>
            )}
          </form.Field>

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
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>{' '}
                  </Label>
                  <Combobox
                    value={field.state.value}
                    onChange={(val) => {
                      field.handleChange(val)
                      if (val && !categoryOptions.includes(val)) {
                        setCategoryOptions((prev) => [...prev, val])
                      }
                    }}
                    options={categoryOptions}
                    placeholder="Select category"
                    className={
                      showError
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
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
      )}

      <div className="grid grid-cols-2 gap-4">
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
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">
                  Deadline <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
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

        <form.Field name="dueTime">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                Due Time <span className="text-muted-foreground"></span>
              </Label>
              <TimePicker
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
              />
            </div>
          )}
        </form.Field>
      </div>

      {showRepeat && (
        <form.Field name="repeat">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Repeat</Label>
              <Combobox
                value={field.state.value}
                onChange={(val) => field.setValue(val as never)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                placeholder="Select repeat"
                showAddOption={false}
              />
            </div>
          )}
        </form.Field>
      )}

      <Button
        type="submit"
        className="h-11 w-full gap-2 bg-green-600 text-white hover:bg-green-700"
      >
        {submitLabel ?? 'Add Todo'}
      </Button>

      {showCancel && (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </form>
  )
}

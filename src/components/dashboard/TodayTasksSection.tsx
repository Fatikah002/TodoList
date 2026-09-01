import { Link } from '@tanstack/react-router'
import { ChevronRight, Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import type { Todo } from '@/lib/types'
import { format } from 'date-fns'
import { formatTime12 } from '@/lib/date'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'

type TodayTasksSectionProps = {
  todos: Todo[]
  onToggleTodo: (id: string) => void
  onAddTodo: (title: string) => void
}

function AddTaskInput({
  inputRef,
  value,
  onChange,
  onKeyDown,
  onBlur,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onBlur: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Plus className="h-4 w-4 shrink-0 text-green-500" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder="Type a task title..."
        className="h-10 border-0 bg-transparent  md:text-sm font-medium focus-visible:ring-0"
      />
    </div>
  )
}

function AddTaskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium text-green-500 transition-colors hover:text-green-600"
    >
      <Plus className="h-4 w-4 shrink-0" />
      <span>Add a Task</span>
    </button>
  )
}

export function TodayTasksSection({
  todos,
  onToggleTodo,
  onAddTodo,
}: TodayTasksSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  function handleSubmit() {
    const trimmed = newTitle.trim()

    if (trimmed) {
      onAddTodo(trimmed)
      setNewTitle('')
      setIsAdding(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }

    if (e.key === 'Escape') {
      setNewTitle('')
      setIsAdding(false)
    }
  }

  const visibleTodos = useMemo(() => {
    return [...todos]
      .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))
      .slice(0, 5)
  }, [todos])

  return (
    <section className="flex  min-h-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white p-4 shadow-md">
      {/* Header */}
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 sm:text-base">
          Today's Tasks
        </h2>

        <Link
          to="/todos"
          search={
            {
              view: 'today',
              status: 'all',
              priority: 'all',
              category: 'All',
              sort: 'none',
            } as const
          }
          className="flex shrink-0 items-center gap-1 text-xs font-medium !text-green-600 transition-colors hover:text-green-700"
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col pl-1">
        {visibleTodos.length === 0 ? (
          <>
            {/* Add Task */}
            {isAdding ? (
              <AddTaskInput
                inputRef={inputRef}
                value={newTitle}
                onChange={setNewTitle}
                onKeyDown={handleKeyDown}
                onBlur={handleSubmit}
              />
            ) : (
              <AddTaskButton onClick={() => setIsAdding(true)} />
            )}

            {/* Empty State */}
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="text-sm font-medium text-gray-700">No tasks yet</p>
              <p className=" text-xs text-gray-400">
                Add a task to get started
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Task List */}
            <div className="space-y-1">
              {visibleTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex min-h-8 w-full items-center gap-2"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggleTodo(todo.id)}
                    className="h-4 w-4 shrink-0"
                  />

                  <p
                    className={`min-w-0 flex-1 truncate text-sm font-medium ${
                      todo.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-900'
                    }`}
                  >
                    {todo.title}
                  </p>

                  <p className="shrink-0 whitespace-nowrap text-[11px] text-gray-500">
                    {format(new Date(todo.deadline), 'dd MMM yyyy')}
                    {todo.dueTime && ` ${formatTime12(todo.dueTime)}`}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Task - di bawah task */}
            <div className="mt-2">
              {isAdding ? (
                <AddTaskInput
                  inputRef={inputRef}
                  value={newTitle}
                  onChange={setNewTitle}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSubmit}
                />
              ) : (
                <AddTaskButton onClick={() => setIsAdding(true)} />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

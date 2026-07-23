import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { TodoItem } from '@/components/TodoItem'
import { Button } from '@/components/ui/button'
import { useTodos } from '@/hooks/useTodos'
import { useState } from 'react'
import { ArrowLeft, ListChecks, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const Route = createFileRoute('/archived')({
  component: ArchivedPage,
})

function ArchivedPage() {
  const navigate = useNavigate()
  const { todos, restoreTodo, deletePermanently, deleteManyArchived } =
    useTodos()
  const archivedTodos = todos.filter((todo) => todo.archived)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showBulkDelete, setShowBulkDelete] = useState(false)

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <Card className="w-full rounded-3xl border-0 shadow-md">
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Archived</h1>
              <Button
                onClick={() => navigate({ to: '/todos', search: { view: 'today' } })}
                variant="outline"
                className="h-9 gap-1.5 rounded-full px-3"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
            </div>

            {selectMode ? (
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectMode(false)
                    setSelectedIds([])
                  }}
                >
                  Cancel
                </Button>
                <p className="text-sm font-medium text-muted-foreground">
                  {selectedIds.length} item selected
                </p>
                <Button
                  variant="destructive"
                  disabled={selectedIds.length === 0}
                  onClick={() => setShowBulkDelete(true)}
                >
                  <Trash size={16} className="mr-1" />
                  Delete Permanently
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectMode(true)}
                  className="h-11 gap-1.5 rounded-xl px-3"
                >
                  <ListChecks size={16} />
                  Select
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {archivedTodos.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No archived todos
                </p>
              ) : (
                archivedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={() => {}}
                    onToggle={() => {}}
                    onUpdate={() => {}}
                    onRestore={restoreTodo}
                    onDeletePermanent={deletePermanently}
                    selectMode={selectMode}
                    isSelected={selectedIds.includes(todo.id)}
                    onToggleSelect={(id) =>
                      setSelectedIds((prev) =>
                        prev.includes(id)
                          ? prev.filter((x) => x !== id)
                          : [...prev, id],
                      )
                    }
                    archivedView={true}
                  />
                ))
              )}
            </div>

            <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Permanent</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete permanently{' '}
                    {selectedIds.length} item? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteManyArchived(selectedIds)
                      setSelectedIds([])
                      setSelectMode(false)
                      setShowBulkDelete(false)
                    }}
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { TodoForm } from './TodoForm'

type TodoDialogProps = {
  isOpen: boolean
  onClose: () => void
  onAddTodo: (data: {
    title: string
    category: string
    deadline: string
  }) => void
}
function TodoDialog({ isOpen, onClose, onAddTodo }: TodoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Todo</DialogTitle>
        </DialogHeader>

        <TodoForm
          onAddTodo={(data) => {
            onAddTodo(data)
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

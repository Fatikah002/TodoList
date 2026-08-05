import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Plus, X, Check, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type TodosHeaderProps = {
  showAllTasks: boolean
  showForm: boolean
  onToggleForm: () => void
}

export function TodosHeader({
  showAllTasks,
  showForm,
  onToggleForm,
}: TodosHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="flex items-center gap-1.5 cursor-pointer text-lg font-bold text-gray-900 transition-colors">
            <h2>{showAllTasks ? 'All Tasks' : 'Today'}</h2>
            <ChevronDown className="h-5 w-5 text-gray-900 mt-1 " />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-40 rounded-2xl p-1.5 shadow-md"
        >
          <DropdownMenuItem
            onClick={() =>
              navigate({ to: '/todos', search: { view: 'today' } })
            }
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
              !showAllTasks ? 'bg-green-50 text-green-700 font-semibold' : ''
            }`}
          >
            <span>Today</span>
            {!showAllTasks && <Check className="h-4 w-4 text-green-300" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate({ to: '/todos', search: { view: 'all' } })}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
              showAllTasks ? 'bg-green-50 text-green-700 font-semibold' : ''
            }`}
          >
            <span>All Tasks</span>
            {showAllTasks && <Check className="h-4 w-4 text-green-300" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2">
        <Button
          onClick={onToggleForm}
          className="h-9 w-18 rounded-full bg-green-600 hover:bg-green-700"
        >
          {showForm ? (
            <X size={18} />
          ) : (
            <>
              <Plus size={18} /> <span>Add</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

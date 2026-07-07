import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">To Do List</h1>
      <p className="mt-4 text-lg">Add your first todo item!</p>
    </div>
  )
}

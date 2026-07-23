import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  )
}

import { Loader2, Check } from 'lucide-react'

interface AuthStatusViewProps {
  status: 'loading' | 'success'
  isCreatingAccount: boolean
}

export function AuthStatusView({ status, isCreatingAccount }: AuthStatusViewProps) {
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center py-8">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        <p className="mt-4 text-base font-semibold text-slate-900">
          Please wait...
        </p>
        <p className="mt-1 text-[13px] text-slate-500">
          {isCreatingAccount
            ? 'Creating your account'
            : 'Logging you in'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-600/25">
        <Check className="h-7 w-7 text-white" strokeWidth={3} />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">
        {isCreatingAccount
          ? 'Account created!'
          : 'Login successful!'}
      </h2>
      <p className="mt-1 text-[13px] text-slate-500">
        {isCreatingAccount
          ? 'Welcome to TodoSpace.'
          : 'Welcome back to TodoSpace.'}
      </p>
      <div className="mt-5 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-green-600"
          style={{ animation: 'progress 1.5s ease-out forwards' }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Redirecting to your dashboard...
      </p>
    </div>
  )
}

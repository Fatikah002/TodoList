import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeViewProps {
  onLogin: () => void
  onSignup: () => void
}

export function WelcomeView({ onLogin, onSignup }: WelcomeViewProps) {
  return (
    <>
      <p className="text-xs font-bold tracking-[0.16em] text-green-600 uppercase">
        Your daily workspace
      </p>
      <h1 className="mt-3 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
        Get more done with a calmer plan.
      </h1>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-slate-500 sm:text-sm">
        Organize your tasks, stay productive, and achieve more every day.
      </p>
      <Button
        onClick={onLogin}
        className="mt-6 h-10 w-full rounded-xl bg-green-600 font-semibold text-white shadow-md shadow-green-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 active:translate-y-0 sm:h-12"
      >
        Login
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Button>
      <Button
        variant="outline"
        onClick={onSignup}
        className="mt-2 h-10 w-full rounded-xl border-slate-200 font-semibold text-slate-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700 sm:h-12"
      >
        Create Account
      </Button>
    </>
  )
}

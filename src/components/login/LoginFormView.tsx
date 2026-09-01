import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface LoginFormViewProps {
  email: string
  password: string
  showPassword: boolean
  error: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
  onSubmit: () => void
  onSwitchToSignup: () => void
}

export function LoginFormView({
  email,
  password,
  showPassword,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onSwitchToSignup,
}: LoginFormViewProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 sm:text-2xl">
        Login to your Account
      </h2>

      <form
        className="mt-7 space-y-4 sm:space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="space-y-1.5 sm:space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-12 rounded-xl border-slate-200 bg-white pl-4 focus-visible:ring-green-500 sm:pl-11 md:text-sm"
            autoFocus
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`h-12 rounded-xl border-slate-200 bg-white pr-11 focus-visible:ring-green-500 sm:pl-11 md:text-sm ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={() => toast.info('Password reset is not available yet.')}
            className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl bg-green-600 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 active:translate-y-0"
        >
          Sign in
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">or sign in with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => toast.info('Google sign-in is not available yet.')}
            className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
          >
            <img src="/google.png" alt="Google" className="h-5 w-5" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info('Apple sign-in is not available yet.')}
            className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
          >
            <img src="/apple.png" alt="Apple" className="h-5 w-5" />
            <span>Apple</span>
          </button>
        </div>

        <p className="pt-2 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-semibold text-green-600 hover:text-green-700 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </>
  )
}

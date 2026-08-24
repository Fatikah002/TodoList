import { Eye, EyeOff, User, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface SignupFormViewProps {
  username: string
  email: string
  password: string
  confirmPassword: string
  showPassword: boolean
  error: string
  onUsernameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onTogglePassword: () => void
  onSubmit: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onSwitchToLogin: () => void
}

export function SignupFormView({
  username,
  email,
  password,
  confirmPassword,
  showPassword,
  error,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onSubmit,
  onKeyDown,
  onSwitchToLogin,
}: SignupFormViewProps) {
  const isEmailValid = email.includes('@')

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 sm:text-2xl">
        Create your Account
      </h2>

      <div className="mt-7 space-y-4 sm:space-y-5" onKeyDown={onKeyDown}>
        <div className="space-y-1.5 sm:space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              className="h-12 rounded-xl border-slate-200 bg-white pr-10 pl-4 text-sm focus-visible:ring-green-500 sm:pl-11 sm:text-sm"
              autoFocus
            />
            <User className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className={`h-12 rounded-xl border-slate-200 bg-white pr-10 pl-4 text-sm focus-visible:ring-green-500 sm:pl-11 sm:text-sm ${isEmailValid ? 'border-green-500' : ''}`}
            />
            {isEmailValid && (
              <Check className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            )}
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`h-12 rounded-xl border-slate-200 bg-white pr-11 pl-4 text-sm focus-visible:ring-green-500 sm:pl-11 sm:text-sm ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
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
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              className={`h-12 rounded-xl border-slate-200 bg-white pr-11 pl-4 text-sm focus-visible:ring-green-500 sm:pl-11 sm:text-sm ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <Button
          onClick={onSubmit}
          className="mt-2 h-12 w-full rounded-xl bg-green-600 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 active:translate-y-0"
        >
          Sign Up
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">
              or sign up with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => toast.info('Google sign-up is not available yet.')}
            className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
          >
            <img src="/google.png" alt="Google" className="h-5 w-5" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info('Apple sign-up is not available yet.')}
            className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
          >
            <img src="/apple.png" alt="Apple" className="h-5 w-5" />
            <span>Apple</span>
          </button>
        </div>

        <p className="pt-2 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-green-600 hover:text-green-700 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </>
  )
}

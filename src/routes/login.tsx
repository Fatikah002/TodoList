import { useState, useCallback, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { STORAGE_KEYS } from '@/lib/constants'
import { toast } from 'sonner'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type LoginView = 'welcome' | 'form' | 'loading' | 'success'

function LoginIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[200px] sm:max-w-[220px] lg:mx-0 lg:max-w-[260px]">
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-green-100 opacity-50 lg:-left-8 lg:-top-8 lg:h-28 lg:w-28" />
      <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-green-50 opacity-70 lg:-bottom-5 lg:-right-5 lg:h-24 lg:w-24" />
      <img src="/notelist.svg" alt="Organize your tasks" className="relative w-full" />
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<LoginView>('welcome')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true'
    if (isLoggedIn) {
      navigate({ to: '/dashboard', search: { view: 'dashboard' }, replace: true })
    }
  }, [navigate])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  const handleLogin = useCallback(() => {
    setError('')
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setView('loading')

    const t1 = window.setTimeout(() => {
      setView('success')
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true')
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)

      const t2 = window.setTimeout(() => {
        navigate({ to: '/dashboard', search: { view: 'dashboard' }, replace: true })
      }, 1500)
      timersRef.current.push(t2)
    }, 1500)
    timersRef.current.push(t1)
  }, [email, password, navigate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && view === 'form') {
        handleLogin()
      }
    },
    [view, handleLogin],
  )

  const goBack = useCallback(() => {
    setView('welcome')
    setError('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
  }, [])

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white lg:flex-row">
      {/* ===== Left Panel - Branding + Illustration ===== */}
      <div className="relative flex w-full flex-col items-center bg-gradient-to-b from-green-50/80 to-white p-6 pt-10 sm:p-10 sm:pt-14 lg:w-5/12 lg:items-start lg:justify-center lg:p-16 lg:from-green-50/60">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5 sm:mb-10 lg:mb-0 lg:absolute lg:left-12 lg:top-8">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
            <img src="/logo.png" alt="TodoSpace" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-green-600">Todo</span>
            <span className="text-slate-800">Space</span>
          </span>
        </div>

        {/* Illustration */}
        <div className="w-full max-w-[180px] sm:max-w-[200px] lg:mt-12 lg:max-w-[240px]">
          <LoginIllustration />
        </div>

        {/* Desktop tagline */}
        <p className="mt-8 hidden text-center text-sm text-slate-400 lg:block lg:text-left">
          Your tasks. Your progress. Your space.
        </p>
      </div>

      {/* ===== Right Panel - Form ===== */}
      <div className="flex w-full flex-col lg:w-7/12 lg:items-center lg:justify-center lg:bg-slate-50/50">
        {/* Back button - mobile only */}
        {view === 'form' && (
          <div className="flex items-center px-6 py-4 sm:px-10 sm:py-6 lg:hidden">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Content wrapper - centered */}
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:w-full lg:max-w-md lg:px-0">
          {/* Desktop card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8 lg:p-10">
            <div key={view} className="animate-slide-fade">
              {/* Back button - desktop only */}
              {view === 'form' && (
                <button
                  onClick={goBack}
                  className="mb-5 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}

              {/* ===== Welcome View ===== */}
              {view === 'welcome' && (
                <>
                  <h1 className="text-[22px] font-bold leading-snug text-slate-900 sm:text-2xl">
                    Welcome to
                    <br />
                    <span className="text-2xl sm:text-3xl">TodoSpace</span>
                  </h1>
                  <p className="mt-2.5 max-w-sm text-[13px] leading-relaxed text-slate-500 sm:text-sm">
                    Organize your tasks, stay productive, and achieve more every day.
                  </p>
                  <Button
                    onClick={() => setView('form')}
                    className="mt-7 h-11 w-full rounded-xl bg-green-600 font-semibold text-white shadow-md shadow-green-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 active:translate-y-0 sm:h-12"
                  >
                    Login
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="mt-2.5 h-11 w-full rounded-xl border-slate-200 font-semibold text-slate-400 sm:h-12 cursor-not-allowed"
                  >
                    Create Account
                  </Button>
                </>
              )}

              {/* ===== Form View ===== */}
              {view === 'form' && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Welcome back!
                  </h2>
                  <p className="mt-1.5 text-[13px] text-slate-500 sm:text-sm">
                    Login to continue to your account.
                  </p>

                  <div className="mt-6 space-y-3.5 sm:mt-7" onKeyDown={handleKeyDown}>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-700">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="youremail@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-10 pl-10 text-[13px] sm:h-11"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[13px] font-medium text-slate-700">Password</label>
                        <button
                          type="button"
                          onClick={() => toast.info('Password reset is not available yet.')}
                          className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`h-10 pl-10 pr-10 text-[13px] sm:h-11 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {error && (
                        <p className="text-xs text-red-500">{error}</p>
                      )}
                    </div>

                    {/* Login Button */}
                    <Button
                      onClick={handleLogin}
                      className="mt-1 h-11 w-full rounded-xl bg-green-600 font-semibold text-white shadow-md shadow-green-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 active:translate-y-0 sm:h-12"
                    >
                      Login
                    </Button>

                    {/* Sign up link */}
                    <p className="pt-2 text-center text-[13px] text-slate-500">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => toast.info('Registration is not available yet.')}
                        className="font-semibold text-green-600 hover:text-green-700 hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* ===== Loading View ===== */}
              {view === 'loading' && (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                  <p className="mt-5 text-base font-semibold text-slate-900">Please wait...</p>
                  <p className="mt-1 text-[13px] text-slate-500">Logging you in</p>
                </div>
              )}

              {/* ===== Success View ===== */}
              {view === 'success' && (
                <div className="flex flex-col items-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-600/25">
                    <Check className="h-8 w-8 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-900">Login successful!</h2>
                  <p className="mt-1.5 text-[13px] text-slate-500">Welcome back to TodoSpace.</p>
                  <div className="mt-6 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-green-600"
                      style={{ animation: 'progress 1.5s ease-out forwards' }}
                    />
                  </div>
                  <p className="mt-2.5 text-xs text-slate-400">Redirecting to your dashboard...</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile footer tagline */}
          <p className="mt-6 text-center text-[11px] text-slate-400 lg:hidden">
            Your tasks. Your progress. Your space.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, useCallback, useEffect } from 'react'
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

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type LoginView = 'welcome' | 'form' | 'loading' | 'success'

function LoginPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<LoginView>('welcome')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('todospace_logged_in') === 'true'
    if (isLoggedIn) {
      navigate({ to: '/dashboard', search: { view: 'dashboard' }, replace: true })
    }
  }, [navigate])

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
    setTimeout(() => {
      setView('success')
      localStorage.setItem('todospace_logged_in', 'true')
      localStorage.setItem('todospace_user_email', email)
      setTimeout(() => {
        navigate({ to: '/dashboard', search: { view: 'dashboard' }, replace: true })
      }, 1500)
    }, 1500)
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

  const Illustration = () => (
    <div className="relative mx-auto w-full max-w-[200px] sm:max-w-[220px] lg:mx-0 lg:max-w-[260px]">
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-green-100 opacity-50 lg:-left-8 lg:-top-8 lg:h-28 lg:w-28" />
      <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-green-50 opacity-70 lg:-bottom-5 lg:-right-5 lg:h-24 lg:w-24" />
      <img src="/notelist.svg" alt="Organize your tasks" className="relative w-full" />
    </div>
  )

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
          <Illustration />
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
                    className="mt-2.5 h-11 w-full rounded-xl border-slate-200 font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 sm:h-12"
                  >
                    Create Account
                  </Button>
                </>
              )}

              {/* ===== Form View ===== */}
              {view === 'form' && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Welcome back! 👋
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
                        <a
                          href="#"
                          className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
                        >
                          Forgot password?
                        </a>
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

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 border-t border-slate-200" />
                      <span className="text-[11px] font-medium text-slate-400">or continue with</span>
                      <div className="flex-1 border-t border-slate-200" />
                    </div>

                    {/* Social Login */}
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-slate-200 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:h-11 sm:w-11"
                      >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-slate-200 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:h-11 sm:w-11"
                      >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-slate-200 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:h-11 sm:w-11"
                      >
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>

                    {/* Sign up link */}
                    <p className="pt-2 text-center text-[13px] text-slate-500">
                      Don&apos;t have an account?{' '}
                      <a
                        href="#"
                        className="font-semibold text-green-600 hover:text-green-700 hover:underline"
                        onClick={(e) => {
                          e.preventDefault()
                          setView('form')
                        }}
                      >
                        Sign up
                      </a>
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

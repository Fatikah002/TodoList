import { useState, useCallback, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { STORAGE_KEYS } from '@/lib/constants'
import { hashPassword } from '@/lib/utils'
import { LoginFormView } from '@/components/login/LoginFormView'
import { SignupFormView } from '@/components/login/SignupFormView'
import { AuthStatusView } from '@/components/login/AuthStatusView'
import { useProfile } from '@/hooks/useProfile'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type LoginView = 'form' | 'signup' | 'loading' | 'success'

type Account = { email: string; password: string; username: string }

function loadAccounts(): Account[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveAccounts(accounts: Account[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(accounts))
  } catch {
    // ignore storage errors
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const { updateProfile } = useProfile()
  const [view, setView] = useState<LoginView>('form')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true'
    if (isLoggedIn) {
      navigate({
        to: '/dashboard',
        search: { view: 'dashboard' },
        replace: true,
      })
    }
  }, [navigate])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  const isSignUp = view === 'signup'

  const handleAuth = useCallback(async () => {
    setError('')
    if (isSignUp && !username.trim()) {
      setError('Username must not be empty.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const hashedPassword = await hashPassword(password)

    if (!isSignUp) {
      const accounts = loadAccounts()
      const account = accounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase(),
      )
      if (!account) {
        setError('Account not found. Please sign up first.')
        return
      }
      if (account.password !== hashedPassword) {
        setError('Incorrect password. Please try again.')
        return
      }
    }

    setIsCreatingAccount(isSignUp)
    setView('loading')

    const t1 = window.setTimeout(() => {
      setView('success')
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true')
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)
      window.dispatchEvent(new Event('email-changed'))

      if (isSignUp) {
        const accounts = loadAccounts()
        accounts.push({ email, password: hashedPassword, username: username.trim() })
        saveAccounts(accounts)
        updateProfile({ name: username.trim(), email })
      } else {
        const accounts = loadAccounts()
        const account = accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase(),
        )
        if (account) {
          updateProfile({ name: account.username, email: account.email })
        }
      }

      const t2 = window.setTimeout(() => {
        navigate({
          to: '/dashboard',
          search: { view: 'dashboard' },
          replace: true,
        })
      }, 1500)
      timersRef.current.push(t2)
    }, 1500)
    timersRef.current.push(t1)
  }, [
    confirmPassword,
    email,
    isSignUp,
    navigate,
    password,
    updateProfile,
    username,
  ])

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center bg-[#f8fbf9]  px-8 py-8  overflow-hidden sm:h-dvh sm:overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl" />
      </div>

      {/* Desktop logo - top left */}
      <div className="pointer-events-none absolute left-6 top-6 hidden items-center gap-2.5 sm:flex sm:pointer-events-auto">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
          <img
            src="/logo.png"
            alt="TodoSpace"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-green-600">Todo</span>
          <span className="text-slate-800">Space</span>
        </span>
      </div>

      <div className="relative w-full max-w-md">
        {/* Mobile logo */}
        <div className="relative -top-10 mb-8 flex flex-col items-center sm:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
              <img
                src="/logo.png"
                alt="TodoSpace"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-green-600">Todo</span>
              <span className="text-slate-800">Space</span>
            </span>
          </div>
        </div>

        {/* Card - desktop only */}
        <div className="rounded-3xl border border-transparent bg-transparent p-0 shadow-none sm:border-slate-200/60 sm:bg-white/90 sm:backdrop-blur-sm sm:p-10 sm:shadow-[0_18px_48px_rgba(15,69,40,0.08)]">
          <div key={view} className="animate-slide-fade">
            {view === 'form' && (
              <LoginFormView
                email={email}
                password={password}
                showPassword={showPassword}
                error={error}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleAuth}
                onSwitchToSignup={() => {
                  setError('')
                  setView('signup')
                }}
              />
            )}

            {view === 'signup' && (
              <SignupFormView
                username={username}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                showPassword={showPassword}
                error={error}
                onUsernameChange={setUsername}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleAuth}
                onSwitchToLogin={() => {
                  setError('')
                  setView('form')
                }}
              />
            )}

            {(view === 'loading' || view === 'success') && (
              <AuthStatusView
                status={view}
                isCreatingAccount={isCreatingAccount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

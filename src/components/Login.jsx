import { useState } from 'react'
import './Login.css'

const USERS_KEY = 'expenseTrackerUsers'
const LEGACY_USER_KEY = 'expenseTrackerUser'

const getSavedUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY))
    if (Array.isArray(users)) return users
  } catch {
    // fallback below
  }

  // Backward compatibility for existing single account
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_USER_KEY))
    if (legacy && legacy.username) return [legacy]
  } catch {
    // ignore
  }

  return []
}

const Login = ({ onLogin, onSignup, onForgotPassword }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const triggerError = message => {
    setError(message)
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (isSubmitting) return

    setError('')

    const users = getSavedUsers()

    if (users.length === 0) {
      triggerError('No accounts found. Please create an account first.')
      return
    }

    const matchedUser = users.find(
      user =>
        user.username.toLowerCase() === username.trim().toLowerCase() &&
        user.password === password,
    )

    if (matchedUser) {
      setIsSubmitting(true)
      setTimeout(() => {
        onLogin(matchedUser.username)
      }, 450)
      return
    }

    triggerError('Invalid username or password.')
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand-mark">₹</div>
        <span className="eyebrow">EXPENSE TRACKER</span>
        <h1>Your money.<br />Your clarity.</h1>
        <p>
          Track income, manage expenses, and keep every transaction in one
          simple dashboard.
        </p>
        <div className="visual-stat">
          <span>✦</span>
          <div>
            <strong>Simple & secure</strong>
            <small>Your data stays in this browser.</small>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className={`auth-card ${isShaking ? 'auth-shake' : ''}`}>
          <div className="mobile-brand">₹</div>
          <span className="auth-kicker">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="auth-subtitle">
            Enter your details to continue to your dashboard.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={event => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
              required
            />

            <div className="label-with-action">
              <label htmlFor="login-password">Password</label>
              {onForgotPassword && (
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={onForgotPassword}
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="password-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className={`auth-submit ${isSubmitting ? 'submitting' : ''}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span>Signing in...</span>
                  <span className="spinner" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            New to Expense Tracker?
            <button type="button" onClick={onSignup} disabled={isSubmitting}>
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login

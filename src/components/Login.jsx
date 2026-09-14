import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Login.css'

const Login = ({ onLogin, onSignup, onForgotPassword }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (isSubmitting) return

    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError('Please enter your email address.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

      if (loginError) {
        setError('Invalid email or password.')
        return
      }

      if (!data.user) {
        setError('Unable to sign in. Please try again.')
        return
      }

      /*
       * Supabase has authenticated the user.
       * App.jsx will use this user ID to load
       * the user's transactions.
       */
      onLogin(data.user)
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img className="brand-mark" src="/rupeewise-icon.png" alt="RupeeWise" />

        <span className="eyebrow">RUPEEWISE</span>

        <h1>
          Take control
          <br />
          of your money.
        </h1>

        <p>
          Track your income, expenses and spending habits in one
          simple place.
        </p>

        <div className="visual-stat">
          <span>✓</span>

          <div>
            <strong>Your finances, organized</strong>
            <small>
              Your data stays connected to your account.
            </small>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <img className="mobile-brand" src="/rupeewise-icon.png" alt="RupeeWise" />

          <span className="auth-kicker">WELCOME BACK</span>

          <h2>Sign in</h2>

          <p className="auth-subtitle">
            Sign in to continue managing your finances.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              required
            />

            <label htmlFor="login-password">Password</label>

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
                onClick={() =>
                  setShowPassword(prev => !prev)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
                title={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

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

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-submit"
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
            Don't have an account?

            <button
              type="button"
              onClick={onSignup}
              disabled={isSubmitting}
            >
              Create account
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
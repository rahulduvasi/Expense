import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Signup.css'

const Signup = ({ onSignup, onLogin }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (isSubmitting) return

    setError('')

    const cleanUsername = username.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanUsername.length < 3) {
      setError('Username must contain at least 3 characters.')
      return
    }

    if (!cleanEmail) {
      setError('Please enter your email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
          },
        },
      })

      if (signupError) {
        if (
          signupError.message.toLowerCase().includes('already registered') ||
          signupError.message.toLowerCase().includes('already exists')
        ) {
          setError('This email is already registered. Please sign in.')
        } else {
          setError(signupError.message)
        }

        return
      }

      if (!data.user) {
        setError('Account could not be created. Please try again.')
        return
      }

      // Supabase trigger creates the profile automatically.
      onSignup()
    } catch (err) {
      console.error('Signup error:', err)
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
          Build better
          <br />
          money habits.
        </h1>

        <p>
          Create your account and get a clean, modern view of your finances
          from day one.
        </p>

        <div className="visual-stat">
          <span>✓</span>

          <div>
            <strong>Ready in seconds</strong>
            <small>Start adding transactions right away.</small>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <img className="mobile-brand" src="/rupeewise-icon.png" alt="RupeeWise" />

          <span className="auth-kicker">GET STARTED</span>

          <h2>Create your account</h2>

          <p className="auth-subtitle">
            Set up your account before entering the dashboard.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="signup-username">Username</label>

            <input
              id="signup-username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={event => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
              required
            />

            <label htmlFor="signup-email">Email</label>

            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              required
            />

            <label htmlFor="signup-password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                disabled={isSubmitting}
                required
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
                title={showPassword ? 'Hide password' : 'Show password'}
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

            <label htmlFor="signup-confirm-password">
              Confirm password
            </label>

            <div className="password-input-wrapper">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() =>
                  setShowConfirmPassword(prev => !prev)
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
                title={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
                disabled={isSubmitting}
              >
                {showConfirmPassword ? (
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
                  <span>Creating account...</span>
                  <span className="spinner" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?

            <button
              type="button"
              onClick={onLogin}
              disabled={isSubmitting}
            >
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Signup
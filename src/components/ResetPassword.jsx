import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './ResetPassword.css'

const ResetPassword = ({ onComplete, onBackToLogin }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (isSubmitting) return

    setError('')

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
      const { error: updateError } =
        await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message)
        return
      }

      await supabase.auth.signOut()
      onComplete()
    } catch (err) {
      console.error('Password update error:', err)
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
          Create a new
          <br />
          secure password.
        </h1>

        <p>
          Choose a password you will remember. Your account and
          financial activity will remain connected to your RupeeWise
          account.
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <img className="mobile-brand" src="/rupeewise-icon.png" alt="RupeeWise" />

          <span className="auth-kicker">PASSWORD RECOVERY</span>

          <h2>Set new password</h2>

          <p className="auth-subtitle">
            Enter your new password below to secure your account.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="reset-password">New password</label>

            <div className="password-input-wrapper">
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(previous => !previous)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                disabled={isSubmitting}
              >
                {showPassword ? '◉' : '◌'}
              </button>
            </div>

            <label htmlFor="reset-confirm-password">
              Confirm new password
            </label>

            <div className="password-input-wrapper">
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your new password"
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
                  setShowConfirmPassword(previous => !previous)
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
                {showConfirmPassword ? '◉' : '◌'}
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
              {isSubmitting ? 'Updating password...' : 'Update password'}
            </button>
          </form>

          <p className="auth-switch">
            Remember your password?

            <button
              type="button"
              onClick={onBackToLogin}
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

export default ResetPassword

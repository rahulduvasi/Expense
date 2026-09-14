import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './ForgotPassword.css'

const ForgotPassword = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (isSubmitting) return

    setError('')
    setMessage('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError('Please enter your email address.')
      return
    }

    setIsSubmitting(true)

    try {
      const redirectUrl =
        import.meta.env.VITE_SUPABASE_PASSWORD_RESET_REDIRECT_URL ||
        `${window.location.origin}/reset-password`

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: redirectUrl,
          },
        )

      if (resetError) {
        setError(resetError.message)
        return
      }

      setMessage(
        'If an account exists with this email, a password reset link has been sent.',
      )
    } catch (err) {
      console.error('Password reset error:', err)
      setError(
        'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img className="brand-mark" src="/rupeewise-icon.png" alt="RupeeWise" />

        <span className="eyebrow">
          RUPEEWISE
        </span>

        <h1>
          Get back
          <br />
          into your account.
        </h1>

        <p>
          Enter the email address connected to your
          account and we'll send you a secure password
          reset link.
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <img className="mobile-brand" src="/rupeewise-icon.png" alt="RupeeWise" />

          <span className="auth-kicker">
            PASSWORD RECOVERY
          </span>

          <h2>Forgot password?</h2>

          <p className="auth-subtitle">
            We'll send you a secure link to create a
            new password.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="forgot-email">
              Email
            </label>

            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={event =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              disabled={isSubmitting}
              required
            />

            {error && (
              <p
                className="auth-error"
                role="alert"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                className="auth-success"
                role="status"
              >
                {message}
              </p>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Sending...'
                : 'Send reset link'}
            </button>
          </form>

          <p className="auth-switch">
            Remember your password?

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

export default ForgotPassword
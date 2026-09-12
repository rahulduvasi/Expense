import { useState } from 'react'
import './ForgotPassword.css'

const USERS_KEY = 'expenseTrackerUsers'
const LEGACY_USER_KEY = 'expenseTrackerUser'

const getSavedUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY))
    if (Array.isArray(users)) return users
  } catch {
    // fallback
  }

  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_USER_KEY))
    if (legacy && legacy.username) return [legacy]
  } catch {
    // ignore
  }

  return []
}

const ForgotPassword = ({ onLogin }) => {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [matchedUser, setMatchedUser] = useState(null)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  const triggerError = message => {
    setError(message)
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleVerifyUsername = event => {
    event.preventDefault()
    setError('')

    const cleanUsername = username.trim()
    if (!cleanUsername) {
      triggerError('Please enter your username.')
      return
    }

    const users = getSavedUsers()
    const found = users.find(
      u => u.username.toLowerCase() === cleanUsername.toLowerCase(),
    )

    if (!found) {
      triggerError('No account found with this username.')
      return
    }

    setMatchedUser(found)
    setStep(2)
  }

  const handleVerifySecurityAnswer = event => {
    event.preventDefault()
    setError('')

    const cleanAnswer = securityAnswer.trim().toLowerCase()
    if (!cleanAnswer) {
      triggerError('Please enter your security answer.')
      return
    }

    const expectedAnswer = (matchedUser.securityAnswer || '').trim().toLowerCase()

    // If legacy user without security question/answer stored
    if (matchedUser.securityAnswer && cleanAnswer !== expectedAnswer) {
      triggerError('Incorrect security answer. Please try again.')
      return
    }

    setStep(3)
  }

  const handleResetPassword = event => {
    event.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      triggerError('Password must contain at least 6 characters.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      triggerError('Passwords do not match.')
      return
    }

    const users = getSavedUsers()
    const updatedUsers = users.map(u => {
      if (u.username.toLowerCase() === matchedUser.username.toLowerCase()) {
        return {
          ...u,
          password: newPassword,
        }
      }
      return u
    })

    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
    setStep(4)
  }

  const activeQuestion =
    matchedUser?.securityQuestion || "What is your pet's name?"

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand-mark">₹</div>
        <span className="eyebrow">EXPENSE TRACKER</span>
        <h1>Account<br />recovery.</h1>
        <p>
          Reset your password securely using your registered security question.
        </p>
        <div className="visual-stat">
          <span>🔒</span>
          <div>
            <strong>Password Protection</strong>
            <small>Verify your identity to restore access.</small>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className={`auth-card ${isShaking ? 'auth-shake' : ''}`}>
          <div className="mobile-brand">₹</div>
          <span className="auth-kicker">PASSWORD RESET</span>

          {step === 1 && (
            <>
              <h2>Find your account</h2>
              <p className="auth-subtitle">
                Enter your username to begin password recovery.
              </p>

              <form onSubmit={handleVerifyUsername} noValidate>
                <label htmlFor="forgot-username">Username</label>
                <input
                  id="forgot-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />

                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                <button className="auth-submit" type="submit">
                  <span>Continue</span>
                  <span>→</span>
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Security Question</h2>
              <p className="auth-subtitle">
                Answer your security question for account <strong>@{matchedUser.username}</strong>
              </p>

              <form onSubmit={handleVerifySecurityAnswer} noValidate>
                <div className="security-question-box">
                  <span className="question-label">Security Question:</span>
                  <p className="question-text">{activeQuestion}</p>
                </div>

                <label htmlFor="security-answer">Your Answer</label>
                <input
                  id="security-answer"
                  type="text"
                  placeholder="Enter your security answer"
                  value={securityAnswer}
                  onChange={e => setSecurityAnswer(e.target.value)}
                  autoComplete="off"
                  required
                />

                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                <button className="auth-submit" type="submit">
                  <span>Verify Answer</span>
                  <span>→</span>
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Set New Password</h2>
              <p className="auth-subtitle">
                Choose a strong new password for <strong>@{matchedUser.username}</strong>
              </p>

              <form onSubmit={handleResetPassword} noValidate>
                <label htmlFor="new-password">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
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

                <label htmlFor="confirm-new-password">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
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

                <button className="auth-submit" type="submit">
                  <span>Reset Password</span>
                  <span>✓</span>
                </button>
              </form>
            </>
          )}

          {step === 4 && (
            <div className="reset-success-card">
              <div className="success-icon">✓</div>
              <h2>Password Updated!</h2>
              <p className="auth-subtitle">
                Your password has been reset successfully. You can now log in with your new credentials.
              </p>
              <button
                className="auth-submit"
                type="button"
                onClick={onLogin}
              >
                <span>Back to Sign In</span>
                <span>→</span>
              </button>
            </div>
          )}

          {step < 4 && (
            <p className="auth-switch">
              Remember your password?
              <button type="button" onClick={onLogin}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default ForgotPassword

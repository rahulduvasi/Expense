import { useState } from 'react'
import { SECURITY_QUESTIONS } from '../constants/securityQuestions'
import './Signup.css'

const USERS_KEY = 'expenseTrackerUsers'

const getSavedUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY))
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

const Signup = ({ onSignup, onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0])
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    setError('')

    const cleanUsername = username.trim()
    const cleanAnswer = securityAnswer.trim()

    if (cleanUsername.length < 3) {
      setError('Username must contain at least 3 characters.')
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

    if (!cleanAnswer) {
      setError('Please provide an answer to your security question.')
      return
    }

    const users = getSavedUsers()
    const isUsernameTaken = users.some(
      user => user.username.toLowerCase() === cleanUsername.toLowerCase(),
    )

    if (isUsernameTaken) {
      setError('This username is already taken. Please choose another or sign in.')
      return
    }

    const updatedUsers = [
      ...users,
      {
        username: cleanUsername,
        password,
        securityQuestion,
        securityAnswer: cleanAnswer,
      },
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))

    onSignup()
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand-mark">₹</div>
        <span className="eyebrow">EXPENSE TRACKER</span>
        <h1>Build better<br />money habits.</h1>
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
          <div className="mobile-brand">₹</div>
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

            <label htmlFor="signup-confirm-password">Confirm password</label>
            <div className="password-input-wrapper">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
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

            <label htmlFor="signup-security-question">Security Question</label>
            <select
              id="signup-security-question"
              className="security-question-select"
              value={securityQuestion}
              onChange={event => setSecurityQuestion(event.target.value)}
              required
            >
              {SECURITY_QUESTIONS.map(q => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>

            <label htmlFor="signup-security-answer">Security Answer</label>
            <input
              id="signup-security-answer"
              type="text"
              placeholder="Your secret answer (used for password reset)"
              value={securityAnswer}
              onChange={event => setSecurityAnswer(event.target.value)}
              autoComplete="off"
              required
            />

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button className="auth-submit" type="submit">
              Create account <span>→</span>
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <button type="button" onClick={onLogin}>
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Signup

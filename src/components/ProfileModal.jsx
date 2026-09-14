import './ProfileModal.css'

const ProfileModal = ({
  isOpen,
  onClose,
  username,
  transactionsCount,
  totalIncome,
  totalExpense,
  balance,
  onLogout,
}) => {
  if (!isOpen) return null

  const formatCurrency = value => `₹${value.toLocaleString('en-IN')}`

  const initial = username ? username.charAt(0).toUpperCase() : 'U'

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <div className="profile-modal" onClick={event => event.stopPropagation()}>
        <div className="modal-header">
          <span className="section-kicker">ACCOUNT INFORMATION</span>
          <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="profile-hero">
            <div className="profile-avatar-large">{initial}</div>
            <div className="profile-hero-info">
              <h2 id="profile-title">Hi, {username}! 👋</h2>
              <span className="profile-badge">● Cloud Account</span>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <span className="stat-label">Total Transactions</span>
              <strong className="stat-value">{transactionsCount}</strong>
            </div>

            <div className="profile-stat-card balance">
              <span className="stat-label">Current Balance</span>
              <strong className={`stat-value ${balance >= 0 ? 'income' : 'expense'}`}>
                {formatCurrency(balance)}
              </strong>
            </div>

            <div className="profile-stat-card income">
              <span className="stat-label">Total Income</span>
              <strong className="stat-value income">+{formatCurrency(totalIncome)}</strong>
            </div>

            <div className="profile-stat-card expense">
              <span className="stat-label">Total Expense</span>
              <strong className="stat-value expense">-{formatCurrency(totalExpense)}</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="danger-btn"
            onClick={() => {
              onClose()
              onLogout()
            }}
          >
            Logout Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal

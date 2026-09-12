const SummaryCards = ({ balance, income, expense }) => {
  const formatCurrency = value => `₹${value.toLocaleString('en-IN')}`

  const savingsPercent =
    income > 0 ? Math.max(0, Math.min(100, Math.round((balance / income) * 100))) : 0
  const expensePercent =
    income > 0 ? Math.max(0, Math.min(100, Math.round((expense / income) * 100))) : 0

  const getHealthBadge = () => {
    if (income === 0 && expense === 0) return { label: 'Getting Started', class: 'neutral' }
    if (savingsPercent >= 50) return { label: 'Excellent Savings 🌟', class: 'excellent' }
    if (savingsPercent >= 20) return { label: 'Healthy Balance 👍', class: 'good' }
    if (balance >= 0) return { label: 'Tight Budget ⚠️', class: 'warning' }
    return { label: 'Over Budget 🚨', class: 'danger' }
  }

  const health = getHealthBadge()

  return (
    <div className="summary-section">
      <section className="summary-grid" aria-label="Financial summary">
        <article className="summary-card balance-card">
          <div className="card-icon">₹</div>
          <div className="card-content">
            <p>Total Balance</p>
            <h2>{formatCurrency(balance)}</h2>
            <span className="card-note">Income minus expenses</span>
          </div>
          <div className="card-glow" />
        </article>

        <article className="summary-card income-card">
          <div className="card-icon">↗</div>
          <div className="card-content">
            <p>Total Income</p>
            <h2>{formatCurrency(income)}</h2>
            <span className="card-note">Money coming in</span>
          </div>
          <div className="card-glow" />
        </article>

        <article className="summary-card expense-card">
          <div className="card-icon">↘</div>
          <div className="card-content">
            <p>Total Expense</p>
            <h2>{formatCurrency(expense)}</h2>
            <span className="card-note">Money going out</span>
          </div>
          <div className="card-glow" />
        </article>
      </section>

      {income > 0 && (
        <div className="financial-health-card">
          <div className="health-header">
            <div className="health-title">
              <span className="health-icon">📊</span>
              <div>
                <strong>Financial Health Overview</strong>
                <small>Savings rate: {savingsPercent}% of income saved</small>
              </div>
            </div>
            <span className={`health-pill ${health.class}`}>
              {health.label}
            </span>
          </div>

          <div className="progress-bar-container" title={`${expensePercent}% spent, ${savingsPercent}% saved`}>
            <div
              className="progress-bar-fill income-fill"
              style={{ width: `${savingsPercent}%` }}
            />
            <div
              className="progress-bar-fill expense-fill"
              style={{ width: `${expensePercent}%` }}
            />
          </div>
          <div className="progress-legend">
            <span><i className="legend-dot income-dot" /> Saved ({savingsPercent}%)</span>
            <span><i className="legend-dot expense-dot" /> Spent ({expensePercent}%)</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryCards


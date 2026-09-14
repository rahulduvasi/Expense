const CATEGORY_ICONS = {
  Food: '🍕',
  Travel: '✈️',
  Shopping: '🛍️',
  Rent: '🏠',
  Salary: '💰',
  Entertainment: '🎬',
  Bills: '⚡',
  Health: '🏥',
  Other: '📌',
}

const TransactionList = ({
  transactions,
  totalTransactions,
  incomeCount = 0,
  expenseCount = 0,
  filterType = 'all',
  setFilterType,
  timeFilter = 'all',
  setTimeFilter,
  calendarDate = '',
  setCalendarDate,
  onDelete,
  onClearAll,
  onClearIncome,
  onClearExpense,
  search,
  setSearch,
}) => {
  const formatCurrency = value => `₹${value.toLocaleString('en-IN')}`
  const todayIso = new Date().toISOString().split('T')[0]

  const confirmAndClearAll = () => {
    if (totalTransactions === 0) return
    if (window.confirm('Are you sure you want to delete ALL transactions?')) {
      onClearAll()
    }
  }

  const confirmAndClearIncome = () => {
    if (incomeCount === 0) return
    if (window.confirm('Are you sure you want to delete all INCOME transactions?')) {
      onClearIncome()
    }
  }

  const confirmAndClearExpense = () => {
    if (expenseCount === 0) return
    if (window.confirm('Are you sure you want to delete all EXPENSE transactions?')) {
      onClearExpense()
    }
  }

  return (
    <section className="list-card" id="transactions" aria-labelledby="transactions-title">
      <div className="list-header">
        <div>
          <span className="section-kicker">HISTORY</span>
          <h2 id="transactions-title">Previous transactions</h2>
          <p>
            {totalTransactions === 0
              ? 'Your transaction history will appear here.'
              : `${totalTransactions} saved transaction${totalTransactions === 1 ? '' : 's'}`}
          </p>
        </div>

        <label className="search-wrapper" htmlFor="transaction-search">
          <span aria-hidden="true">⌕</span>
          <input
            id="transaction-search"
            className="search"
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="time-filter-bar">
        <span className="time-filter-label">Filter Period:</span>
        <div className="time-tabs">
          <button
            type="button"
            className={`time-tab ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => {
              if (setTimeFilter) setTimeFilter('all')
              if (setCalendarDate) setCalendarDate('')
            }}
          >
            🌐 All Time
          </button>
          <button
            type="button"
            className={`time-tab ${timeFilter === 'week' ? 'active' : ''}`}
            onClick={() => {
              if (setTimeFilter) setTimeFilter('week')
              if (setCalendarDate) setCalendarDate('')
            }}
          >
            📅 This Week
          </button>
          <button
            type="button"
            className={`time-tab ${timeFilter === 'month' ? 'active' : ''}`}
            onClick={() => {
              if (setTimeFilter) setTimeFilter('month')
              if (setCalendarDate) setCalendarDate('')
            }}
          >
            🗓️ This Month
          </button>
          <div className={`calendar-picker-wrapper ${timeFilter === 'custom' ? 'active' : ''}`}>
            <span className="calendar-icon">📆</span>
            <input
              type="date"
              className="calendar-date-input"
              value={calendarDate}
              max={todayIso}
              onChange={e => {
                if (setCalendarDate) setCalendarDate(e.target.value)
                if (setTimeFilter) setTimeFilter(e.target.value ? 'custom' : 'all')
              }}
              title="Pick a specific calendar date"
            />
          </div>
        </div>
      </div>

      <div className="list-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Transaction type filter">
          <button
            type="button"
            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All <span className="badge">{totalTransactions}</span>
          </button>
          <button
            type="button"
            className={`filter-tab income-tab ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => setFilterType('income')}
          >
            Income <span className="badge">{incomeCount}</span>
          </button>
          <button
            type="button"
            className={`filter-tab expense-tab ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => setFilterType('expense')}
          >
            Expense <span className="badge">{expenseCount}</span>
          </button>
        </div>

        {totalTransactions > 0 && (
          <div className="clear-actions">
            <button
              type="button"
              className="clear-btn clear-all-btn"
              onClick={confirmAndClearAll}
              title="Delete all transactions"
            >
              Clear All
            </button>
            {incomeCount > 0 && (
              <button
                type="button"
                className="clear-btn clear-income-btn"
                onClick={confirmAndClearIncome}
                title="Delete all income transactions"
              >
                Clear Income
              </button>
            )}
            {expenseCount > 0 && (
              <button
                type="button"
                className="clear-btn clear-expense-btn"
                onClick={confirmAndClearExpense}
                title="Delete all expense transactions"
              >
                Clear Expense
              </button>
            )}
          </div>
        )}
      </div>

      <div className="transactions">
        {transactions.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">⌁</div>
            <h3>
              {search || filterType !== 'all'
                ? 'No matching transactions'
                : 'No transactions yet'}
            </h3>
            <p>
              {search || filterType !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'Add your first transaction using the form.'}
            </p>
          </div>
        ) : (
          transactions.map((transaction, index) => {
            const categoryEmoji = CATEGORY_ICONS[transaction.category] || '📌'
            return (
              <article
                className="transaction transaction-animated"
                key={transaction.id}
                style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              >
                <div className="transaction-left">
                  <div
                    className={`transaction-icon ${transaction.type === 'income'
                      ? 'transaction-income'
                      : 'transaction-expense'
                      }`}
                    aria-hidden="true"
                  >
                    <span>{categoryEmoji}</span>
                  </div>

                  <div className="transaction-info">
                    <h3>{transaction.description}</h3>
                    <p>
                      <span className="category-pill">{transaction.category}</span>
                      <span className="dot-separator">•</span>
                      <span>{transaction.date}</span>
                    </p>
                  </div>
                </div>

                <div className="transaction-right">
                  <strong
                    className={
                      transaction.type === 'income' ? 'income' : 'expense'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </strong>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => onDelete(transaction.id)}
                    aria-label={`Delete ${transaction.description}`}
                    title="Delete transaction"
                  >
                    ×
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default TransactionList

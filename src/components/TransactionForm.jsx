import { useState } from 'react'

const getTodayIso = () => new Date().toISOString().split('T')[0]

const TransactionForm = ({ onAdd }) => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(getTodayIso())
  const [error, setError] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    setError('')

    const numericAmount = Number(amount)

    if (!description.trim()) {
      setError('Please enter a description.')
      return
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Please enter an amount greater than zero.')
      return
    }

    const selectedDateObj = date ? new Date(date + 'T00:00:00') : new Date()

    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      description: description.trim(),
      amount: numericAmount,
      type,
      category,
      isoDate: date || getTodayIso(),
      date: selectedDateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    })

    setDescription('')
    setAmount('')
    setType('expense')
    setCategory('Food')
    setDate(getTodayIso())
  }

  return (
    <section className="form-card" aria-labelledby="add-transaction-title">
      <div className="section-title">
        <div>
          <span className="section-kicker">QUICK ENTRY</span>
          <h2 id="add-transaction-title">Add transaction</h2>
        </div>
        <span className="plus-icon" aria-hidden="true">+</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          placeholder="e.g. Grocery shopping"
          value={description}
          onChange={event => setDescription(event.target.value)}
          maxLength={80}
          required
        />

        <label htmlFor="amount">Amount</label>
        <div className="amount-input">
          <span>₹</span>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={event => setAmount(event.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <span className="form-label">Type</span>
        <div className="type-boxes" role="radiogroup" aria-label="Transaction Type">
          <button
            type="button"
            className={`type-box expense-box ${type === 'expense' ? 'selected' : ''}`}
            onClick={() => setType('expense')}
            aria-checked={type === 'expense'}
            role="radio"
          >
            <span className="type-icon">↘</span>
            <span>Expense</span>
          </button>
          <button
            type="button"
            className={`type-box income-box ${type === 'income' ? 'selected' : ''}`}
            onClick={() => setType('income')}
            aria-checked={type === 'income'}
            role="radio"
          >
            <span className="type-icon">↗</span>
            <span>Income</span>
          </button>
        </div>

        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={event => setCategory(event.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Rent</option>
          <option>Salary</option>
          <option>Entertainment</option>
          <option>Bills</option>
          <option>Health</option>
          <option>Other</option>
        </select>

        <label htmlFor="transaction-date">Date</label>
        <input
          id="transaction-date"
          type="date"
          value={date}
          max={getTodayIso()}
          onChange={event => setDate(event.target.value)}
          required
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="add-btn">
          <span>+</span> Add transaction
        </button>
      </form>
    </section>
  )
}

export default TransactionForm

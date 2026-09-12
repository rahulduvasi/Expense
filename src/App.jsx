import { useEffect, useMemo, useState } from 'react'

import Login from './components/Login'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import ProfileModal from './components/ProfileModal'

import './App.css'

const USERS_KEY = 'expenseTrackerUsers'
const LEGACY_USER_KEY = 'expenseTrackerUser'
const THEME_KEY = 'expenseTrackerTheme'
const SESSION_KEY = 'expenseTrackerSession'

const hasAnyUser = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY))
    if (Array.isArray(users) && users.length > 0) return true
  } catch {
    // fallback
  }

  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_USER_KEY))
    if (legacy && legacy.username) return true
  } catch {
    // ignore
  }

  return false
}

const getSavedSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

const getSavedTransactions = username => {
  if (!username) return []

  try {
    const saved = JSON.parse(
      localStorage.getItem(`expenseTrackerTransactions_${username}`),
    )
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const App = () => {
  const initialSession = getSavedSession()

  const [currentUser, setCurrentUser] = useState(initialSession)
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialSession?.username))
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [transactions, setTransactions] = useState(() =>
    initialSession?.username ? getSavedTransactions(initialSession.username) : [],
  )
  const [page, setPage] = useState(() =>
    initialSession ? 'dashboard' : hasAnyUser() ? 'login' : 'signup',
  )
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || 'light',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.title = isLoggedIn
      ? 'Dashboard | Expense Tracker'
      : 'Expense Tracker'

    localStorage.setItem(THEME_KEY, theme)
  }, [theme, isLoggedIn])

  useEffect(() => {
    if (!currentUser?.username) return

    localStorage.setItem(
      `expenseTrackerTransactions_${currentUser.username}`,
      JSON.stringify(transactions),
    )
  }, [transactions, currentUser])

  const handleSignup = () => {
    setPage('login')
  }

  const handleLogin = username => {
    const session = { username }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setCurrentUser(session)
    setTransactions(getSavedTransactions(username))
    setSearch('')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setIsLoggedIn(false)
    setCurrentUser(null)
    setTransactions([])
    setSearch('')
    setPage('login')
  }

  const [filterType, setFilterType] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [calendarDate, setCalendarDate] = useState('')

  const handleAddTransaction = transaction => {
    setTransactions(previous => [transaction, ...previous])
  }

  const handleDeleteTransaction = id => {
    setTransactions(previous =>
      previous.filter(transaction => transaction.id !== id),
    )
  }

  const handleClearAll = () => {
    setTransactions([])
  }

  const handleClearIncome = () => {
    setTransactions(previous =>
      previous.filter(transaction => transaction.type !== 'income'),
    )
  }

  const handleClearExpense = () => {
    setTransactions(previous =>
      previous.filter(transaction => transaction.type !== 'expense'),
    )
  }

  const getTransactionDate = t => {
    if (t.isoDate) return new Date(t.isoDate + 'T00:00:00')
    const parsed = Date.parse(t.date)
    if (!isNaN(parsed)) return new Date(parsed)
    return new Date()
  }

  const isThisWeek = date => {
    const now = new Date()
    const startOfWeek = new Date(now)
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return date >= startOfWeek && date <= endOfWeek
  }

  const isThisMonth = date => {
    const now = new Date()
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return transactions.filter(transaction => {
      const matchesType =
        filterType === 'all' || transaction.type === filterType

      if (!matchesType) return false

      const tDate = getTransactionDate(transaction)

      if (timeFilter === 'week') {
        if (!isThisWeek(tDate)) return false
      } else if (timeFilter === 'month') {
        if (!isThisMonth(tDate)) return false
      } else if (timeFilter === 'custom' && calendarDate) {
        const tIso = transaction.isoDate || tDate.toISOString().split('T')[0]
        if (tIso !== calendarDate) return false
      }

      if (!query) return true

      return [transaction.description, transaction.category, transaction.type, transaction.date].some(
        value => value.toLowerCase().includes(query),
      )
    })
  }, [transactions, search, filterType, timeFilter, calendarDate])

  const counts = useMemo(
    () =>
      transactions.reduce(
        (acc, t) => {
          if (t.type === 'income') acc.income += 1
          else acc.expense += 1
          return acc
        },
        { income: 0, expense: 0 },
      ),
    [transactions],
  )

  const totals = useMemo(
    () =>
      transactions.reduce(
        (result, transaction) => {
          if (transaction.type === 'income') {
            result.income += transaction.amount
          } else {
            result.expense += transaction.amount
          }

          return result
        },
        { income: 0, expense: 0 },
      ),
    [transactions],
  )

  const balance = totals.income - totals.expense

  const toggleTheme = () => {
    setTheme(previous => (previous === 'light' ? 'dark' : 'light'))
  }

  if (!isLoggedIn) {
    if (page === 'signup') {
      return (
        <Signup
          onSignup={handleSignup}
          onLogin={() => setPage('login')}
        />
      )
    }

    if (page === 'forgot-password') {
      return (
        <ForgotPassword
          onLogin={() => setPage('login')}
        />
      )
    }

    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setPage('signup')}
        onForgotPassword={() => setPage('forgot-password')}
      />
    )
  }

  return (
    <div className="app">
      <Header
        username={currentUser?.username || ''}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="dashboard" id="dashboard">
        <section className="welcome-section">
          <div>
            <span className="eyebrow">PERSONAL FINANCE</span>
            <h1
              className="welcome-title-interactive"
              onClick={() => setIsProfileOpen(true)}
              title="Click to view account details"
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setIsProfileOpen(true)}
            >
              Hi {currentUser?.username} 👋
            </h1>
            <p>Keep your spending organized and your goals on track.</p>
          </div>
          <div
            className="transaction-count clickable"
            onClick={() => setIsProfileOpen(true)}
            title="Click to view account details"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setIsProfileOpen(true)}
          >
            <strong>{transactions.length}</strong>
            <span>Total transactions</span>
          </div>
        </section>

        <SummaryCards
          balance={balance}
          income={totals.income}
          expense={totals.expense}
        />

        <section className="content-grid">
          <TransactionForm onAdd={handleAddTransaction} />
          <TransactionList
            transactions={filteredTransactions}
            totalTransactions={transactions.length}
            incomeCount={counts.income}
            expenseCount={counts.expense}
            filterType={filterType}
            setFilterType={setFilterType}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            calendarDate={calendarDate}
            setCalendarDate={setCalendarDate}
            onDelete={handleDeleteTransaction}
            onClearAll={handleClearAll}
            onClearIncome={handleClearIncome}
            onClearExpense={handleClearExpense}
            search={search}
            setSearch={setSearch}
          />
        </section>
      </main>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        username={currentUser?.username || ''}
        transactionsCount={transactions.length}
        totalIncome={totals.income}
        totalExpense={totals.expense}
        balance={balance}
        onLogout={handleLogout}
      />
    </div>
  )
}

export default App

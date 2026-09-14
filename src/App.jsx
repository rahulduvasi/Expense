import { useEffect, useMemo, useState } from 'react'

import { supabase } from './lib/supabase'

import Login from './components/Login'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import ProfileModal from './components/ProfileModal'

import './App.css'

const THEME_KEY = 'expenseTrackerTheme'

const App = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const [transactions, setTransactions] = useState([])

  const [page, setPage] = useState('login')

  const [search, setSearch] = useState('')

  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || 'light',
  )

  const [filterType, setFilterType] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [calendarDate, setCalendarDate] = useState('')

  /*
   * --------------------------------------------------
   * LOAD USER PROFILE
   * --------------------------------------------------
   */

  const loadProfile = async user => {
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Failed to load profile:', error)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      username: data.username,
    }
  }

  /*
   * --------------------------------------------------
   * LOAD TRANSACTIONS
   * --------------------------------------------------
   */

  const loadTransactions = async userId => {
    if (!userId) return []

    const { data, error } = await supabase
      .from('transactions')
      .select(
        'id, user_id, description, amount, type, category, transaction_date, created_at',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load transactions:', error)
      return []
    }

    return (data || []).map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      isoDate: transaction.transaction_date,
      date: new Date(
        `${transaction.transaction_date}T00:00:00`,
      ).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }))
  }

  /*
   * --------------------------------------------------
   * INITIAL AUTH SESSION
   * --------------------------------------------------
   */

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      const recoveryUrl = `${window.location.hash}${window.location.search}`
      const recoveryRequested =
        recoveryUrl.includes('type=recovery') ||
        window.location.search.includes('code=')

      if (session?.user) {
        if (recoveryRequested) {
          setIsPasswordRecovery(true)
          setIsLoggedIn(false)
          setCurrentUser(null)
          setTransactions([])
          setPage('reset-password')
          setIsLoadingSession(false)
          return
        }

        const profile = await loadProfile(session.user)

        if (!mounted) return

        if (profile) {
          setCurrentUser(profile)
          setIsLoggedIn(true)
          setPage('dashboard')

          const savedTransactions = await loadTransactions(
            session.user.id,
          )

          if (mounted) {
            setTransactions(savedTransactions)
          }
        } else {
          await supabase.auth.signOut()
        }
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
        setPage('login')
      }

      if (mounted) {
        setIsLoadingSession(false)
      }
    }

    initializeAuth()

    /*
     * Listen for Supabase login/logout events.
     */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true)
        setCurrentUser(null)
        setIsLoggedIn(false)
        setTransactions([])
        setPage('reset-password')
        return
      }

      if (!session?.user) {
        setIsPasswordRecovery(false)
        setCurrentUser(null)
        setIsLoggedIn(false)
        setTransactions([])
        setPage('login')
        return
      }

      // Supabase recommends keeping the auth-state callback lightweight.
      // Load the profile and transactions just after the event callback.
      setTimeout(async () => {
        if (!mounted) return

        const profile = await loadProfile(session.user)

        if (!mounted) return

        if (profile) {
          setIsPasswordRecovery(false)
          setCurrentUser(profile)
          setIsLoggedIn(true)

          const savedTransactions = await loadTransactions(
            session.user.id,
          )

          if (mounted) {
            setTransactions(savedTransactions)
            setPage('dashboard')
          }
        }
      }, 0)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  /*
   * --------------------------------------------------
   * THEME
   * --------------------------------------------------
   */

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)

    document.title = isLoggedIn
      ? 'Dashboard | RupeeWise'
      : 'RupeeWise'

    localStorage.setItem(THEME_KEY, theme)
  }, [theme, isLoggedIn])

  /*
   * --------------------------------------------------
   * SIGNUP
   * --------------------------------------------------
   */

  const handleSignup = () => {
    setIsPasswordRecovery(false)
    setPage('login')
  }

  const clearPasswordRecovery = () => {
    window.history.replaceState({}, document.title, window.location.pathname)
    setIsPasswordRecovery(false)
    setCurrentUser(null)
    setIsLoggedIn(false)
    setTransactions([])
    setPage('login')
  }

  /*
   * --------------------------------------------------
   * LOGIN
   * --------------------------------------------------
   */

  const handleLogin = async user => {
    const profile = await loadProfile(user)

    if (!profile) {
      console.error('Unable to load user profile.')
      return
    }

    setCurrentUser(profile)
    setIsLoggedIn(true)
    setSearch('')
    setPage('dashboard')

    const savedTransactions = await loadTransactions(user.id)

    setTransactions(savedTransactions)
  }

  /*
   * --------------------------------------------------
   * LOGOUT
   * --------------------------------------------------
   */

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return
    }

    setCurrentUser(null)
    setIsLoggedIn(false)
    setTransactions([])
    setSearch('')
    setPage('login')
  }

  /*
   * --------------------------------------------------
   * ADD TRANSACTION
   * --------------------------------------------------
   */

  const handleAddTransaction = async transaction => {
    if (!currentUser) return

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: currentUser.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        transaction_date:
          transaction.isoDate ||
          new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to add transaction:', error)
      return
    }

    const newTransaction = {
      id: data.id,
      description: data.description,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      isoDate: data.transaction_date,
      date: new Date(
        `${data.transaction_date}T00:00:00`,
      ).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }

    setTransactions(previous => [
      newTransaction,
      ...previous,
    ])
  }

  /*
   * --------------------------------------------------
   * DELETE TRANSACTION
   * --------------------------------------------------
   */

  const handleDeleteTransaction = async id => {
    if (!currentUser) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.id)

    if (error) {
      console.error('Failed to delete transaction:', error)
      return
    }

    setTransactions(previous =>
      previous.filter(transaction => transaction.id !== id),
    )
  }

  /*
   * --------------------------------------------------
   * CLEAR ALL
   * --------------------------------------------------
   */

  const handleClearAll = async () => {
    if (!currentUser) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', currentUser.id)

    if (error) {
      console.error('Failed to clear transactions:', error)
      return
    }

    setTransactions([])
  }

  /*
   * --------------------------------------------------
   * CLEAR INCOME
   * --------------------------------------------------
   */

  const handleClearIncome = async () => {
    if (!currentUser) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('type', 'income')

    if (error) {
      console.error('Failed to clear income:', error)
      return
    }

    setTransactions(previous =>
      previous.filter(transaction => transaction.type !== 'income'),
    )
  }

  /*
   * --------------------------------------------------
   * CLEAR EXPENSE
   * --------------------------------------------------
   */

  const handleClearExpense = async () => {
    if (!currentUser) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('type', 'expense')

    if (error) {
      console.error('Failed to clear expenses:', error)
      return
    }

    setTransactions(previous =>
      previous.filter(transaction => transaction.type !== 'expense'),
    )
  }

  /*
   * --------------------------------------------------
   * DATE HELPERS
   * --------------------------------------------------
   */

  const getTransactionDate = transaction => {
    if (transaction.isoDate) {
      return new Date(`${transaction.isoDate}T00:00:00`)
    }

    const parsed = Date.parse(transaction.date)

    if (!Number.isNaN(parsed)) {
      return new Date(parsed)
    }

    return new Date()
  }

  const isThisWeek = date => {
    const now = new Date()
    const startOfWeek = new Date(now)

    const day = now.getDay()

    const diff =
      now.getDate() - day + (day === 0 ? -6 : 1)

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

  /*
   * --------------------------------------------------
   * FILTER TRANSACTIONS
   * --------------------------------------------------
   */

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return transactions.filter(transaction => {
      const matchesType =
        filterType === 'all' ||
        transaction.type === filterType

      if (!matchesType) return false

      const transactionDate =
        getTransactionDate(transaction)

      if (timeFilter === 'week') {
        if (!isThisWeek(transactionDate)) return false
      }

      if (timeFilter === 'month') {
        if (!isThisMonth(transactionDate)) return false
      }

      if (timeFilter === 'custom' && calendarDate) {
        if (transaction.isoDate !== calendarDate) {
          return false
        }
      }

      if (!query) return true

      return [
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.date,
      ].some(value =>
        String(value).toLowerCase().includes(query),
      )
    })
  }, [
    transactions,
    search,
    filterType,
    timeFilter,
    calendarDate,
  ])

  /*
   * --------------------------------------------------
   * COUNTS
   * --------------------------------------------------
   */

  const counts = useMemo(
    () =>
      transactions.reduce(
        (result, transaction) => {
          if (transaction.type === 'income') {
            result.income += 1
          } else {
            result.expense += 1
          }

          return result
        },
        {
          income: 0,
          expense: 0,
        },
      ),
    [transactions],
  )

  /*
   * --------------------------------------------------
   * TOTALS
   * --------------------------------------------------
   */

  const totals = useMemo(
    () =>
      transactions.reduce(
        (result, transaction) => {
          const amount = Number(transaction.amount) || 0

          if (transaction.type === 'income') {
            result.income += amount
          } else {
            result.expense += amount
          }

          return result
        },
        {
          income: 0,
          expense: 0,
        },
      ),
    [transactions],
  )

  const balance =
    totals.income - totals.expense

  /*
   * --------------------------------------------------
   * THEME
   * --------------------------------------------------
   */

  const toggleTheme = () => {
    setTheme(previous =>
      previous === 'light' ? 'dark' : 'light',
    )
  }

  /*
   * --------------------------------------------------
   * SHOW LOADING WHILE SUPABASE CHECKS SESSION
   * --------------------------------------------------
   */

  if (isLoadingSession) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'inherit',
        }}
      >
        Loading...
      </div>
    )
  }

  /*
   * --------------------------------------------------
   * AUTH PAGES
   * --------------------------------------------------
   */

  if (isPasswordRecovery) {
    return (
      <ResetPassword
        onComplete={clearPasswordRecovery}
        onBackToLogin={async () => {
          await supabase.auth.signOut()
          clearPasswordRecovery()
        }}
      />
    )
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
        onForgotPassword={() =>
          setPage('forgot-password')
        }
      />
    )
  }

  /*
   * --------------------------------------------------
   * DASHBOARD
   * --------------------------------------------------
   */

  return (
    <div className="app">
      <Header
        username={currentUser?.username || ''}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        onOpenProfile={() =>
          setIsProfileOpen(true)
        }
      />

      <main className="dashboard" id="dashboard">
        <section className="welcome-section">
          <div>
            <span className="eyebrow">
              PERSONAL FINANCE
            </span>

            <h1
              className="welcome-title-interactive"
              onClick={() =>
                setIsProfileOpen(true)
              }
              title="Click to view account details"
              role="button"
              tabIndex={0}
              onKeyDown={event =>
                event.key === 'Enter' &&
                setIsProfileOpen(true)
              }
            >
              Hi {currentUser?.username} 👋
            </h1>

            <p>
              Keep your spending organized and your
              goals on track.
            </p>
          </div>

          <div
            className="transaction-count clickable"
            onClick={() =>
              setIsProfileOpen(true)
            }
            title="Click to view account details"
            role="button"
            tabIndex={0}
            onKeyDown={event =>
              event.key === 'Enter' &&
              setIsProfileOpen(true)
            }
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
          <TransactionForm
            onAdd={handleAddTransaction}
          />

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
        onClose={() =>
          setIsProfileOpen(false)
        }
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
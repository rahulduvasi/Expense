const Header = ({
  username,
  theme,
  onToggleTheme,
  onLogout,
  onOpenProfile,
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <a className="logo" href="#dashboard" aria-label="RupeeWise home">
          <img
            className="logo-icon"
            src="/rupeewise-icon.png"
            alt=""
            aria-hidden="true"
          />
          <span>
            <strong>RupeeWise</strong>
            <small>Personal Finance</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#dashboard">Dashboard</a>
          <a href="#transactions">Transactions</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            <span className="theme-label">
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
          </button>

          <button
            type="button"
            className="user-chip"
            onClick={onOpenProfile}
            title="Click to view profile details"
            aria-label="View profile details"
          >
            <span className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </span>
            <span className="user-name">{username}</span>
          </button>

          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

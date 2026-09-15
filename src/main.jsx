import {
  Component,
  StrictMode,
} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  supabaseConfigError,
} from './lib/supabase'

class StartupErrorBoundary extends Component {
  state = {
    error: null,
  }

  static getDerivedStateFromError(error) {
    return {
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      'RupeeWise startup error:',
      error,
      errorInfo,
    )
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          title="RupeeWise could not start"
          error={this.state.error}
        />
      )
    }

    return this.props.children
  }
}

function ErrorScreen({ title, error }) {
  const message =
    error instanceof Error
      ? error.message
      : String(error)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: '#0b0b0d',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: 'min(680px, 100%)',
          background: '#17171b',
          borderRadius: 20,
          padding: 24,
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ marginTop: 0 }}>
          {title}
        </h1>

        <p
          style={{
            color: '#ffb4ab',
            lineHeight: 1.5,
            overflowWrap: 'anywhere',
          }}
        >
          {message}
        </p>

        <p
          style={{
            color: '#c9c9cf',
            lineHeight: 1.5,
          }}
        >
          This diagnostic screen is temporary.
          Take a screenshot of this message and
          send it to me.
        </p>
      </div>
    </div>
  )
}

const rootElement =
  document.getElementById('root')

if (supabaseConfigError) {
  createRoot(rootElement).render(
    <ErrorScreen
      title="RupeeWise configuration error"
      error={supabaseConfigError}
    />,
  )
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <StartupErrorBoundary>
        <App />
      </StartupErrorBoundary>
    </StrictMode>,
  )
}

window.addEventListener(
  'error',
  event => {
    console.error(
      'RupeeWise window error:',
      event.error || event.message,
    )
  },
)

window.addEventListener(
  'unhandledrejection',
  event => {
    console.error(
      'RupeeWise unhandled rejection:',
      event.reason,
    )
  },
)
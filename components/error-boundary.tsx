'use client'

import React, { ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // You can also log to an error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-2xl max-w-md text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-xl bg-rose-500/10 text-rose-500">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-3 rounded mb-4 text-left max-h-32 overflow-y-auto">
                {this.state.error?.stack}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={this.handleReset}
                className="flex-1 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Error has been logged. Try refreshing the page.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
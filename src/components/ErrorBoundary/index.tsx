'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './styles.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
          <button 
            className={styles.retryButton}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
          <button 
            className={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary }; 
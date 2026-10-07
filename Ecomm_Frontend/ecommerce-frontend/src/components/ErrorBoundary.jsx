import React from 'react';
import { ErrorState } from './ui/DataFallback';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <ErrorState 
            title="Something went wrong"
            message="An unexpected error occurred in the application. Please try again."
            actionText="Reload Page"
            onAction={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

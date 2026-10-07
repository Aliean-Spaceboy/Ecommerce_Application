import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/DataFallback';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="container" style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <EmptyState 
        title="404 - Page Not Found"
        message="The page you are looking for doesn't exist or has been moved."
        actionText="Go Home"
        onAction={() => window.location.href = '/'}
      />
    </div>
  );
}

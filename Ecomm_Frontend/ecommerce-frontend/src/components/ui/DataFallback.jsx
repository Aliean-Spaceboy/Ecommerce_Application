import React from 'react';
import { Button } from './Button';

export const DataFallback = ({ title, message, actionText, onAction, type = 'empty' }) => {
  const isError = type === 'error';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-3xl) var(--space-md)',
      textAlign: 'center',
      backgroundColor: 'var(--color-card)',
      borderRadius: '12px',
      border: '1px dashed var(--color-border)'
    }}>
      <h3 style={{ color: isError ? 'var(--color-destructive)' : 'var(--color-primary)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-muted-foreground)', marginBottom: 'var(--space-lg)' }}>
        {message}
      </p>
      {actionText && onAction && (
        <Button variant={isError ? 'danger' : 'primary'} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = (props) => <DataFallback type="error" {...props} />;
export const EmptyState = (props) => <DataFallback type="empty" {...props} />;

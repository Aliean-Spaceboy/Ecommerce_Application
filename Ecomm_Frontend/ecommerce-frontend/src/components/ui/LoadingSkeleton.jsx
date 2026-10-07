import React from 'react';

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (key) => {
    switch (type) {
      case 'product-card':
        return (
          <div key={key} className="card animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--color-muted)', borderRadius: '8px' }}></div>
            <div style={{ width: '80%', height: '24px', backgroundColor: 'var(--color-muted)', borderRadius: '4px' }}></div>
            <div style={{ width: '40%', height: '20px', backgroundColor: 'var(--color-muted)', borderRadius: '4px' }}></div>
            <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--color-muted)', borderRadius: '8px', marginTop: 'auto' }}></div>
          </div>
        );
      case 'text':
        return <div key={key} className="animate-pulse" style={{ width: '100%', height: '16px', backgroundColor: 'var(--color-muted)', borderRadius: '4px', marginBottom: '8px' }}></div>;
      default:
        return <div key={key} className="animate-pulse card" style={{ width: '100%', height: '100px', backgroundColor: 'var(--color-muted)' }}></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};

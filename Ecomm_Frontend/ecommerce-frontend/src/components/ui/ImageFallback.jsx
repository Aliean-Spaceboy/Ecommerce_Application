import React, { useState } from 'react';

export const ImageFallback = ({ src, alt, fallbackSrc = 'https://via.placeholder.com/400x300?text=No+Image', className = '', style = {}, ...props }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`image-fallback-container ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--color-muted)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
      )}
      <img
        src={error ? fallbackSrc : (src || fallbackSrc)}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        {...props}
      />
    </div>
  );
};

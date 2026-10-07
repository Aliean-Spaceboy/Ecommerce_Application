import React from 'react';
import { Input } from './Input';

export const FormField = ({ label, id, error, className = '', ...inputProps }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <Input id={id} {...inputProps} />
      {error && <span className="text-sm" style={{ color: 'var(--color-destructive)', marginTop: 'var(--space-xs)' }}>{error}</span>}
    </div>
  );
};

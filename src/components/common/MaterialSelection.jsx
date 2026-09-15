import React from 'react';
import { Check } from '@phosphor-icons/react';

/**
 * Material Design 3 Switch (Toggle)
 */
export const MaterialSwitch = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  style = {},
}) => {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: '52px',
          height: '32px',
          borderRadius: 'var(--md-shape-full)',
          backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-background-surface)',
          border: checked ? 'none' : '2px solid var(--color-border-default)',
          position: 'relative',
          transition: 'all var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: checked ? '24px' : '16px',
            height: checked ? '24px' : '16px',
            borderRadius: '50%',
            backgroundColor: checked ? 'var(--color-text-on-primary)' : 'var(--color-text-secondary)',
            transform: checked ? 'translateX(22px)' : 'translateX(4px)',
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--md-elevation-1)',
          }}
        />
      </div>
      {label && (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </label>
  );
};

/**
 * Material Design 3 Checkbox
 */
export const MaterialCheckbox = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  style = {},
}) => {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: 'var(--md-shape-xs)',
          backgroundColor: checked ? 'var(--color-primary)' : 'transparent',
          border: checked ? '2px solid var(--color-primary)' : '2px solid var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
        }}
      >
        {checked && (
          <Check size={14} weight="bold" color="#FFFFFF" />
        )}
      </div>
      {label && (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
          {label}
        </span>
      )}
    </label>
  );
};

import React, { useState } from 'react';

/**
 * Material Design 3 Button Component (Flat / No Shadow style)
 * Supports variants: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'fab'
 * Disabled state: Background Slate 200 (#E2E8F0), Text Slate 500 (#64748B)
 */
export const MaterialButton = ({
  children,
  variant = 'filled',
  size = 'medium',
  icon: Icon,
  disabled = false,
  onClick,
  style = {},
  className = '',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (disabled) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  // Base styles
  let variantStyles = {};
  let rippleColor = 'rgba(255, 255, 255, 0.35)';

  if (disabled) {
    variantStyles = {
      backgroundColor: 'var(--color-disabled-bg)',    /* Slate 200 #E2E8F0 */
      color: 'var(--color-disabled-text)',            /* Slate 500 #64748B */
      border: 'none',
      boxShadow: 'none',
      cursor: 'not-allowed',
    };
  } else {
    switch (variant) {
      case 'filled':
        variantStyles = {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)',
          border: 'none',
          boxShadow: 'none',
        };
        rippleColor = 'rgba(255, 255, 255, 0.3)';
        break;
      case 'outlined':
        variantStyles = {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)',
          boxShadow: 'none',
        };
        rippleColor = 'rgba(5, 48, 121, 0.15)';
        break;
      case 'text':
        variantStyles = {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: 'none',
          boxShadow: 'none',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
        };
        rippleColor = 'rgba(5, 48, 121, 0.15)';
        break;
      case 'elevated':
        variantStyles = {
          backgroundColor: 'var(--color-background-surface)',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-border-default)',
          boxShadow: 'none',
        };
        rippleColor = 'rgba(5, 48, 121, 0.12)';
        break;
      case 'tonal':
        variantStyles = {
          backgroundColor: 'var(--color-selected-background)',
          color: 'var(--color-primary)',
          border: 'none',
          boxShadow: 'none',
        };
        rippleColor = 'rgba(5, 48, 121, 0.15)';
        break;
      case 'fab':
        variantStyles = {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'none',
          padding: '1rem',
          border: 'none',
        };
        rippleColor = 'rgba(255, 255, 255, 0.35)';
        break;
      default:
        break;
    }
  }

  const sizeStyles = {
    small: { height: '32px', padding: '0 0.875rem', fontSize: '0.8125rem' },
    medium: { height: '40px', padding: '0 1.25rem', fontSize: '0.875rem' },
    large: { height: '48px', padding: '0 1.5rem', fontSize: '1rem' },
  }[size] || { height: '40px', padding: '0 1.25rem', fontSize: '0.875rem' };

  return (
    <button
      onClick={createRipple}
      disabled={disabled}
      className={`md-ripple-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: variant === 'fab' ? 'var(--radius-md)' : 'var(--radius-sm)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        letterSpacing: '0.1px',
        boxShadow: 'none',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        ...sizeStyles,
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {Icon && <Icon size={size === 'small' ? 16 : 18} />}
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="md-ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </button>
  );
};

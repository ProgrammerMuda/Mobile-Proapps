import React, { useState } from 'react';

/**
 * Material Design 3 Outlined Text Field
 * Features floating label animation, helper text, leading/trailing icons,
 * and PROAPPS focus colors (#09B2FF).
 */
export const MaterialTextField = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error = false,
  errorMessage,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  type = 'text',
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';
  const isFloated = isFocused || hasValue;

  const borderColor = error
    ? 'var(--color-danger)'
    : isFocused
    ? 'var(--color-border-focus)'
    : 'var(--color-border-default)';

  const labelColor = error
    ? 'var(--color-danger)'
    : isFocused
    ? 'var(--color-primary)'
    : 'var(--color-text-secondary)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', ...style }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-background-surface)',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 'var(--md-shape-xs)',
          minHeight: '52px',
          padding: '0 12px',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          boxShadow: isFocused && !error ? '0 0 0 3px rgba(9, 178, 255, 0.18)' : 'none',
        }}
      >
        {LeadingIcon && (
          <div style={{ marginRight: '8px', color: 'var(--color-text-secondary)', display: 'flex' }}>
            <LeadingIcon size={20} />
          </div>
        )}

        <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          {label && (
            <label
              style={{
                position: 'absolute',
                left: 0,
                top: isFloated ? '4px' : '50%',
                transform: isFloated ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)',
                transformOrigin: 'top left',
                color: labelColor,
                fontSize: '1rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: isFloated ? 500 : 400,
                pointerEvents: 'none',
                transition: 'all var(--transition-fast)',
                zIndex: 1,
              }}
            >
              {label}
            </label>
          )}

          <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFloated ? placeholder : ''}
            className={className}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              padding: label ? (isFloated ? '16px 0 2px 0' : '8px 0') : '12px 0',
              fontSize: '0.9375rem',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
            }}
            {...props}
          />
        </div>

        {TrailingIcon && (
          <div style={{ marginLeft: '8px', color: 'var(--color-text-secondary)', display: 'flex' }}>
            <TrailingIcon size={20} />
          </div>
        )}
      </div>

      {(helperText || errorMessage) && (
        <span
          style={{
            fontSize: '0.75rem',
            paddingLeft: '12px',
            color: error ? 'var(--color-danger)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {error ? errorMessage : helperText}
        </span>
      )}
    </div>
  );
};

import React from 'react';

/**
 * Material Design 3 Card
 * Default padding: 16px (consistent mobile padding)
 */
export const MaterialCard = ({
  children,
  variant = 'elevated',
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  let cardStyles = {};

  switch (variant) {
    case 'elevated':
      cardStyles = {
        backgroundColor: 'var(--color-background-surface)',
        boxShadow: 'var(--md-elevation-1)',
        border: 'none',
      };
      break;
    case 'outlined':
      cardStyles = {
        backgroundColor: 'var(--color-background-surface)',
        border: '1px solid var(--color-border-default)',
        boxShadow: 'none',
      };
      break;
    case 'filled':
      cardStyles = {
        backgroundColor: 'var(--color-selected-background)',
        border: 'none',
        boxShadow: 'none',
      };
      break;
    default:
      break;
  }

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        borderRadius: 'var(--md-shape-md)',
        padding: '16px',
        color: 'var(--color-text-primary)',
        transition: 'box-shadow var(--transition-normal), transform var(--transition-fast)',
        cursor: onClick ? 'pointer' : 'default',
        ...cardStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

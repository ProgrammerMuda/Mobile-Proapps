import React from 'react';
import { Bell } from '@phosphor-icons/react';
import { LogoIcon } from '../common/Logo';

export * from './AndroidStatusBar';
export * from './AndroidGestureBar';
export * from './BottomNavigation';
export * from './AndroidMobileFrame';

/**
 * Android Top App Bar Header Component with Official PROAPPS Logo
 */
export const Header = ({ title = 'PROAPPS', onNotificationClick }) => (
  <header
    style={{
      padding: '0.75rem 1rem',
      backgroundColor: 'var(--color-background-surface)',
      borderBottom: '1px solid var(--color-border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
      <LogoIcon size={32} />
      <div>
        <h1
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.2px',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          Mobile UI System
        </span>
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--md-shape-full)',
          backgroundColor: 'var(--color-selected-background)',
          color: 'var(--color-primary)',
        }}
      >
        MVP
      </span>
      <button
        onClick={onNotificationClick}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bell size={18} weight="regular" />
      </button>
    </div>
  </header>
);

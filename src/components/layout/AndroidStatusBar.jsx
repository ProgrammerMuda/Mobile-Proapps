import React, { useState, useEffect } from 'react';
import { WifiHigh, CellSignalFull, BatteryFull } from '@phosphor-icons/react';

/**
 * Android Mobile Status Bar Component
 */
export const AndroidStatusBar = ({
  theme = 'light',
  isOverlay = false,
  backgroundColor = '#FFFFFF',
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  const isDark = theme === 'dark' || theme === 'dark-header';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.625rem 1.25rem 0.35rem',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: textColor,
        backgroundColor: isOverlay ? 'transparent' : backgroundColor,
        position: isOverlay ? 'absolute' : 'relative',
        top: isOverlay ? 0 : 'auto',
        left: isOverlay ? 0 : 'auto',
        right: isOverlay ? 0 : 'auto',
        userSelect: 'none',
        zIndex: 50,
        pointerEvents: 'none',
        textShadow: isDark ? '0 1px 4px rgba(0, 0, 0, 0.45)' : 'none',
        flexShrink: 0,
      }}
    >
      {/* Time */}
      <span>{time || '10:48'}</span>

      {/* Android Center Camera Punch Hole */}
      <div
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#000000',
          borderRadius: '50%',
          opacity: 0.9,
          boxShadow: isDark ? '0 0 0 1px rgba(255, 255, 255, 0.15)' : '0 0 0 1px rgba(0, 0, 0, 0.08)',
        }}
      />

      {/* Status Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <WifiHigh size={15} weight="bold" />
        <CellSignalFull size={15} weight="bold" />
        <BatteryFull size={18} weight="fill" />
      </div>
    </div>
  );
};

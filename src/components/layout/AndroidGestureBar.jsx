import React from 'react';

/**
 * Android Gesture Navigation Pill Indicator
 * Supports light (white bg + grey pill) and dark/transparent (transparent bg + white pill)
 */
export const AndroidGestureBar = ({ theme = 'light', isOverlay = false }) => {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 0 8px',
        backgroundColor: isDark || isOverlay ? 'transparent' : '#FFFFFF',
        position: isOverlay ? 'absolute' : 'relative',
        bottom: isOverlay ? 0 : 'auto',
        left: isOverlay ? 0 : 'auto',
        right: isOverlay ? 0 : 'auto',
        zIndex: 50,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '4px',
          backgroundColor: isDark ? '#FFFFFF' : '#94A3B8',
          borderRadius: '9999px',
          opacity: isDark ? 0.85 : 0.5,
          boxShadow: isDark ? '0 1px 4px rgba(0, 0, 0, 0.3)' : 'none',
        }}
      />
    </div>
  );
};

export default AndroidGestureBar;


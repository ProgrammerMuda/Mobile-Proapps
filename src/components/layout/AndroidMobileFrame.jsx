import React from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidGestureBar } from './AndroidGestureBar';

/**
 * Android Mobile Frame Wrapper
 * Renders an Android device viewport on desktop and full responsive on mobile devices.
 */
export const AndroidMobileFrame = ({
  children,
  header,
  bottomNav,
  theme = 'light',
  gestureTheme,
  statusBarBg = '#FFFFFF',
}) => {
  const isOverlayStatus = theme === 'dark' || theme === 'login' || theme === 'dark-header';
  const isDarkStatus = theme === 'dark' || theme === 'login' || theme === 'dark-header';
  const isDarkGesture = gestureTheme ? gestureTheme === 'dark' : theme === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B1120',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 1rem',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
      }}
      className="android-outer-wrapper"
    >
      {/* Android Device Mockup Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '412px',
          height: '870px',
          maxHeight: '94vh',
          backgroundColor: theme === 'dark' ? '#02388A' : '#FFFFFF',
          borderRadius: '40px',
          border: '9px solid #1E293B',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        id="phone-screen-container"
        className="android-device-screen"
      >
        {/* Status Bar */}
        <AndroidStatusBar
          theme={isDarkStatus ? 'dark' : 'light'}
          isOverlay={isOverlayStatus}
          backgroundColor={isOverlayStatus ? 'transparent' : statusBarBg}
        />

        {/* Optional App Bar / Header */}
        {header}

        {/* Scrollable Mobile Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
          }}
          className="android-scroll-content"
        >
          {children}
        </main>

        {/* Bottom Navigation */}
        {bottomNav}

        {/* Android Gesture Bar (when bottomNav is not present) */}
        {!bottomNav && (
          <AndroidGestureBar theme={isDarkGesture ? 'dark' : 'light'} isOverlay={isDarkGesture} />
        )}
      </div>

      <style>{`
        /* Smooth scrolling & custom mobile scrollbar */
        .android-scroll-content::-webkit-scrollbar {
          width: 4px;
        }
        .android-scroll-content::-webkit-scrollbar-thumb {
          background-color: var(--color-border-default);
          border-radius: 4px;
        }

        /* Mobile Screen Override: Full screen on small mobile viewports */
        @media (max-width: 480px) {
          .android-outer-wrapper {
            padding: 0 !important;
            background-color: var(--color-background-page) !important;
          }
          .android-device-screen {
            max-width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

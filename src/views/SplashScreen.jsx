import React, { useEffect, useState } from 'react';
import splashBgSrc from '../assets/splash-bg.png';
import { LogoFullWhite } from '../components/common/Logo';

/**
 * Android Mobile SplashScreen View
 * Displays city background with larger pure white animated fade-in PROAPPS logo.
 */
export const SplashScreen = ({ onFinish, duration = 2800 }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500); // fade out transition
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        backgroundImage: `url(${splashBgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out',
        userSelect: 'none',
      }}
    >
      {/* Animated White Logo Container */}
      <div
        className="splash-logo-animated"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <LogoFullWhite width={260} />
      </div>

      <style>{`
        /* Smooth Fade In and Slight Scale Animation */
        .splash-logo-animated {
          animation: splashFadeInScale 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes splashFadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;

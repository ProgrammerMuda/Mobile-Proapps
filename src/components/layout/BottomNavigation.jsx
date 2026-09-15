import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  House,
  ChartBar,
  ChatCircleDots,
  UserCircle,
  QrCode,
} from '@phosphor-icons/react';

/**
 * Curved Notched Mobile Bottom Navigation Bar (Unified with Gesture Bar)
 * One single solid white surface (#FFFFFF) from the curved notch to the bottom edge.
 */
export const BottomNavigation = ({ activeTab = 'home', onSelectTab }) => {
  const { t } = useLanguage();

  const handleTabClick = (tabId) => {
    if (onSelectTab) onSelectTab(tabId);
  };

  const handleQrClick = () => {
    if (onSelectTab) onSelectTab('qr');
    alert(t('nav.qrAlert'));
  };

  const activeColor = 'var(--color-primary)'; /* #053079 */
  const inactiveColor = '#94A3B8'; /* Slate 400 */

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '84px',
        userSelect: 'none',
        zIndex: 50,
      }}
    >
      {/* 1. Curved Background SVG with Center Notch Cutout (Full Height to Bottom) */}
      <svg
        viewBox="0 0 400 84"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 -4px 16px rgba(0, 0, 0, 0.08))',
          display: 'block',
        }}
      >
        <path
          d="M 0,0 L 146,0 C 166,0 172,38 200,38 C 228,38 234,0 254,0 L 400,0 L 400,84 L 0,84 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* 2. Floating Center Circular QR Button */}
      <button
        type="button"
        onClick={handleQrClick}
        title="QR Code Scanner"
        style={{
          position: 'absolute',
          top: '-26px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)', /* #053079 */
          border: '4px solid #FFFFFF',
          boxShadow: '0 8px 20px -2px rgba(5, 48, 121, 0.45), 0 2px 6px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 60,
          outline: 'none',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'translateX(-50%) scale(0.94)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'translateX(-50%) scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(-50%) scale(1)')}
      >
        <QrCode size={28} weight="bold" color="#FFFFFF" />
      </button>

      {/* 3. Navigation Items Row */}
      <nav
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
          padding: '0 8px',
          zIndex: 55,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Left Side: Home & Overview */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '40%' }}>
          {/* Tab 1: Home */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 8px',
              color: activeTab === 'home' ? activeColor : inactiveColor,
              transition: 'color var(--transition-fast)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <House size={22} weight={activeTab === 'home' ? 'fill' : 'regular'} />
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: activeTab === 'home' ? 700 : 500,
                lineHeight: 1,
              }}
            >
              {t('nav.home')}
            </span>
          </button>

          {/* Tab 2: Overview (Chart Icon) */}
          <button
            type="button"
            onClick={() => handleTabClick('overview')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 8px',
              color: activeTab === 'overview' ? activeColor : inactiveColor,
              transition: 'color var(--transition-fast)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <ChartBar size={22} weight={activeTab === 'overview' ? 'fill' : 'regular'} />
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                lineHeight: 1,
              }}
            >
              {t('nav.overview')}
            </span>
          </button>
        </div>

        {/* Center Gap for QR Button */}
        <div style={{ width: '20%' }} />

        {/* Right Side: Chat & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '40%' }}>
          {/* Tab 3: Chat (in place of Notif) */}
          <button
            type="button"
            onClick={() => handleTabClick('chat')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 8px',
              color: activeTab === 'chat' ? activeColor : inactiveColor,
              transition: 'color var(--transition-fast)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChatCircleDots size={22} weight={activeTab === 'chat' ? 'fill' : 'regular'} />
              {/* Subtle Red Notification/Message Dot */}
              <span
                style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-danger)', /* #DC2626 */
                  border: '1.5px solid #FFFFFF',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: activeTab === 'chat' ? 700 : 500,
                lineHeight: 1,
              }}
            >
              {t('nav.chat')}
            </span>
          </button>

          {/* Tab 4: Profile */}
          <button
            type="button"
            onClick={() => handleTabClick('profile')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 8px',
              color: activeTab === 'profile' ? activeColor : inactiveColor,
              transition: 'color var(--transition-fast)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <UserCircle size={22} weight={activeTab === 'profile' ? 'fill' : 'regular'} />
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                lineHeight: 1,
              }}
            >
              {t('nav.profile')}
            </span>
          </button>
        </div>
      </nav>

      {/* 4. Integrated Android Gesture Bar Pill (Same Solid White Surface) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 0 10px',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '4px',
            backgroundColor: '#94A3B8',
            borderRadius: '9999px',
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
};

export default BottomNavigation;



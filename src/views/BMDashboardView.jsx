import {
  Bell,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import { QuickMenuGrid, PromoBannerSlider } from '../components/dashboard';
import bmHeaderImg from '../assets/bm-header.png';
import tenantHeaderImg from '../assets/tenant-header.png';

/**
 * Building Management (BM) & Tenant Unified Dashboard View
 * Matching the exact full-bleed hero banner header and 32px overlapping sheet design,
 * with 16px padding/gaps and concentric radius system.
 */
export const BMDashboardView = ({ user, onLogout, onNavigateToOverview, onNavigateMenu }) => {
  const { t } = useLanguage();
  const bmUser = user || {
    name: 'Ahmad Pratama',
    email: 'bm@proapps.id',
    unitOrDept: 'Building Management',
    roleCode: 'BM',
  };

  const isTenant = bmUser?.roleCode === 'TENANT';
  const currentHeaderImg = isTenant ? tenantHeaderImg : bmHeaderImg;
  const userSubtitle = isTenant ? t('dashboard.tenant') : (bmUser.unitOrDept ? (bmUser.unitOrDept === 'Building Management' ? t('dashboard.bm') : bmUser.unitOrDept) : t('dashboard.bm'));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#FFFFFF',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
      }}
    >
      {/* 1. Full-Bleed Hero Image Header (Height remains unchanged: 195px) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '195px',
          overflow: 'hidden',
          backgroundColor: '#053079',
        }}
      >
        <img
          src={currentHeaderImg}
          alt={isTenant ? 'Tenant Apartment View' : 'Building Management Command Center'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: isTenant ? '65% center' : '90% center',
            display: 'block',
          }}
        />

        {/* Soft Vignette Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(5, 48, 121, 0.05) 0%, rgba(5, 48, 121, 0.3) 40%, rgba(5, 48, 121, 0.88) 100%)',
          }}
        />

        {/* Top Right Header Action: Notification Bell Button (Below Status Bar) */}
        <div
          style={{
            position: 'absolute',
            top: '46px',
            right: '16px',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => alert(t('dashboard.notifAlert'))}
            aria-label="Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              outline: 'none',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Bell size={20} weight="fill" />
            {/* Red Notification Dot Badge */}
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                border: '1.5px solid #FFFFFF',
              }}
            />
          </button>
        </div>

        {/* Greeting Text on Header (Exact 16px distance from the top of overlapping card) */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px', /* 32px overlap + 16px gap */
            left: '16px',
            right: '16px',
            maxWidth: '260px',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.3px',
              margin: '0 0 2px 0',
              lineHeight: 1.2,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {t('dashboard.greeting')} {bmUser.name} <span style={{ fontSize: '1.15rem' }}>👋</span>
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              opacity: 0.95,
              margin: 0,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
            }}
          >
            {userSubtitle}
          </p>
        </div>
      </div>

      {/* 2. Overlapping White Sheet Container (Outer Radius 32px) */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--color-background-surface)',
          borderTopLeftRadius: 'var(--radius-xl)', /* 32px */
          borderTopRightRadius: 'var(--radius-xl)', /* 32px */
          marginTop: '-32px',
          padding: '24px 16px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 20,
        }}
      >


        {/* 4. 3x4 Quick Menu Grid (3D Icons matching user design) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          <QuickMenuGrid
            isTenant={isTenant}
            onMenuItemClick={(item) => {
              if (item.id === 'tenant-unit' && onNavigateMenu) {
                onNavigateMenu('tenant-unit');
              } else {
                alert(t('dashboard.openModule', { name: item.title }));
              }
            }}
          />
        </div>

        {/* 5. Horizontal Promo / Information Banner Slider with 3 Indicator Dots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px', paddingBottom: '24px' }}>
          <PromoBannerSlider />
        </div>
      </div>
    </div>
  );
};

export default BMDashboardView;


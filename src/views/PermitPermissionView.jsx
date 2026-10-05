import React, { useLayoutEffect, useRef } from 'react';
import { CaretLeft } from '@phosphor-icons/react';

export default function PermitPermissionView({ onBack, language, children, footer }) {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  return (
    <div
      ref={pageRef}
      className="permit-permission-page"
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'var(--font-sans)',
        fontSize: '16px',
        color: '#334155',
      }}
    >
      <style>{`
        .permit-permission-page input::placeholder,
        .permit-permission-page textarea::placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .permit-permission-page input::-webkit-input-placeholder,
        .permit-permission-page textarea::-webkit-input-placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .permit-permission-page input::-moz-placeholder,
        .permit-permission-page textarea::-moz-placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .permit-permission-page input[type="text"]:focus,
        .permit-permission-page textarea:focus {
          border-color: #09B2FF !important;
          box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;
        }
      `}</style>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr) 36px', alignItems: 'center', gap: '8px', minHeight: '56px', padding: '0 16px', backgroundColor: '#FFFFFF' }}>
        <button type="button" onClick={onBack} aria-label={language === 'id' ? 'Kembali ke daftar request' : 'Back to request list'} style={{ display: 'grid', placeItems: 'center', width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '8px', background: 'transparent', color: '#334155', cursor: 'pointer' }}>
          <CaretLeft size={22} weight="bold" />
        </button>
        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, textAlign: 'center', color: '#334155' }}>Permit Permission</h1>
      </header>
      <div style={{ flex: 1, padding: '20px 16px 32px' }}>
        {children}
      </div>
      {footer && (
        <footer
          style={{
            position: 'sticky',
            bottom: 0,
            zIndex: 35,
            backgroundColor: '#FFFFFF',
            padding: '12px 16px 16px 16px',
            borderTop: '1px solid #F1F5F9',
            boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
          }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}

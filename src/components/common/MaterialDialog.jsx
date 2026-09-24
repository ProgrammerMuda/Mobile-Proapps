import React from 'react';
import { createPortal } from 'react-dom';
import { MaterialButton } from './MaterialButton';

/**
 * Material Design 3 Dialog / Modal
 * Concentric Radius: Outer Dialog 24px -> Inner Buttons 8px
 */
export const MaterialDialog = ({
  open = false,
  onClose,
  title,
  children,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  onConfirm,
}) => {
  if (!open) return null;

  const modalTarget = typeof document !== 'undefined'
    ? document.getElementById('phone-screen-container') || document.querySelector('.android-device-screen') || document.body
    : null;

  const modalElement = (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-background-surface)',
          borderRadius: 'var(--radius-lg)', /* 24px outer dialog */
          padding: '24px',
          maxWidth: '360px',
          width: '100%',
          boxShadow: 'var(--md-elevation-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'mdDialogFadeIn 0.2s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {title && (
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
        )}

        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {children}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          {cancelText && (
            <MaterialButton
              variant="text"
              onClick={onClose}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {cancelText}
            </MaterialButton>
          )}
          {confirmText && (
            <MaterialButton
              variant="filled"
              onClick={onConfirm || onClose}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {confirmText}
            </MaterialButton>
          )}
        </div>
      </div>
    </div>
  );

  return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
};

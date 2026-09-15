import React from 'react';
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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
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
};

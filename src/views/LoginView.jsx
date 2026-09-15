import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MaterialButton } from '../components/common/MaterialButton';
import { LogoHeader } from '../components/common/Logo';
import { findAccount } from '../models/accounts';
import {
  Eye,
  EyeSlash,
  WarningCircle,
} from '@phosphor-icons/react';

/**
 * Mobile Android Login View with Validation Error Support
 */
export const LoginView = ({ onLoginSuccess, onForgotPassword }) => {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('bm@proapps.id');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = identifier.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const found = findAccount(identifier, password);
    if (found) {
      setErrorMessage('');
      if (onLoginSuccess) {
        onLoginSuccess(found);
      }
    } else {
      setErrorMessage(t('login.errorMessage'));
    }
  };

  const getRoleIcon = (code) => {
    switch (code) {
      case 'BM': return Buildings;
      case 'TR': return Users;
      case 'TENANT': return House;
      case 'ENG': return Wrench;
      case 'HK': return Broom;
      case 'SEC': return ShieldCheck;
      default: return Users;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#023E9C',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
      }}
    >
      {/* Top Blue Header with Starry Sky & Balanced Logo Pill */}
      <div
        className="login-header-container"
        style={{
          position: 'relative',
          minHeight: '230px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #02388A 0%, #0352BC 55%, #09B2FF 100%)',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle Background Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />

        {/* Subtle Starry Sparkles */}
        <div className="star star-1" style={{ top: '15%', left: '15%' }} />
        <div className="star star-2" style={{ top: '22%', right: '18%' }} />
        <div className="star star-3" style={{ top: '38%', left: '12%' }} />
        <div className="star star-4" style={{ top: '65%', right: '14%' }} />
        <div className="star star-5" style={{ top: '18%', right: '42%' }} />
        <div className="star star-6" style={{ top: '55%', left: '26%' }} />
        <div className="star star-7" style={{ top: '32%', right: '28%' }} />

        {/* Hugged Pill Badge with the horizontal header logo */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
            height: 'fit-content',
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 24px -2px rgba(0, 0, 0, 0.24), 0 4px 8px -1px rgba(0, 0, 0, 0.12)',
            zIndex: 15,
            transform: 'translateY(-10px)',
          }}
        >
          <LogoHeader width={138} style={{ display: 'block' }} />
        </div>
      </div>

      {/* Main Card Sheet Container (Outer Radius 32px, 16px Padding & Gaps) */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--color-background-surface)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          padding: '24px 16px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.12)',
          marginTop: '-44px',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Title & Subtitle */}
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.3px',
                marginBottom: '4px',
                lineHeight: 1.25,
              }}
            >
              Sign in to your<br />Account
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                fontWeight: 400,
                margin: 0,
              }}
            >
              Enter your credentials to log in
            </p>
          </div>



          {/* Error Message Alert Banner */}
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'var(--color-red-50)',
                border: '1px solid var(--color-red-600)',
                borderRadius: 'var(--radius-sm)',
                animation: 'shake 0.35s ease-in-out',
              }}
            >
              <WarningCircle size={18} weight="fill" color="var(--color-red-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-red-700)',
                  fontWeight: 500,
                  lineHeight: 1.35,
                }}
              >
                {errorMessage}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email / Phone Field (Inner Radius 8px) */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
                placeholder={t('login.emailPlaceholder')}
                className="proapps-input"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: 'var(--color-background-surface)',
                  border: errorMessage
                    ? '1px solid var(--color-red-600)'
                    : isFocusedEmail
                    ? '1px solid var(--color-border-focus)'
                    : '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0 14px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'all var(--transition-fast)',
                  boxShadow: errorMessage
                    ? (isFocusedEmail ? '0 0 0 3px rgba(220, 38, 38, 0.16)' : 'none')
                    : isFocusedEmail
                    ? '0 0 0 3px rgba(9, 178, 255, 0.16)'
                    : 'none',
                }}
              />
            </div>

            {/* Password Field (Inner Radius 8px) */}
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
                placeholder={t('login.passwordPlaceholder')}
                className="proapps-input"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: 'var(--color-background-surface)',
                  border: errorMessage
                    ? '1px solid var(--color-red-600)'
                    : isFocusedPassword
                    ? '1px solid var(--color-border-focus)'
                    : '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0 40px 0 14px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'all var(--transition-fast)',
                  boxShadow: errorMessage
                    ? (isFocusedPassword ? '0 0 0 3px rgba(220, 38, 38, 0.16)' : 'none')
                    : isFocusedPassword
                    ? '0 0 0 3px rgba(9, 178, 255, 0.16)'
                    : 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: password.length > 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {showPassword ? (
                  <EyeSlash size={18} weight={password.length > 0 ? 'bold' : 'regular'} />
                ) : (
                  <Eye size={18} weight={password.length > 0 ? 'bold' : 'regular'} />
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            {/* Login Button (Slate 200 bg & Slate 500 text when disabled, No shadow) */}
            <div style={{ marginTop: '4px' }}>
              <MaterialButton
                type="submit"
                variant="filled"
                disabled={!isFormValid}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isFormValid ? 'var(--color-primary)' : 'var(--color-disabled-bg)',
                  color: isFormValid ? 'var(--color-text-on-primary)' : 'var(--color-disabled-text)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  boxShadow: 'none',
                }}
              >
                {t('login.button')}
              </MaterialButton>
            </div>
          </form>
        </div>

        {/* Footer Copyright */}
        <div style={{ textAlign: 'center', paddingTop: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {t('login.copyright')}
          </span>
        </div>
      </div>

      <style>{`
        .proapps-input::placeholder {
          color: var(--color-text-placeholder) !important; /* #CBD5E1 / Slate-300 */
          font-weight: 400 !important;
          opacity: 1 !important;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }

        .star {
          position: absolute;
          background-color: #FFFFFF;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.75;
        }
        .star-1 { width: 3px; height: 3px; opacity: 0.9; }
        .star-2 { width: 2px; height: 2px; opacity: 0.7; }
        .star-3 { width: 2.5px; height: 2.5px; opacity: 0.85; }
        .star-4 { width: 2px; height: 2px; opacity: 0.6; }
        .star-5 { width: 3px; height: 3px; opacity: 0.8; }
        .star-6 { width: 1.5px; height: 1.5px; opacity: 0.75; }
        .star-7 { width: 2px; height: 2px; opacity: 0.7; }
      `}</style>
    </div>
  );
};

export default LoginView;

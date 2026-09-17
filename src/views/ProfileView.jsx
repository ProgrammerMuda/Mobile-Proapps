import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import avatarUserImg from '../assets/avatar-user.jpg';
import logoutIllustrationImg from '../assets/logout-illustration.jpg';
import { DEMO_ACCOUNTS } from '../models/accounts';
import {
  UserCircle,
  ShieldStar,
  Globe,
  ArrowsClockwise,
  DeviceMobile,
  ShieldCheck,
  Star,
  CaretRight,
  SignOut,
  X,
  Check,
  LockKey,
  Fingerprint,
  Bell,
  Camera,
  MapPin,
  Buildings,
  Wrench,
} from '@phosphor-icons/react';

/**
 * Modern High-Fidelity Profile Screen for Proapps
 * Fully Internationalized (Supports 'id' & 'en' dynamic live switching).
 */
export const ProfileView = ({
  user,
  onLogout,
  onSwitchRole,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const isTenant = user?.roleCode === 'TENANT';
  const isEngineering = user?.roleCode === 'ENG';
  const isHousekeeping = user?.roleCode === 'HK';
  const isSecurity = user?.roleCode === 'SEC';

  let roleBadgeLabel = t('profile.bmRole');
  if (isTenant) {
    roleBadgeLabel = t('profile.tenantRole');
  } else if (isEngineering) {
    roleBadgeLabel = t('profile.engRole');
  } else if (isHousekeeping) {
    roleBadgeLabel = t('profile.hkRole');
  } else if (isSecurity) {
    roleBadgeLabel = t('profile.secRole');
  }

  // Modals & Dynamic States
  const [activeModal, setActiveModal] = useState(null); // 'account-info' | 'account-security' | 'switch-role' | 'language' | 'app-icon' | 'device-permissions' | 'privacy-policy' | 'rate-proapps' | 'logout'
  const [selectedAppIcon, setSelectedAppIcon] = useState('classic'); // 'classic' | 'cyan' | 'dark'
  const [starRating, setStarRating] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [permissions, setPermissions] = useState({
    camera: true,
    location: true,
    notification: true,
  });

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || (isTenant ? 'Budi Santoso' : (isEngineering ? 'Dedi Kurniawan' : 'Ahmad Pratama')),
    email: user?.email || (isTenant ? 'budi.santoso@gmail.com' : (isEngineering ? 'eng@proapps.id' : 'ahmad.pratama@proapps.id')),
    phone: isTenant ? '+62 812-3456-7890' : (isEngineering ? '+62 812-3456-704' : '+62 811-9876-5432'),
    property: 'Apartement A',
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSaveProfile = () => {
    setProfileData({ ...editForm });
    setActiveModal(null);
  };

  const menuSections = [
    {
      id: 'preferences',
      title: t('profile.preferences'),
      items: [
        {
          id: 'account-info',
          title: t('profile.accountInfo'),
          icon: UserCircle,
          action: () => {
            setEditForm({ ...profileData });
            setActiveModal('account-info');
          },
        },
        {
          id: 'account-security',
          title: t('profile.accountSecurity'),
          icon: ShieldStar,
          action: () => setActiveModal('account-security'),
        },
        {
          id: 'switch-role',
          title: t('profile.switchRole'),
          icon: ArrowsClockwise,
          badge: user?.roleCode || 'BM',
          action: () => setActiveModal('switch-role'),
        },
      ],
    },
    {
      id: 'app-setting',
      title: t('profile.appSetting'),
      items: [
        {
          id: 'language',
          title: t('profile.language'),
          icon: Globe,
          badge: language === 'id' ? 'ID' : 'EN',
          action: () => setActiveModal('language'),
        },
        {
          id: 'app-icon',
          title: t('profile.appIcon'),
          icon: ArrowsClockwise,
          action: () => setActiveModal('app-icon'),
        },
        {
          id: 'device-permissions',
          title: t('profile.devicePermissions'),
          icon: DeviceMobile,
          action: () => setActiveModal('device-permissions'),
        },
      ],
    },
    {
      id: 'others',
      title: t('profile.others'),
      items: [
        {
          id: 'privacy-policy',
          title: t('profile.privacyPolicy'),
          icon: ShieldCheck,
          action: () => setActiveModal('privacy-policy'),
        },
        {
          id: 'rate-proapps',
          title: t('profile.rateProapps'),
          icon: Star,
          action: () => {
            setRatingSubmitted(false);
            setActiveModal('rate-proapps');
          },
        },
      ],
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        paddingBottom: '20px',
      }}
    >
      {/* 1. Hero Profile Header with Brand Gradient & Refined Abstract Art */}
      <div
        style={{
          background: 'linear-gradient(135deg, #053079 0%, #0344A8 50%, #0284C7 100%)',
          padding: '48px 16px 16px 16px',
          borderBottomLeftRadius: '28px',
          borderBottomRightRadius: '28px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'none',
          color: '#FFFFFF',
        }}
      >
        {/* Soft Ambient Aurora Glow Orbs */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(9, 178, 255, 0.35) 0%, rgba(9, 178, 255, 0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-30px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(5, 48, 121, 0) 70%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Stepped Concentric Filled Circles (Origin at Extreme Top-Right Corner) */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'hidden',
          }}
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="0" r="350" fill="rgba(9, 178, 255, 0.05)" />
          <circle cx="400" cy="0" r="280" fill="rgba(9, 178, 255, 0.09)" />
          <circle cx="400" cy="0" r="215" fill="rgba(9, 178, 255, 0.15)" />
          <circle cx="400" cy="0" r="160" fill="rgba(9, 178, 255, 0.22)" />
          <circle cx="400" cy="0" r="115" fill="rgba(9, 178, 255, 0.32)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
          <circle cx="400" cy="0" r="78" fill="rgba(255, 255, 255, 0.25)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
          <circle cx="400" cy="0" r="48" fill="rgba(255, 255, 255, 0.45)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
          <circle cx="400" cy="0" r="26" fill="rgba(255, 255, 255, 0.70)" />
          <circle cx="400" cy="0" r="12" fill="rgba(255, 255, 255, 0.95)" />
        </svg>

        {/* Content Container (Z-Index 2) */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Top Header Title */}
          <div style={{ marginBottom: '16px' }}>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.2px',
              }}
            >
              {t('profile.title')}
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', margin: '2px 0 0 0' }}>
              {t('profile.subtitle')}
            </p>
          </div>

          {/* User Card */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '10px 12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: 'none',
            }}
          >
            {/* Avatar with Status Ring */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  padding: '2px',
                  background: 'linear-gradient(135deg, #09B2FF 0%, #FFFFFF 100%)',
                  boxShadow: '0 4px 10px rgba(5, 48, 121, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={avatarUserImg}
                  alt={profileData.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: '2px solid #053079',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <Check size={10} weight="bold" color="#FFFFFF" />
              </div>
            </div>

            {/* User Meta */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.2,
                }}
              >
                {profileData.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    backgroundColor: '#09B2FF',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.2px',
                    display: 'inline-block',
                  }}
                >
                  {roleBadgeLabel}
                </span>
              </div>

              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'rgba(255, 255, 255, 0.92)',
                  margin: '1px 0 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 500,
                }}
              >
                <Buildings size={14} weight="bold" />
                <span>{profileData.property}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Settings Groups */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {menuSections.map((section) => (
          <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#64748B',
                margin: '0 0 0 4px',
                letterSpacing: '-0.1px',
              }}
            >
              {section.title}
            </h3>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: 'none',
              }}
            >
              {section.items.map((item, idx) => {
                const IconComponent = item.icon;
                const isLast = idx === section.items.length - 1;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="profile-menu-row"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: '#EAF7FF',
                          border: '1px solid #BAE6FD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#09B2FF',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={20} weight="bold" />
                      </div>

                      <span
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1E293B',
                          letterSpacing: '-0.15px',
                        }}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: '#EAF7FF',
                            color: '#053079',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid #BAE6FD',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      <CaretRight size={18} color="#94A3B8" weight="bold" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* 3. Logout Action */}
        <button
          type="button"
          onClick={() => setActiveModal('logout')}
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FEE2E2',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#DC2626',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '4px',
            transition: 'background-color 0.15s',
          }}
        >
          <SignOut size={18} weight="bold" />
          <span>{t('profile.logout')}</span>
        </button>

        <div style={{ textAlign: 'center', marginTop: '2px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
            {t('profile.version')}
          </span>
        </div>
      </div>

      {/* ================= MODALS & BOTTOM SHEETS (IN-FRAME PORTAL) ================= */}
      {(() => {
        if (!activeModal) return null;
        const modalTarget = typeof document !== 'undefined' ? document.getElementById('phone-screen-container') : null;
        const modalElement = (
          <>
            {/* MODAL: Switch Role Demo Account */}
            {activeModal === 'switch-role' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '20px',
                    width: '100%',
                    maxWidth: '340px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    maxHeight: '82%',
                    overflowY: 'auto',
                    boxSizing: 'border-box',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ArrowsClockwise size={20} color="#053079" weight="bold" />
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('profile.switchRoleTitle')}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 2px 0', lineHeight: 1.35 }}>
                    {t('profile.switchRoleDesc')}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {DEMO_ACCOUNTS.map((acc) => {
                      const isSelected = user?.roleCode === acc.roleCode;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            if (onSwitchRole) {
                              onSwitchRole(acc);
                            }
                            setActiveModal(null);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid #E2E8F0',
                            backgroundColor: isSelected ? 'var(--color-selected-background)' : '#FFFFFF',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                                {acc.name}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.625rem',
                                  fontWeight: 700,
                                  backgroundColor: isSelected ? 'var(--color-primary)' : '#E2E8F0',
                                  color: isSelected ? '#FFFFFF' : '#475569',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                }}
                              >
                                {acc.roleCode}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              {acc.unitOrDept}
                            </span>
                          </div>

                          {isSelected && (
                            <div
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Check size={12} weight="bold" color="#FFFFFF" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 1: Account Info */}
            {activeModal === 'account-info' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '340px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserCircle size={22} color="#053079" weight="bold" />
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('profile.accountInfo')}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>

                  {/* Avatar Photo Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0' }}>
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          padding: '2px',
                          background: 'linear-gradient(135deg, #09B2FF 0%, #053079 100%)',
                          boxShadow: '0 4px 12px rgba(5, 48, 121, 0.2)',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={avatarUserImg}
                          alt={editForm.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(t('modal.changePhotoAlert'))}
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#09B2FF',
                          border: '2px solid #FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#FFFFFF',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        }}
                        title="Change Photo"
                      >
                        <Camera size={12} weight="bold" />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#09B2FF', fontWeight: 600, marginTop: '6px' }}>
                      {t('profile.changeAvatar')}
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      {t('modal.fullName')}
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        border: '1px solid #CBD5E1',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0 12px',
                        fontSize: '0.8125rem',
                        color: '#1E293B',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      {t('modal.phoneNumber')}
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        border: '1px solid #CBD5E1',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0 12px',
                        fontSize: '0.8125rem',
                        color: '#1E293B',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      {t('modal.emailAddress')}
                    </label>
                    <input
                      type="text"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        border: '1px solid #CBD5E1',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0 12px',
                        fontSize: '0.8125rem',
                        color: '#1E293B',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      {t('modal.property')}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={editForm.property}
                      style={{
                        width: '100%',
                        height: '40px',
                        border: '1px solid #E2E8F0',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0 12px',
                        fontSize: '0.8125rem',
                        color: '#64748B',
                        backgroundColor: '#F8FAFC',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    style={{
                      backgroundColor: '#053079',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      height: '42px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '4px',
                    }}
                  >
                    {t('modal.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {/* MODAL 2: Account Security */}
            {activeModal === 'account-security' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldStar size={22} color="#053079" weight="bold" />
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('profile.accountSecurity')}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>

                  {/* Biometric Toggle */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Fingerprint size={22} color="#7E22CE" weight="bold" />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{t('modal.biometricLogin')}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{t('modal.biometricDesc')}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBiometricEnabled(!biometricEnabled)}
                      style={{
                        width: '42px',
                        height: '24px',
                        borderRadius: '9999px',
                        backgroundColor: biometricEnabled ? '#09B2FF' : '#CBD5E1',
                        border: 'none',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: biometricEnabled ? 'flex-end' : 'flex-start',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                    </button>
                  </div>

                  {/* Change Password */}
                  <button
                    type="button"
                    onClick={() => alert(t('modal.changePasswordAlert'))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <LockKey size={22} color="#D97706" weight="bold" />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{t('modal.changePassword')}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{t('modal.changePasswordDesc')}</div>
                      </div>
                    </div>
                    <CaretRight size={16} color="#94A3B8" weight="bold" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{
                      backgroundColor: '#053079',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      height: '40px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t('modal.done')}
                  </button>
                </div>
              </div>
            )}

            {/* MODAL 3: Language (Bottom Sheet) */}
            {activeModal === 'language' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    maxWidth: '480px',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    padding: '12px 20px 28px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.25)',
                    animation: 'bottomSheetSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxSizing: 'border-box',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '4px',
                      backgroundColor: '#CBD5E1',
                      borderRadius: '9999px',
                      margin: '0 auto 16px auto',
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0, lineHeight: 1.2 }}>
                        {t('modal.selectLanguage')}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                        {t('modal.selectLanguageDesc')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      <X size={16} weight="bold" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('id');
                        setActiveModal(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: language === 'id' ? '2px solid #09B2FF' : '1px solid #E2E8F0',
                        backgroundColor: language === 'id' ? '#EAF7FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🇮🇩</span>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>
                            {t('modal.langId')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1px' }}>
                            {t('modal.langIdDesc')}
                          </div>
                        </div>
                      </div>
                      {language === 'id' && (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#053079',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <Check size={14} weight="bold" />
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        setActiveModal(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: language === 'en' ? '2px solid #09B2FF' : '1px solid #E2E8F0',
                        backgroundColor: language === 'en' ? '#EAF7FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🇺🇸</span>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>
                            {t('modal.langEn')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1px' }}>
                            {t('modal.langEnDesc')}
                          </div>
                        </div>
                      </div>
                      {language === 'en' && (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#053079',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <Check size={14} weight="bold" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 4: App Icon */}
            {activeModal === 'app-icon' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '310px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ArrowsClockwise size={22} color="#053079" weight="bold" />
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('modal.chooseAppIcon')}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '4px' }}>
                    {[
                      { id: 'classic', label: t('modal.iconClassic'), bg: '#053079' },
                      { id: 'cyan', label: t('modal.iconCyan'), bg: '#09B2FF' },
                      { id: 'dark', label: t('modal.iconDark'), bg: '#0B1120' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedAppIcon(theme.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 4px',
                          borderRadius: 'var(--radius-sm)',
                          border: selectedAppIcon === theme.id ? '2px solid #09B2FF' : '1px solid #E2E8F0',
                          backgroundColor: selectedAppIcon === theme.id ? '#EAF7FF' : '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: theme.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                          }}
                        >
                          P
                        </div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#334155', textAlign: 'center' }}>
                          {theme.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{
                      backgroundColor: '#053079',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      height: '40px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '4px',
                    }}
                  >
                    {t('modal.applyIcon')}
                  </button>
                </div>
              </div>
            )}

            {/* MODAL 5: Device Permissions */}
            {activeModal === 'device-permissions' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DeviceMobile size={22} color="#053079" weight="bold" />
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('modal.devicePerms')}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { key: 'camera', label: t('modal.permCamera'), desc: t('modal.permCameraDesc'), icon: Camera },
                      { key: 'notification', label: t('modal.permNotif'), desc: t('modal.permNotifDesc'), icon: Bell },
                      { key: 'location', label: t('modal.permLoc'), desc: t('modal.permLocDesc'), icon: MapPin },
                    ].map((perm) => {
                      const PermIcon = perm.icon;
                      const isEnabled = permissions[perm.key];

                      return (
                        <div
                          key={perm.key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <PermIcon size={18} color="#053079" weight="bold" />
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{perm.label}</div>
                              <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{perm.desc}</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPermissions({ ...permissions, [perm.key]: !isEnabled })}
                            style={{
                              width: '38px',
                              height: '22px',
                              borderRadius: '9999px',
                              backgroundColor: isEnabled ? '#09B2FF' : '#CBD5E1',
                              border: 'none',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isEnabled ? 'flex-end' : 'flex-start',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                            }}
                          >
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                              }}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{
                      backgroundColor: '#053079',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      height: '40px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t('modal.done')}
                  </button>
                </div>
              </div>
            )}

            {/* MODAL 6: Privacy Policy */}
            {activeModal === 'privacy-policy' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '340px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={22} color="#053079" weight="bold" />
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('modal.privacyTitle')}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ margin: 0 }}>
                      {t('modal.privacyP1')}
                    </p>
                    <p style={{ margin: 0 }}>
                      {t('modal.privacyP2')}
                    </p>
                    <p style={{ margin: 0 }}>
                      {t('modal.privacyP3')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{
                      backgroundColor: '#053079',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      height: '40px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '6px',
                    }}
                  >
                    {t('modal.iUnderstand')}
                  </button>
                </div>
              </div>
            )}

            {/* MODAL 7: Rate ProApps */}
            {activeModal === 'rate-proapps' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '300px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: '#F1F5F9',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748B',
                    }}
                  >
                    <X size={14} weight="bold" />
                  </button>

                  {!ratingSubmitted ? (
                    <>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: '#FEF3C7',
                          color: '#F59E0B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Star size={30} weight="fill" />
                      </div>

                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('modal.enjoyingProapps')}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                        {t('modal.ratePrompt')}
                      </p>

                      <div style={{ display: 'flex', gap: '8px', margin: '6px 0' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setStarRating(star)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Star
                              size={28}
                              weight={star <= starRating ? 'fill' : 'regular'}
                              color={star <= starRating ? '#F59E0B' : '#CBD5E1'}
                            />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setRatingSubmitted(true)}
                        style={{
                          width: '100%',
                          backgroundColor: '#053079',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          height: '40px',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: '4px',
                        }}
                      >
                        {t('modal.submitRating', { starRating })}
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: '#ECFDF5',
                          color: '#10B981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={30} weight="bold" />
                      </div>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        {t('modal.thankYou')}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                        {t('modal.thankYouFeedback', { starRating })}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        style={{
                          width: '100%',
                          backgroundColor: '#053079',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          height: '40px',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: '8px',
                        }}
                      >
                        {t('modal.close')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* MODAL: Logout Confirmation Bottom Sheet */}
            {activeModal === 'logout' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                onClick={() => setActiveModal(null)}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    maxWidth: '480px',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    padding: '12px 20px 28px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.25)',
                    animation: 'bottomSheetSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxSizing: 'border-box',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Sheet Handle */}
                  <div
                    style={{
                      width: '40px',
                      height: '4px',
                      backgroundColor: '#CBD5E1',
                      borderRadius: '9999px',
                      marginBottom: '16px',
                    }}
                  />

                  {/* Thinking Character Illustration (Full width matching sheet padding) */}
                  <div
                    style={{
                      width: '100%',
                      height: '210px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      backgroundColor: '#E0F2FE',
                    }}
                  >
                    <img
                      src={logoutIllustrationImg}
                      alt="Logout Confirmation"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 12%',
                        display: 'block',
                        borderRadius: '16px',
                      }}
                    />
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', margin: '0 0 6px 0', textAlign: 'center' }}>
                    {t('logout.title')}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 20px 0', textAlign: 'center', lineHeight: 1.45, maxWidth: '280px' }}>
                    {t('logout.message')}
                  </p>

                  {/* Action Buttons: Cancel on left, Logout on right */}
                  <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#475569',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {t('logout.cancel')}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        if (onLogout) onLogout();
                      }}
                      style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: 'none',
                      }}
                    >
                      <SignOut size={18} weight="bold" />
                      <span>{t('logout.confirm')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      <style>{`
        .profile-menu-row:active {
          background-color: #F8FAFC !important;
        }
      `}</style>
    </div>
  );
};

export default ProfileView;

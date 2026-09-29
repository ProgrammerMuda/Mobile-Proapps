import React from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  MapPin,
  Clock,
  CalendarBlank,
  Buildings,
  CheckCircle,
  WarningCircle,
  HourglassMedium,
  Timer,
  SignIn,
  SignOut,
  UserFocus,
  ShieldCheck,
  NavigationArrow,
  Check,
  Compass,
} from '@phosphor-icons/react';

/**
 * Visual GPS Map Component with Dual Pins (Clock In & Clock Out)
 */
const AttendanceMap = ({ data, language }) => {
  const isOff = data?.status === 'LIBUR' || data?.status === 'off' || data?.status === 'LEAVE' || data?.status === 'IZIN';
  const isAlpha = data?.status === 'ALPHA' || data?.status === 'alpha';
  const hasClockIn = data?.clockIn && data.clockIn !== '-' && data.clockIn !== '--:--' && data.clockIn !== '-- : --';
  const hasClockOut = data?.clockOut && data.clockOut !== '-' && data.clockOut !== '--:--' && data.clockOut !== '-- : --' && data.clockOut !== 'Sedang Bekerja...';

  const clockInLoc = data?.clockInLocation || (language === 'id' ? 'Lobby Tower A (Radius 8m)' : 'Tower A Lobby (8m Radius)');
  const clockOutLoc = data?.clockOutLocation || (language === 'id' ? 'West Security Gate (Radius 12m)' : 'West Security Gate (12m Radius)');

  return (
    <div
      style={{
        width: '100%',
        height: '210px',
        borderRadius: '16px',
        backgroundColor: '#E2E8F0',
        border: '1px solid #CBD5E1',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* SVG Map Canvas with realistic roads, buildings, park & geofence */}
      <svg
        viewBox="0 0 400 210"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <defs>
          {/* Geofence area gradient */}
          <radialGradient id="geofenceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#0284C7" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>

          {/* Pulse animation for pins */}
          <style>
            {`
              @keyframes pinPulse {
                0% { transform: scale(0.9); opacity: 0.8; }
                50% { transform: scale(1.25); opacity: 0.2; }
                100% { transform: scale(0.9); opacity: 0.8; }
              }
              .pulse-ring {
                transform-origin: center;
                animation: pinPulse 2s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* Map Background / Ground */}
        <rect width="400" height="210" fill="#F1F5F9" />

        {/* Green Parks / Landscaped Areas */}
        <path
          d="M 10,15 Q 80,10 110,60 T 40,110 Z"
          fill="#DCFCE7"
          stroke="#BBF7D0"
          strokeWidth="1"
        />
        <path
          d="M 280,130 Q 360,110 390,160 T 310,200 Z"
          fill="#DCFCE7"
          stroke="#BBF7D0"
          strokeWidth="1"
        />

        {/* Secondary Roads / Walkways */}
        <path
          d="M 0,110 Q 180,90 400,105"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M 140,0 Q 155,100 165,210"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 250,0 Q 240,100 230,210"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Road Centerlines */}
        <path
          d="M 0,110 Q 180,90 400,105"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Building 3D Footprints */}
        {/* Tower A */}
        <rect x="55" y="45" width="70" height="50" rx="6" fill="#CBD5E1" />
        <rect x="52" y="42" width="70" height="50" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
        <text x="87" y="68" fontSize="8" fontWeight="700" fill="#475569" textAnchor="middle" fontFamily="sans-serif">
          Tower A
        </text>
        <text x="87" y="78" fontSize="6.5" fontWeight="500" fill="#94A3B8" textAnchor="middle" fontFamily="sans-serif">
          Residential
        </text>

        {/* Management & Lobby Office */}
        <rect x="180" y="55" width="85" height="42" rx="6" fill="#CBD5E1" />
        <rect x="177" y="52" width="85" height="42" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="219" y="73" fontSize="8" fontWeight="700" fill="#02388A" textAnchor="middle" fontFamily="sans-serif">
          Main Lobby
        </text>
        <text x="219" y="83" fontSize="6.5" fontWeight="500" fill="#64748B" textAnchor="middle" fontFamily="sans-serif">
          Management Office
        </text>

        {/* Tower B */}
        <rect x="290" y="45" width="70" height="50" rx="6" fill="#CBD5E1" />
        <rect x="287" y="42" width="70" height="50" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
        <text x="322" y="68" fontSize="8" fontWeight="700" fill="#475569" textAnchor="middle" fontFamily="sans-serif">
          Tower B
        </text>

        {/* Security West Gate */}
        <rect x="90" y="145" width="55" height="32" rx="4" fill="#CBD5E1" />
        <rect x="88" y="143" width="55" height="32" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
        <text x="115" y="160" fontSize="7.5" fontWeight="700" fill="#475569" textAnchor="middle" fontFamily="sans-serif">
          West Gate
        </text>
        <text x="115" y="169" fontSize="6" fontWeight="500" fill="#94A3B8" textAnchor="middle" fontFamily="sans-serif">
          Pos Keamanan
        </text>

        {/* Street Name Labels */}
        <text x="20" y="125" fontSize="7" fontWeight="600" fill="#94A3B8" fontFamily="sans-serif">
          Jl. Thamrin Boulevard
        </text>
        <text x="280" y="25" fontSize="7" fontWeight="600" fill="#94A3B8" fontFamily="sans-serif">
          Jl. Kebon Kacang Raya
        </text>

        {/* Geofence Zone Circle (Radius 100m) */}
        <circle cx="200" cy="105" r="95" fill="url(#geofenceGlow)" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Connecting Trajectory Dashed Path between Clock In (x:195, y:85) and Clock Out (x:115, y:150) */}
        {hasClockIn && hasClockOut && (
          <g>
            <path
              d="M 195,85 Q 160,110 115,150"
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeDasharray="5 4"
            />
            {/* Trajectory Distance Label Bubble */}
            <rect x="135" y="105" width="46" height="15" rx="7" fill="#02388A" />
            <text x="158" y="116" fontSize="6.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
              85 m
            </text>
          </g>
        )}

        {/* PIN 1: Clock In Pin (x: 195, y: 85) */}
        {hasClockIn && (
          <g transform="translate(195, 85)">
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="14" fill="#16A34A" className="pulse-ring" />
            <circle cx="0" cy="0" r="8" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />

            {/* Pin Badge Tooltip */}
            <g transform="translate(0, -22)">
              <rect x="-42" y="-14" width="84" height="16" rx="8" fill="#16A34A" stroke="#FFFFFF" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
              <text x="0" y="-3" fontSize="7.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
                🟢 Masuk: {data.clockIn}
              </text>
              {/* Pointer triangle */}
              <polygon points="-4,2 4,2 0,6" fill="#16A34A" />
            </g>
          </g>
        )}

        {/* PIN 2: Clock Out Pin (x: 115, y: 150) */}
        {hasClockOut && (
          <g transform="translate(115, 150)">
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="14" fill="#02388A" className="pulse-ring" />
            <circle cx="0" cy="0" r="8" fill="#02388A" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />

            {/* Pin Badge Tooltip */}
            <g transform="translate(0, -22)">
              <rect x="-42" y="-14" width="84" height="16" rx="8" fill="#02388A" stroke="#FFFFFF" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
              <text x="0" y="-3" fontSize="7.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
                🔵 Keluar: {data.clockOut}
              </text>
              {/* Pointer triangle */}
              <polygon points="-4,2 4,2 0,6" fill="#02388A" />
            </g>
          </g>
        )}

        {/* Pending Clock Out Pin when clocked in but not yet out */}
        {hasClockIn && !hasClockOut && (
          <g transform="translate(195, 85)">
            <g transform="translate(0, 18)">
              <rect x="-50" y="0" width="100" height="14" rx="7" fill="#02388A" fillOpacity="0.9" />
              <text x="0" y="10" fontSize="6.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
                ⏱️ Sedang Bekerja di Site
              </text>
            </g>
          </g>
        )}

        {/* Off Day / Alpha overlay note */}
        {(isOff || isAlpha) && (
          <g transform="translate(200, 105)">
            <rect x="-80" y="-16" width="160" height="32" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.1))" />
            <text x="0" y="3" fontSize="8.5" fontWeight="700" fill={isAlpha ? '#DC2626' : '#64748B'} textAnchor="middle" fontFamily="sans-serif">
              {isAlpha
                ? (language === 'id' ? '⚠️ Tanpa Catatan Presensi' : '⚠️ No Attendance Recorded')
                : (language === 'id' ? '🏖️ Hari Libur Terjadwal' : '🏖️ Scheduled Day Off')}
            </text>
          </g>
        )}
      </svg>

      {/* Floating GPS Verified Badge on Map (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          borderRadius: '9999px',
          padding: '3px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
          zIndex: 2,
        }}
      >
        <ShieldCheck size={13} weight="fill" color="#16A34A" />
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#16A34A' }}>
          {language === 'id' ? 'Radius Geofence Valid (±8m)' : 'Valid Geofence Radius (±8m)'}
        </span>
      </div>

      {/* Floating Coordinates & Compass Badge (Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          borderRadius: '6px',
          padding: '2px 7px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#F8FAFC',
          fontSize: '0.625rem',
          fontWeight: 600,
          zIndex: 2,
        }}
      >
        <Compass size={11} weight="bold" color="#38BDF8" />
        <span>Lat: -6.1954 • Long: 106.8211</span>
      </div>

      {/* Site Name Pill (Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          borderRadius: '6px',
          padding: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          border: '1px solid #E2E8F0',
          fontSize: '0.625rem',
          fontWeight: 700,
          color: '#02388A',
          zIndex: 2,
        }}
      >
        <Buildings size={11} weight="fill" color="#02388A" />
        <span>Thamrin Exec. Residences</span>
      </div>
    </div>
  );
};

/**
 * Full Detail Modal for Attendance Records
 */
export const AttendanceDetailModal = ({ isOpen, onClose, data }) => {
  const { language } = useLanguage();

  if (!isOpen || !data) return null;

  const getModalTarget = () => {
    return document.getElementById('app-viewport') || document.body;
  };

  const isOff = data.status === 'LIBUR' || data.status === 'off' || data.status === 'LEAVE' || data.status === 'IZIN';
  const isAlpha = data.status === 'ALPHA' || data.status === 'alpha';
  const isLate = data.inStatus === 'LATE' || data.status === 'TERLAMBAT' || data.status === 'late' || (data.lateMinutes && data.lateMinutes > 0);
  const isEarlyIn = data.inStatus === 'EARLY_IN';
  const isEarlyOut = data.outStatus === 'EARLY_OUT';
  const hasClockIn = data.clockIn && data.clockIn !== '-' && data.clockIn !== '--:--' && data.clockIn !== '-- : --';
  const hasClockOut = data.clockOut && data.clockOut !== '-' && data.clockOut !== '--:--' && data.clockOut !== '-- : --' && data.clockOut !== 'Sedang Bekerja...';

  const lateMinutes = data.lateMinutes || (isLate ? 18 : 0);
  const earlyInMinutes = data.earlyInMinutes || (isEarlyIn ? 12 : 0);
  const earlyOutMinutes = data.earlyOutMinutes || (isEarlyOut ? 20 : 0);

  const scheduleText = data.shift || (language === 'id' ? 'Shift Pagi (08:00 - 17:00 WIB)' : 'Morning Shift (08:00 - 17:00 WIB)');
  const siteName = data.siteName || 'Thamrin Executive Residences';
  const attendanceMethod = data.attendanceMethod || (language === 'id' ? 'GPS & Verifikasi Wajah (Face Biometric)' : 'GPS & Face Biometric Verification');

  const clockInLoc = data.clockInLocation || (language === 'id' ? 'Lobby Tower A (Radius 8m)' : 'Tower A Lobby (8m Radius)');
  const clockOutLoc = data.clockOutLocation || (language === 'id' ? 'West Security Gate (Radius 12m)' : 'West Security Gate (12m Radius)');

  const modalElement = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#F8FAFC',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          animation: 'slideUp 0.25s ease-out',
          overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Modal Sticky Header */}
        <div
          style={{
            padding: '14px 18px 12px 18px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Drag Handle indicator */}
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '36px',
              height: '4px',
              backgroundColor: '#CBD5E1',
              borderRadius: '9999px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.2px' }}>
              {language === 'id' ? 'Detail Presensi' : 'Attendance Details'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
              {language === 'id' ? (data.date || 'Presensi Harian') : (data.dateEn || data.date || 'Daily Attendance')}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              transition: 'background-color 0.15s',
            }}
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* =========================================================================
              1. MAP SECTION WITH DUAL PINS
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                {language === 'id' ? 'Peta Lokasi Presensi' : 'Attendance Location Map'}
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#0284C7' }}>
                {language === 'id' ? 'GPS & Geofencing' : 'GPS & Geofencing'}
              </span>
            </div>

            <AttendanceMap data={data} language={language} />
          </div>

          {/* =========================================================================
              2. INFORMASI PRESENSI (ATTENDANCE INFORMATION)
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              {language === 'id' ? 'Informasi Presensi' : 'Attendance Information'}
            </span>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Row 1: Schedule */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#02388A',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} weight="fill" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                    {language === 'id' ? 'Jadwal Kerja (Shift)' : 'Work Schedule (Shift)'}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                    {scheduleText}
                  </span>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

              {/* Row 2: Attendance Method */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF2FF',
                    border: '1px solid #E0E7FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4F46E5',
                    flexShrink: 0,
                  }}
                >
                  <UserFocus size={18} weight="bold" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                    {language === 'id' ? 'Metode Presensi' : 'Attendance Method'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                      {attendanceMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

              {/* Row 3: Attendance Site */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706',
                    flexShrink: 0,
                  }}
                >
                  <Buildings size={18} weight="fill" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                    {language === 'id' ? 'Site / Lokasi Presensi' : 'Attendance Site'}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                    {siteName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                    {data.location && data.location !== '-' ? data.location : 'Gedung Pengelola - Area Kerja'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. HASIL PRESENSI (ATTENDANCE RESULT)
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              {language === 'id' ? 'Hasil Presensi' : 'Attendance Result'}
            </span>

            {isOff ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748B',
                  }}
                >
                  <CalendarBlank size={22} weight="fill" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                    {language === 'id' ? 'Hari Libur Terjadwal' : 'Scheduled Day Off'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {language === 'id' ? 'Tidak ada kewajiban presensi pada hari ini.' : 'No attendance required for this day.'}
                  </span>
                </div>
              </div>
            ) : isAlpha ? (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  borderRadius: '14px',
                  border: '1px solid #FEE2E2',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <WarningCircle size={22} weight="fill" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#991B1B' }}>
                    {language === 'id' ? 'Tanpa Keterangan (Alpha)' : 'Absent Without Notice (Alpha)'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#B91C1C' }}>
                    {language === 'id' ? 'Tidak ada catatan presensi masuk atau keluar di sistem.' : 'No clock-in or clock-out record found in system.'}
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* 2-Column Clock In & Clock Out Tiles */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  {/* Masuk (Clock In) */}
                  <div
                    style={{
                      backgroundColor: isLate ? '#FFFBEB' : '#F0FDF4',
                      border: `1px solid ${isLate ? '#FEF3C7' : '#DCFCE7'}`,
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <SignIn size={14} weight="bold" color={isLate ? '#D97706' : '#16A34A'} />
                        <span style={{ fontSize: '0.6875rem', color: isLate ? '#B45309' : '#15803D', fontWeight: 700 }}>
                          {language === 'id' ? 'JAM MASUK' : 'CLOCK IN'}
                        </span>
                      </div>

                      {/* Status pill */}
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          backgroundColor: isLate ? '#D97706' : '#16A34A',
                          color: '#FFFFFF',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                        }}
                      >
                        {isLate
                          ? (language === 'id' ? `Telat ${lateMinutes}m` : `Late ${lateMinutes}m`)
                          : isEarlyIn
                          ? (language === 'id' ? 'Masuk Awal' : 'Early In')
                          : (language === 'id' ? 'Tepat Waktu' : 'On Time')}
                      </span>
                    </div>

                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#334155', lineHeight: 1.1 }}>
                      {data.clockIn || '--:--'} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>WIB</span>
                    </div>

                    <div style={{ fontSize: '0.6875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={11} color="#64748B" weight="fill" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {clockInLoc}
                      </span>
                    </div>
                  </div>

                  {/* Keluar (Clock Out) */}
                  <div
                    style={{
                      backgroundColor: isEarlyOut ? '#FFFBEB' : hasClockOut ? '#F0FDF4' : '#EFF6FF',
                      border: `1px solid ${isEarlyOut ? '#FEF3C7' : hasClockOut ? '#DCFCE7' : '#DBEAFE'}`,
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <SignOut size={14} weight="bold" color={isEarlyOut ? '#D97706' : hasClockOut ? '#16A34A' : '#0284C7'} />
                        <span style={{ fontSize: '0.6875rem', color: isEarlyOut ? '#B45309' : hasClockOut ? '#15803D' : '#0369A1', fontWeight: 700 }}>
                          {language === 'id' ? 'JAM KELUAR' : 'CLOCK OUT'}
                        </span>
                      </div>

                      {/* Status pill */}
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          backgroundColor: isEarlyOut ? '#D97706' : hasClockOut ? '#16A34A' : '#0284C7',
                          color: '#FFFFFF',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                        }}
                      >
                        {isEarlyOut
                          ? (language === 'id' ? `Pulang Awal` : `Early Out`)
                          : hasClockOut
                          ? (language === 'id' ? 'Selesai' : 'Completed')
                          : (language === 'id' ? 'Bekerja' : 'Working')}
                      </span>
                    </div>

                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#334155', lineHeight: 1.1 }}>
                      {hasClockOut ? (
                        <>{data.clockOut} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>WIB</span></>
                      ) : (
                        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0284C7' }}>
                          {language === 'id' ? 'Sedang Bekerja...' : 'Working...'}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.6875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={11} color="#64748B" weight="fill" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hasClockOut ? clockOutLoc : (language === 'id' ? 'Posisi aktif di Site' : 'Active at Site')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Duration Row */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Timer size={18} weight="fill" color="#02388A" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                      {language === 'id' ? 'Total Durasi Kerja' : 'Total Work Duration'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#02388A' }}>
                    {data.duration || (language === 'id' ? 'Sedang berjalan' : 'In progress')}
                  </span>
                </div>

                {/* Status Detail & Timing Calculations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Late Analysis */}
                  <div
                    style={{
                      backgroundColor: isLate ? '#FFFBEB' : '#F0FDF4',
                      border: `1px solid ${isLate ? '#FEF3C7' : '#DCFCE7'}`,
                      borderRadius: '10px',
                      padding: '9px 12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    {isLate ? (
                      <WarningCircle size={16} weight="fill" color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <CheckCircle size={16} weight="fill" color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isLate ? '#B45309' : '#15803D' }}>
                        {isLate
                          ? (language === 'id' ? `Terlambat ${lateMinutes} Menit` : `Late by ${lateMinutes} Minutes`)
                          : isEarlyIn
                          ? (language === 'id' ? `Masuk Lebih Awal (${earlyInMinutes} Menit)` : `Early Clock-In (${earlyInMinutes} Mins)`)
                          : (language === 'id' ? 'Masuk Tepat Waktu' : 'Clocked In On Time')}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                        {isLate
                          ? (language === 'id'
                              ? `Jadwal masuk shift: 08:00 WIB • Tercatat masuk: ${data.clockIn} WIB`
                              : `Shift starts: 08:00 WIB • Clock-in: ${data.clockIn} WIB`)
                          : (language === 'id'
                              ? `Presensi masuk sebelum batas toleransi jadwal shift (08:00 WIB)`
                              : `Clock-in recorded before shift start tolerance (08:00 WIB)`)}
                      </span>
                    </div>
                  </div>

                  {/* Early Out Analysis */}
                  {hasClockOut && (
                    <div
                      style={{
                        backgroundColor: isEarlyOut ? '#FFFBEB' : '#F0FDF4',
                        border: `1px solid ${isEarlyOut ? '#FEF3C7' : '#DCFCE7'}`,
                        borderRadius: '10px',
                        padding: '9px 12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                      }}
                    >
                      {isEarlyOut ? (
                        <WarningCircle size={16} weight="fill" color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                      ) : (
                        <CheckCircle size={16} weight="fill" color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isEarlyOut ? '#B45309' : '#15803D' }}>
                          {isEarlyOut
                            ? (language === 'id' ? `Pulang Awal (${earlyOutMinutes} Menit Lebih Cepat)` : `Early Out (${earlyOutMinutes} Mins Early)`)
                            : (language === 'id' ? 'Jam Pulang Sesuai Jadwal' : 'Completed Shift On Schedule')}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                          {isEarlyOut
                            ? (language === 'id'
                                ? `Keluar pukul ${data.clockOut} WIB (Jadwal shift selesai: 17:00 WIB)`
                                : `Left at ${data.clockOut} WIB (Shift scheduled end: 17:00 WIB)`)
                            : (language === 'id'
                                ? `Presensi keluar dilakukan setelah jam operasional shift selesai (17:00 WIB)`
                                : `Clock-out recorded after shift completed (17:00 WIB)`)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Note / Activity Summary */}
                  {data.note && (
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.6875rem',
                        color: '#475569',
                      }}
                    >
                      <strong style={{ color: '#334155' }}>{language === 'id' ? 'Catatan Tugas: ' : 'Task Notes: '}</strong>
                      {data.note}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#02388A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              marginTop: '4px',
            }}
          >
            {language === 'id' ? 'Tutup Detail' : 'Close Details'}
          </button>
        </div>
      </div>
    </div>
  );

  const modalTarget = getModalTarget();
  return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
};

export default AttendanceDetailModal;

import React from 'react';
import {
  CaretLeft,
  MapPin,
  Clock,
  CalendarBlank,
  Buildings,
  CheckCircle,
  WarningCircle,
  Timer,
  SignIn,
  SignOut,
  UserFocus,
  ShieldCheck,
  Compass,
  Check,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Top Header Bar for Attendance Record Detail View
 */
export const AttendanceRecordDetailHeader = ({ onBack, data }) => {
  const { language } = useLanguage();
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: '#334155',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        height: '52px',
        borderBottom: '1px solid #F1F5F9',
        flexShrink: 0,
        zIndex: 40,
        gap: '12px',
        boxSizing: 'border-box',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        style={{
          width: '32px',
          height: '32px',
          background: 'none',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          outline: 'none',
        }}
      >
        <CaretLeft size={22} weight="bold" />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <h1
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}
        >
          {language === 'id' ? 'Detail Presensi' : 'Attendance Details'}
        </h1>
        {data && (
          <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
            {language === 'id' ? (data.date || 'Presensi Harian') : (data.dateEn || data.date || 'Daily Attendance')}
          </span>
        )}
      </div>
    </header>
  );
};

/**
 * Visual GPS Map with Radius Circle, Central Building Icon, Green Check-In Pin, and Red Check-Out Pin
 */
const AttendanceMapFull = ({ data, language }) => {
  const isOff = data?.status === 'LIBUR' || data?.status === 'off' || data?.status === 'LEAVE' || data?.status === 'IZIN';
  const isAlpha = data?.status === 'ALPHA' || data?.status === 'alpha';
  const hasClockIn = data?.clockIn && data.clockIn !== '-' && data.clockIn !== '--:--' && data.clockIn !== '-- : --';
  const hasClockOut = data?.clockOut && data.clockOut !== '-' && data.clockOut !== '--:--' && data.clockOut !== '-- : --' && data.clockOut !== 'Sedang Bekerja...';

  const siteName = data?.siteName || 'Thamrin Executive Residences';

  return (
    <div
      style={{
        width: '100%',
        height: '230px',
        borderRadius: '16px',
        backgroundColor: '#F1F5F9',
        border: '1px solid #CBD5E1',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 400 230"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <defs>
          {/* Radial gradient for geofence radius area */}
          <radialGradient id="geofenceRadiusFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.22" />
            <stop offset="75%" stopColor="#0284C7" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.04" />
          </radialGradient>

          {/* Keyframe animations for pins */}
          <style>
            {`
              @keyframes pulsePin {
                0% { transform: scale(0.9); opacity: 0.8; }
                50% { transform: scale(1.3); opacity: 0.2; }
                100% { transform: scale(0.9); opacity: 0.8; }
              }
              .pulse-green {
                transform-origin: center;
                animation: pulsePin 2.2s ease-in-out infinite;
              }
              .pulse-red {
                transform-origin: center;
                animation: pulsePin 2.2s ease-in-out infinite 0.5s;
              }
            `}
          </style>
        </defs>

        {/* 1. Base Map Background Grid & Roads */}
        <rect width="400" height="230" fill="#F8FAFC" />

        {/* Subtle Map Blocks & Landscape */}
        <path
          d="M 0,40 Q 90,20 120,80 T 30,140 Z"
          fill="#F1F5F9"
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        <path
          d="M 270,20 Q 360,10 390,70 T 310,130 Z"
          fill="#F1F5F9"
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        <path
          d="M 280,145 Q 360,125 400,180 T 300,230 Z"
          fill="#F1F5F9"
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {/* Street Lines */}
        <path
          d="M 0,115 Q 200,100 400,115"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 0,115 Q 200,100 400,115"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M 130,0 Q 145,115 155,230"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 270,0 Q 255,115 245,230"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Street Name Labels */}
        <text x="16" y="130" fontSize="7" fontWeight="600" fill="#94A3B8" fontFamily="sans-serif">
          Jl. Thamrin Boulevard
        </text>
        <text x="280" y="24" fontSize="7" fontWeight="600" fill="#94A3B8" fontFamily="sans-serif">
          Jl. Kebon Kacang Raya
        </text>

        {/* 2. LINGKARAN RADIUS (Geofence Radius Circle - Center at 200, 115, Radius: 85) */}
        <circle
          cx="200"
          cy="115"
          r="88"
          fill="url(#geofenceRadiusFill)"
          stroke="#0284C7"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <circle
          cx="200"
          cy="115"
          r="92"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Trajectory dashed line between PIN Hijau (145, 80) and PIN Merah (255, 150) */}
        {hasClockIn && (
          <g>
            <path
              d="M 145,80 Q 195,115 255,150"
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              strokeOpacity="0.8"
            />
            {/* Trajectory Distance Label Bubble */}
            <rect x="180" y="106" width="40" height="16" rx="8" fill="#02388A" />
            <text x="200" y="117" fontSize="7" fontWeight="800" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
              85 m
            </text>
          </g>
        )}

        {/* 3. ICON LOKASI BUILDING (Di tengah lingkaran radius: 200, 115) */}
        <g transform="translate(200, 115)">
          {/* Outer glow ring */}
          <circle cx="0" cy="0" r="24" fill="#FFFFFF" filter="drop-shadow(0 2px 8px rgba(2, 56, 138, 0.2))" />
          <circle cx="0" cy="0" r="20" fill="#02388A" stroke="#FFFFFF" strokeWidth="2" />

          {/* Building Icon inside Center */}
          <g transform="translate(-10, -10)">
            {/* Main Center Tower */}
            <rect x="5" y="2" width="10" height="15" rx="1" fill="#FFFFFF" />
            {/* Tower Roof */}
            <polygon points="10,-1 4,3 16,3" fill="#38BDF8" />
            {/* Windows */}
            <rect x="7" y="5" width="2" height="2" rx="0.5" fill="#02388A" />
            <rect x="11" y="5" width="2" height="2" rx="0.5" fill="#02388A" />
            <rect x="7" y="9" width="2" height="2" rx="0.5" fill="#02388A" />
            <rect x="11" y="9" width="2" height="2" rx="0.5" fill="#02388A" />
            {/* Main Door */}
            <rect x="8.5" y="13" width="3" height="4" rx="0.5" fill="#02388A" />
            {/* Left Side Wing */}
            <rect x="1" y="7" width="4" height="10" rx="0.5" fill="#E2E8F0" />
            {/* Right Side Wing */}
            <rect x="15" y="7" width="4" height="10" rx="0.5" fill="#E2E8F0" />
          </g>

          {/* Building Location Label under icon */}
          <g transform="translate(0, 30)">
            <rect
              x="-68"
              y="-8"
              width="136"
              height="18"
              rx="9"
              fill="#FFFFFF"
              stroke="#02388A"
              strokeWidth="1.2"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
            />
            <text x="0" y="4" fontSize="7.5" fontWeight="800" fill="#02388A" textAnchor="middle" fontFamily="sans-serif">
              🏢 {siteName}
            </text>
          </g>
        </g>

        {/* 4. PIN HIJAU UNTUK CHECK IN (Clock In - Posisi: 145, 80) */}
        {hasClockIn && (
          <g transform="translate(145, 80)">
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="15" fill="#16A34A" className="pulse-green" />
            <circle cx="0" cy="0" r="8" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />

            {/* Check In Tooltip Pill (Green) */}
            <g transform="translate(0, -22)">
              <rect
                x="-48"
                y="-14"
                width="96"
                height="18"
                rx="9"
                fill="#16A34A"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 5px rgba(22, 163, 74, 0.35))"
              />
              <text x="0" y="-2" fontSize="7.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
                🟢 Check In: {data.clockIn}
              </text>
              {/* Pointer triangle */}
              <polygon points="-4,4 4,4 0,8" fill="#16A34A" />
            </g>
          </g>
        )}

        {/* 5. PIN MERAH UNTUK CHECKOUT (Clock Out - Posisi: 255, 150) */}
        {hasClockOut ? (
          <g transform="translate(255, 150)">
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="15" fill="#DC2626" className="pulse-red" />
            <circle cx="0" cy="0" r="8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />

            {/* Check Out Tooltip Pill (Red) */}
            <g transform="translate(0, -22)">
              <rect
                x="-50"
                y="-14"
                width="100"
                height="18"
                rx="9"
                fill="#DC2626"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 5px rgba(220, 38, 38, 0.35))"
              />
              <text x="0" y="-2" fontSize="7.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
                🔴 Check Out: {data.clockOut}
              </text>
              {/* Pointer triangle */}
              <polygon points="-4,4 4,4 0,8" fill="#DC2626" />
            </g>
          </g>
        ) : hasClockIn ? (
          /* When clocked in but not yet checked out -> Show pending Checkout indicator */
          <g transform="translate(255, 150)">
            <circle cx="0" cy="0" r="7" fill="#DC2626" fillOpacity="0.4" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 2" />
            <g transform="translate(0, -20)">
              <rect
                x="-46"
                y="-13"
                width="92"
                height="16"
                rx="8"
                fill="#DC2626"
                fillOpacity="0.9"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
              <text x="0" y="-2" fontSize="7" fontWeight="700" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
                🔴 Belum Check Out
              </text>
              <polygon points="-4,3 4,3 0,6" fill="#DC2626" fillOpacity="0.9" />
            </g>
          </g>
        ) : null}

        {/* Off Day / Alpha note overlay if applicable */}
        {(isOff || isAlpha) && (
          <g transform="translate(200, 115)">
            <rect x="-85" y="-18" width="170" height="36" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))" />
            <text x="0" y="4" fontSize="8.5" fontWeight="800" fill={isAlpha ? '#DC2626' : '#64748B'} textAnchor="middle" fontFamily="sans-serif">
              {isAlpha
                ? (language === 'id' ? '⚠️ Tanpa Catatan Presensi' : '⚠️ No Attendance Recorded')
                : (language === 'id' ? '🏖️ Hari Libur Terjadwal' : '🏖️ Scheduled Day Off')}
            </text>
          </g>
        )}
      </svg>

      {/* Geofence Verified Badge (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          borderRadius: '9999px',
          padding: '4px 10px',
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
          {language === 'id' ? 'Radius Presensi 100m (Valid)' : '100m Attendance Radius (Valid)'}
        </span>
      </div>

      {/* GPS Coordinates Badge (Bottom-Left) */}
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

      {/* Radius Indicator Pill (Bottom-Right) */}
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
          color: '#0284C7',
          zIndex: 2,
        }}
      >
        <MapPin size={11} weight="fill" color="#0284C7" />
        <span>Radius Geofence: 100m</span>
      </div>
    </div>
  );
};

/**
 * Dedicated Full Screen View for Attendance Record Detail
 */
export const AttendanceRecordDetailView = ({ data }) => {
  const { language } = useLanguage();

  if (!data) {
    return (
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          color: '#64748B',
          fontSize: '0.875rem',
        }}
      >
        {language === 'id' ? 'Data presensi tidak ditemukan.' : 'Attendance record not found.'}
      </div>
    );
  }

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        padding: '16px',
        gap: '16px',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingBottom: '40px',
      }}
    >
      {/* =========================================================================
          SECTION 1: MAP WITH DUAL PINS
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {language === 'id' ? 'Peta Lokasi Presensi' : 'Attendance Location Map'}
          </h2>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#0284C7' }}>
            {language === 'id' ? 'GPS & Geofencing' : 'GPS & Geofencing'}
          </span>
        </div>

        <AttendanceMapFull data={data} language={language} />
      </div>

      {/* =========================================================================
          SECTION 2: INFORMASI PRESENSI (ATTENDANCE INFORMATION)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          {language === 'id' ? 'Informasi Presensi' : 'Attendance Information'}
        </h2>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Row 1: Schedule */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
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
              <Clock size={20} weight="fill" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                {language === 'id' ? 'Jadwal Kerja (Shift)' : 'Work Schedule (Shift)'}
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155' }}>
                {scheduleText}
              </span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

          {/* Row 2: Attendance Method */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
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
              <UserFocus size={20} weight="bold" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                {language === 'id' ? 'Metode Presensi' : 'Attendance Method'}
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155' }}>
                {attendanceMethod}
              </span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

          {/* Row 3: Attendance Site */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
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
              <Buildings size={20} weight="fill" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                {language === 'id' ? 'Site / Lokasi Presensi' : 'Attendance Site'}
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155' }}>
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
          SECTION 3: HASIL PRESENSI (ATTENDANCE RESULT)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          {language === 'id' ? 'Hasil Presensi' : 'Attendance Result'}
        </h2>

        {isOff ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
              }}
            >
              <CalendarBlank size={24} weight="fill" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155' }}>
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
              borderRadius: '16px',
              border: '1px solid #FEE2E2',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <WarningCircle size={24} weight="fill" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#991B1B' }}>
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
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '16px',
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
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <SignIn size={15} weight="bold" color={isLate ? '#D97706' : '#16A34A'} />
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
                      padding: '2px 7px',
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

                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#334155', lineHeight: 1.1 }}>
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
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <SignOut size={15} weight="bold" color={isEarlyOut ? '#D97706' : hasClockOut ? '#16A34A' : '#0284C7'} />
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
                      padding: '2px 7px',
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

                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#334155', lineHeight: 1.1 }}>
                  {hasClockOut ? (
                    <>{data.clockOut} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>WIB</span></>
                  ) : (
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0284C7' }}>
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
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer size={20} weight="fill" color="#02388A" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                  {language === 'id' ? 'Total Durasi Kerja' : 'Total Work Duration'}
                </span>
              </div>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#02388A' }}>
                {data.duration || (language === 'id' ? 'Sedang berjalan' : 'In progress')}
              </span>
            </div>

            {/* Status Detail & Timing Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Late Analysis */}
              <div
                style={{
                  backgroundColor: isLate ? '#FFFBEB' : '#F0FDF4',
                  border: `1px solid ${isLate ? '#FEF3C7' : '#DCFCE7'}`,
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                {isLate ? (
                  <WarningCircle size={18} weight="fill" color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <CheckCircle size={18} weight="fill" color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isLate ? '#B45309' : '#15803D' }}>
                    {isLate
                      ? (language === 'id' ? `Terlambat ${lateMinutes} Menit` : `Late by ${lateMinutes} Minutes`)
                      : isEarlyIn
                      ? (language === 'id' ? `Masuk Lebih Awal (${earlyInMinutes} Menit)` : `Early Clock-In (${earlyInMinutes} Mins)`)
                      : (language === 'id' ? 'Masuk Tepat Waktu' : 'Clocked In On Time')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                    {isLate
                      ? (language === 'id'
                          ? `Jadwal masuk shift: 08:00 WIB • Tercatat masuk: ${data.clockIn} WIB`
                          : `Shift starts: 08:00 WIB • Clock-in: ${data.clockIn} WIB`)
                      : (language === 'id'
                          ? `Presensi masuk dilakukan sebelum batas toleransi jadwal shift (08:00 WIB)`
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
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  {isEarlyOut ? (
                    <WarningCircle size={18} weight="fill" color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  ) : (
                    <CheckCircle size={18} weight="fill" color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isEarlyOut ? '#B45309' : '#15803D' }}>
                      {isEarlyOut
                        ? (language === 'id' ? `Pulang Awal (${earlyOutMinutes} Menit Lebih Cepat)` : `Early Out (${earlyOutMinutes} Mins Early)`)
                        : (language === 'id' ? 'Jam Pulang Sesuai Jadwal' : 'Completed Shift On Schedule')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
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
                    borderRadius: '12px',
                    padding: '10px 14px',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.75rem',
                    color: '#475569',
                    lineHeight: 1.4,
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
    </div>
  );
};

export default AttendanceRecordDetailView;

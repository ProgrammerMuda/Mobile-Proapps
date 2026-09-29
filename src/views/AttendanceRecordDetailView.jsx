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
 * Attendance Location Map with Warm Mapbox Streets Style
 * - Primary color (#053079) center building badge
 * - Secondary color (#09B2FF) geofence radius circle
 * - Green person pin for Check In & Red person pin for Check Out
 * - Warm Mapbox Streets aesthetic (warm beige/stone landuse, crisp white streets, pastel greens)
 */
const AttendanceMapFull = ({ data, language }) => {
  const isOff = data?.status === 'LIBUR' || data?.status === 'off' || data?.status === 'LEAVE' || data?.status === 'IZIN';
  const isAlpha = data?.status === 'ALPHA' || data?.status === 'alpha';
  const hasClockIn = data?.clockIn && data.clockIn !== '-' && data.clockIn !== '--:--' && data.clockIn !== '-- : --';
  const hasClockOut = data?.clockOut && data.clockOut !== '-' && data.clockOut !== '--:--' && data.clockOut !== '-- : --' && data.clockOut !== 'Sedang Bekerja...';

  return (
    <div
      style={{
        width: '100%',
        height: '240px',
        borderRadius: '16px',
        backgroundColor: '#EBE9E4',
        border: '1px solid #E2E8F0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* SVG Map Canvas with authentic Warm Mapbox Streets palette */}
      <svg
        viewBox="0 0 400 240"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        {/* 1. Base Map Warm Stone/Beige Canvas */}
        <rect width="400" height="240" fill="#E8E5DF" />

        {/* Warm Land Parcels & Urban Blocks */}
        <path d="M 0,0 L 115,0 L 100,70 L 0,60 Z" fill="#F4F2EC" />
        <path d="M 130,0 L 235,0 L 225,50 L 115,55 Z" fill="#F4F2EC" />
        <path d="M 245,0 L 340,0 L 330,60 L 235,55 Z" fill="#F4F2EC" />
        <path d="M 350,0 L 400,0 L 400,80 L 340,65 Z" fill="#F4F2EC" />

        <path d="M 0,75 L 85,85 L 70,170 L 0,165 Z" fill="#F4F2EC" />
        <path d="M 315,75 L 400,90 L 400,180 L 305,170 Z" fill="#F4F2EC" />

        <path d="M 0,180 L 70,185 L 55,240 L 0,240 Z" fill="#F4F2EC" />
        <path d="M 75,190 L 170,185 L 160,240 L 65,240 Z" fill="#F4F2EC" />
        <path d="M 180,190 L 270,185 L 265,240 L 170,240 Z" fill="#F4F2EC" />
        <path d="M 280,180 L 400,190 L 400,240 L 275,240 Z" fill="#F4F2EC" />

        {/* Secondary Warm Parcel Blocks (Slightly warmer beige tone) */}
        <path d="M 115,75 L 175,70 L 170,105 L 110,102 Z" fill="#EFECE5" />
        <path d="M 110,115 L 170,118 L 165,160 L 105,155 Z" fill="#EFECE5" />
        <path d="M 220,70 L 285,75 L 280,115 L 215,110 Z" fill="#EFECE5" />
        <path d="M 215,125 L 280,128 L 275,170 L 210,165 Z" fill="#EFECE5" />

        {/* Parks & Vegetation (Soft Lime / Pastel Green) */}
        <path d="M 45,8 L 75,14 L 68,36 L 38,30 Z" fill="#D8EBCF" stroke="#C8DFBE" strokeWidth="0.8" />
        <path d="M 368,110 L 396,110 L 396,140 L 368,140 Z" fill="#D8EBCF" stroke="#C8DFBE" strokeWidth="0.8" />
        <path d="M 68,228 L 84,228 L 84,240 L 68,240 Z" fill="#D8EBCF" />
        <path d="M 360,20 L 380,20 L 375,35 L 355,35 Z" fill="#D8EBCF" />

        {/* Subtle Mapbox Building Footprints (Warm Light Grey/Cream) */}
        <rect x="25" y="100" width="22" height="16" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />
        <rect x="52" y="105" width="18" height="24" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />
        <rect x="330" y="100" width="28" height="20" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />
        <rect x="335" y="130" width="20" height="18" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />
        <rect x="130" y="15" width="25" height="18" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />
        <rect x="270" y="18" width="22" height="20" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />
        <rect x="105" y="200" width="28" height="18" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />
        <rect x="210" y="202" width="24" height="20" rx="1" fill="#DFDBD1" stroke="#D3CFCE" strokeWidth="0.5" />

        {/* Road Casings (Warm soft border stroke) */}
        <path d="M -10,65 Q 180,130 410,60" fill="none" stroke="#D5D1C6" strokeWidth="18" strokeLinecap="round" />
        <path d="M -10,175 Q 190,180 410,180" fill="none" stroke="#D5D1C6" strokeWidth="18" strokeLinecap="round" />
        <path d="M 100,-10 Q 90,110 70,250" fill="none" stroke="#D5D1C6" strokeWidth="15" strokeLinecap="round" />
        <path d="M 215,-10 Q 215,115 240,250" fill="none" stroke="#D5D1C6" strokeWidth="15" strokeLinecap="round" />
        <path d="M 320,-10 Q 300,115 285,250" fill="none" stroke="#D5D1C6" strokeWidth="15" strokeLinecap="round" />

        {/* Road Surfaces (Crisp Pure White) */}
        <path d="M -10,65 Q 180,130 410,60" fill="none" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
        <path d="M -10,175 Q 190,180 410,180" fill="none" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
        <path d="M 100,-10 Q 90,110 70,250" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
        <path d="M 215,-10 Q 215,115 240,250" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
        <path d="M 320,-10 Q 300,115 285,250" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />

        {/* Secondary Inner Building Block White Lanes */}
        <path d="M 115,100 L 190,95 L 185,145 L 110,140 Z" fill="none" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M 225,95 L 295,100 L 290,150 L 220,145 Z" fill="none" stroke="#FFFFFF" strokeWidth="5" />

        {/* Street & Landmark Labels */}
        <text x="18" y="185" fontSize="7.5" fontWeight="600" fill="#64748B" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.2px">
          Jalan Senopati
        </text>
        <text x="295" y="85" fontSize="8" fontWeight="700" fill="#475569" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.2px">
          Senayan
        </text>
        <text x="6" y="235" fontSize="7.5" fontWeight="600" fill="#64748B" fontFamily="system-ui, -apple-system, sans-serif">
          OK I
        </text>

        {/* Yellow/Orange Restaurant POI (matching reference) */}
        <g transform="translate(173, 230)">
          <circle cx="0" cy="0" r="6" fill="#F59E0B" />
          <path d="M -2.5,-3.5 L -2.5,0.5 L -1.5,0.5 L -1.5,3.5 L -0.5,3.5 L -0.5,0.5 L 0.5,0.5 L 0.5,-3.5 L -0.5,-3.5 L -0.5,-1.5 L -1.5,-1.5 L -1.5,-3.5 Z" fill="#FFFFFF" transform="scale(0.8) translate(0, -0.5)" />
          <path d="M 1.5,-3.5 Q 3,-3.5 3,-1 Q 3,0.5 2,1 L 2,3.5 L 1,3.5 L 1,0.5 L 1.5,0.5 Z" fill="#FFFFFF" transform="scale(0.8) translate(0, -0.5)" />
        </g>

        {/* 2. SECONDARY COLOR GEOFENCE RADIUS CIRCLE (#09B2FF) */}
        <circle
          cx="195"
          cy="115"
          r="96"
          fill="#09B2FF"
          fillOpacity="0.16"
          stroke="#09B2FF"
          strokeWidth="2.5"
        />

        {/* 3. PRIMARY COLOR CENTER BUILDING BADGE (#053079) */}
        <g transform="translate(195, 115)">
          {/* Primary Color Circle */}
          <circle cx="0" cy="0" r="19" fill="#053079" />

          {/* White Building Graphic */}
          <g transform="translate(-8, -8)">
            {/* Center Main Building */}
            <rect x="3" y="1" width="10" height="14" rx="0.5" fill="#FFFFFF" />
            {/* Windows in main building */}
            <rect x="4.5" y="3" width="2" height="2" rx="0.3" fill="#053079" />
            <rect x="9.5" y="3" width="2" height="2" rx="0.3" fill="#053079" />
            <rect x="4.5" y="6.5" width="2" height="2" rx="0.3" fill="#053079" />
            <rect x="9.5" y="6.5" width="2" height="2" rx="0.3" fill="#053079" />
            {/* Center door */}
            <rect x="7" y="10" width="2" height="5" rx="0.3" fill="#053079" />

            {/* Left side wing */}
            <rect x="0" y="6" width="3" height="9" rx="0.3" fill="#FFFFFF" />
            <rect x="0.8" y="7.5" width="1.4" height="1.5" rx="0.2" fill="#053079" />

            {/* Right side wing */}
            <rect x="13" y="6" width="3" height="9" rx="0.3" fill="#FFFFFF" />
            <rect x="13.8" y="7.5" width="1.4" height="1.5" rx="0.2" fill="#053079" />
          </g>
        </g>

        {/* 4. PIN HIJAU UNTUK CHECK IN (Top-Left: 145, 70) */}
        <g transform="translate(145, 70)">
          {/* Teardrop Pin Shape (Green) */}
          <path
            d="M 0,0 C -9,-9 -18,-18 -18,-29 C -18,-39 -10,-47 0,-47 C 10,-47 18,-39 18,-29 C 18,-18 9,-9 0,0 Z"
            fill="#DCFCE7"
            stroke="#22C55E"
            strokeWidth="1.5"
          />

          {/* Inner Dark Green Circle */}
          <circle cx="0" cy="-28" r="12" fill="#16A34A" />

          {/* White Person Avatar Icon inside Green Pin */}
          <g transform="translate(0, -28)">
            {/* Person Head */}
            <circle cx="0" cy="-3.5" r="3" fill="#FFFFFF" />
            {/* Person Body/Shoulders */}
            <path
              d="M -5.5,5.5 C -5.5,1.5 -2.5,0.5 0,0.5 C 2.5,0.5 5.5,1.5 5.5,5.5 Z"
              fill="#FFFFFF"
            />
          </g>
        </g>

        {/* 5. PIN MERAH UNTUK CHECK OUT (Bottom-Right: 240, 155) */}
        <g transform="translate(240, 155)">
          {/* Teardrop Pin Shape (Red) */}
          <path
            d="M 0,0 C -9,-9 -18,-18 -18,-29 C -18,-39 -10,-47 0,-47 C 10,-47 18,-39 18,-29 C 18,-18 9,-9 0,0 Z"
            fill="#FEE2E2"
            stroke="#EF4444"
            strokeWidth="1.5"
          />

          {/* Inner Dark Red Circle */}
          <circle cx="0" cy="-28" r="12" fill="#DC2626" />

          {/* White Person Avatar Icon inside Red Pin */}
          <g transform="translate(0, -28)">
            {/* Person Head */}
            <circle cx="0" cy="-3.5" r="3" fill="#FFFFFF" />
            {/* Person Body/Shoulders */}
            <path
              d="M -5.5,5.5 C -5.5,1.5 -2.5,0.5 0,0.5 C 2.5,0.5 5.5,1.5 5.5,5.5 Z"
              fill="#FFFFFF"
            />
          </g>
        </g>

        {/* Off Day / Alpha note overlay if applicable */}
        {(isOff || isAlpha) && (
          <g transform="translate(195, 115)">
            <rect x="-85" y="-18" width="170" height="36" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="0" y="4" fontSize="8.5" fontWeight="800" fill={isAlpha ? '#DC2626' : '#64748B'} textAnchor="middle" fontFamily="sans-serif">
              {isAlpha
                ? (language === 'id' ? '⚠️ Tanpa Catatan Presensi' : '⚠️ No Attendance Recorded')
                : (language === 'id' ? '🏖️ Hari Libur Terjadwal' : '🏖️ Scheduled Day Off')}
            </text>
          </g>
        )}
      </svg>

      {/* Mapbox Floating UI Controls (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          aria-label="Zoom in"
          style={{
            width: '26px',
            height: '26px',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: '1px solid #F1F5F9',
            padding: 0,
          }}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          style={{
            width: '26px',
            height: '26px',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          −
        </button>
      </div>

      {/* Mapbox Watermark Logo (Bottom Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          left: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(2px)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: 800,
          color: '#1E293B',
          letterSpacing: '-0.2px',
          zIndex: 10,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#3B82F6" />
          <path d="M12 6L16 14L12 12L8 14L12 6Z" fill="#FFFFFF" />
        </svg>
        <span>mapbox</span>
      </div>

      {/* Mapbox & OSM Attribution (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(2px)',
          padding: '1px 5px',
          borderRadius: '3px',
          fontSize: '7.5px',
          color: '#64748B',
          zIndex: 10,
        }}
      >
        © Mapbox © OpenStreetMap
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

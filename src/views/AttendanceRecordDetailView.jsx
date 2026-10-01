import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  CaretLeft,
  MapPin,
  Clock,
  CalendarBlank,
  Buildings,
  User,
  Camera,
  QrCode,
  CheckCircle,
  WarningCircle,
  Timer,
  SignIn,
  SignOut,
  UserFocus,
  ShieldCheck,
  Check,
  ArrowsInCardinal,
  ArrowsOut,
  X,
} from '@phosphor-icons/react';
import avatarUser from '../assets/avatar-user.jpg';
import clockInSelfie from '../assets/attendance-clockin-selfie.jpg';
import clockOutSelfie from '../assets/attendance-clockout-selfie.jpg';
import { useLanguage } from '../context/LanguageContext';
import { getAttendanceLocations } from '../models/attendanceLocations';

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
 * Helper to remove any duplicate WIB substring
 */
const cleanTime = (val) => {
  if (!val || val === '-' || val === '--:--' || val === '-- : --') return '';
  return String(val).replace(/\s*WIB\s*/gi, '').trim();
};

/** One map shared by independently recorded clock-in and clock-out locations. */
const AttendanceMapFull = ({ data, language }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [focusedClock, setFocusedClock] = useState(null);
  const locations = getAttendanceLocations(data);
  const isId = language === 'id';

  useEffect(() => {
    const entries = getAttendanceLocations(data).filter((entry) => entry.available);
    const map = L.map(mapContainerRef.current, {
      center: entries[0]?.coords || [-6.2275, 106.8058],
      zoom: 17,
      minZoom: 3,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true,
    });
    mapInstanceRef.current = map;
    markersRef.current = {};
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const buildingSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M240,208h-8V72a8,8,0,0,0-8-8H184V40a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8V96H32a8,8,0,0,0-8,8V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM80,176H64a8,8,0,0,1,0-16H80a8,8,0,0,1,0,16Zm0-32H64a8,8,0,0,1,0-16H80a8,8,0,0,1,0,16Zm64,64H112V168h32Zm-8-64H120a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H120a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H120a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm56,96H176a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H176a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H176a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Z"/></svg>`;

    const buildingIcon = L.divIcon({
      className: 'real-map-building-icon',
      html: `
        <div style="
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #053079;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          box-shadow: 0 4px 12px rgba(5, 48, 121, 0.4);
          cursor: pointer;
        ">
          ${buildingSvgString}
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const renderedSites = new Set();

    const userFillSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"/></svg>`;

    entries.forEach((entry) => {
      const color = entry.key === 'in' ? '#16A34A' : '#DC2626';
      const icon = L.divIcon({
        className: entry.key === 'in' ? 'real-map-checkin-icon' : 'real-map-checkout-icon',
        html: `
          <div style="filter: drop-shadow(0px 2.5px 2px rgba(15, 23, 42, 0.22)); width: 44px; height: 56px; position: relative; cursor: pointer;">
            <svg width="44" height="56" viewBox="0 0 44 56" fill="none" style="display: block;">
              <path d="M 22,56 C 10,44 0,32 0,22 C 0,10 10,0 22,0 C 34,0 44,10 44,22 C 44,32 34,44 22,56 Z" fill="${entry.key === 'in' ? '#DCFCE7' : '#FEE2E2'}" stroke="${entry.key === 'in' ? '#22C55E' : '#EF4444'}" stroke-width="2"/>
              <circle cx="22" cy="22" r="15" fill="${color}"/>
            </svg>
            <div style="position: absolute; top: 0; left: 0; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
              ${userFillSvgString}
            </div>
          </div>
        `,
        iconSize: [44, 56],
        iconAnchor: [22, 56],
        popupAnchor: [0, -44],
      });
      // Text nodes keep site names and recorded times out of HTML interpolation.
      const popup = document.createElement('div');
      popup.style.cssText = 'font: 12px var(--font-sans); line-height: 1.5; max-width: 180px;';
      const heading = document.createElement('strong');
      heading.style.color = color;
      heading.textContent = `${entry.key === 'in' ? 'Clock In' : 'Clock Out'} · ${cleanTime(entry.time)} WIB`;
      const site = document.createElement('div');
      site.textContent = entry.siteName;
      popup.append(heading, site);
      const marker = L.marker(entry.coords, {
        icon,
        zIndexOffset: 200,
        title: `${entry.key === 'in' ? 'Clock In' : 'Clock Out'}: ${entry.siteName}`,
      }).addTo(map).bindPopup(popup, { autoPan: false, closeButton: false });
      marker.on('click', () => setFocusedClock(entry.key));
      markersRef.current[entry.key] = marker;
      const siteKey = entry.siteCoords?.join(',');
      if (siteKey && !renderedSites.has(siteKey)) {
        renderedSites.add(siteKey);
        L.circle(entry.siteCoords, {
          radius: 140,
          color: '#09B2FF',
          fillColor: '#09B2FF',
          fillOpacity: 0.18,
          weight: 2.5,
        }).addTo(map);
        const siteLabel = document.createElement('strong');
        siteLabel.textContent = entry.siteName;
        siteLabel.style.cssText = 'font: 700 12px var(--font-sans); color: #053079;';
        L.marker(entry.siteCoords, {
          icon: buildingIcon,
          zIndexOffset: 100,
          title: entry.siteName,
        }).addTo(map).bindPopup(siteLabel, {
          offset: [0, -18],
          closeButton: false,
          autoPan: false,
        });
      }
    });

    const showBounds = () => {
      map.invalidateSize();
      if (entries.length) {
        map.fitBounds(L.latLngBounds(entries.flatMap((entry) => entry.siteCoords ? [entry.coords, entry.siteCoords] : [entry.coords])), {
          paddingTopLeft: [45, 70], paddingBottomRight: [45, 35], maxZoom: 17,
          animate: false,
        });
      }
    };
    showBounds();
    const observer = new ResizeObserver(showBounds);
    observer.observe(mapContainerRef.current);
    return () => {
      observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, [data, language]);

  const focusLocation = (entry) => {
    const map = mapInstanceRef.current;
    const marker = markersRef.current[entry.key];
    if (!map || !marker) return;
    map.stop();
    map.closePopup();
    setFocusedClock(entry.key);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      map.setView(entry.coords, 17);
    } else {
      map.flyTo(entry.coords, 17, { duration: 1.1 });
    }
    marker.openPopup();
  };

  const showAll = () => {
    const map = mapInstanceRef.current;
    const entries = locations.filter((entry) => entry.available);
    if (!map || !entries.length) return;
    map.stop();
    map.closePopup();
    setFocusedClock(null);
    map.fitBounds(L.latLngBounds(entries.flatMap((entry) => entry.siteCoords ? [entry.coords, entry.siteCoords] : [entry.coords])), {
      paddingTopLeft: [45, 70], paddingBottomRight: [45, 35], maxZoom: 17,
      animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ height: '260px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#EAF0F5' }}>
        <div ref={mapContainerRef} aria-label={isId ? 'Peta lokasi clock in dan clock out' : 'Clock in and clock out locations'} style={{ height: '100%', width: '100%', zIndex: 1 }} />
        <button type="button" onClick={showAll} disabled={!locations.some((entry) => entry.available)} style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 500, display: 'flex', alignItems: 'center', gap: '6px', minHeight: '36px', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#FFFFFF', color: '#053079', fontFamily: 'inherit', fontSize: '11px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #0F172A14' }}>
          <ArrowsInCardinal size={16} weight="bold" />{isId ? 'Semua lokasi' : 'Show all locations'}
        </button>
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 500, display: 'flex', flexDirection: 'column', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px #0F172A14' }}>
          {[1, -1].map((direction) => (
            <button key={direction} type="button" aria-label={direction === 1 ? 'Zoom in' : 'Zoom out'} onClick={() => mapInstanceRef.current?.setZoom(mapInstanceRef.current.getZoom() + direction)} style={{ width: '36px', height: '36px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#334155', fontSize: '20px', cursor: 'pointer' }}>{direction === 1 ? '+' : '−'}</button>
          ))}
        </div>
        {!locations.some((entry) => entry.available) && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 450, display: 'grid', placeItems: 'center', pointerEvents: 'none', background: '#FFFFFF70' }}>
            <span style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', color: '#64748B', fontSize: '12px', fontWeight: 600 }}>{isId ? 'Tidak ada lokasi presensi' : 'No attendance locations'}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {locations.map((entry) => {
          const selected = focusedClock === entry.key;
          const isIn = entry.key === 'in';
          const color = isIn ? '#15803D' : '#DC2626';
          const Icon = isIn ? SignIn : SignOut;
          return (
            <button key={entry.key} type="button" disabled={!entry.available} aria-pressed={selected} onClick={() => focusLocation(entry)} style={{ minWidth: 0, textAlign: 'left', padding: '12px', borderRadius: '12px', border: `1px solid ${selected ? color : '#E2E8F0'}`, background: selected ? (isIn ? '#F0FDF4' : '#FEF2F2') : '#FFFFFF', fontFamily: 'inherit', cursor: entry.available ? 'pointer' : 'default', opacity: entry.available ? 1 : 0.55, display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: selected ? `0 0 0 1px ${color}` : 'none' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color, fontSize: '11px', fontWeight: 800 }}><Icon size={16} weight="bold" />{isId ? 'Lihat' : 'Show'} {isIn ? 'Clock In' : 'Clock Out'}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>{entry.siteName}</span>
              <span style={{ fontSize: '10px', color: '#64748B', lineHeight: 1.4 }}>{entry.available ? `${cleanTime(entry.time)} WIB` : (isId ? 'Lokasi belum tersedia' : 'Location unavailable')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Dedicated Full Screen View for Attendance Record Detail
 */
export const AttendanceRecordDetailView = ({ data }) => {
  const { language } = useLanguage();
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

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
  const [inLocation, outLocation] = getAttendanceLocations(data);
  
  // Attendance Method: only Foto or Scan QR
  const isQrMethod = data.attendanceMethod?.toLowerCase().includes('qr') || data.method?.toLowerCase().includes('qr');
  const attendanceMethod = isQrMethod ? 'Scan QR' : 'Foto';


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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284C7',
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

          {/* Row 2: Attendance Method (Hanya Foto / Scan QR) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284C7',
                flexShrink: 0,
              }}
            >
              {isQrMethod ? (
                <QrCode size={20} weight="bold" />
              ) : (
                <Camera size={20} weight="fill" />
              )}
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
            {/* Clock In & Clock Out - Vertical Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Masuk (Clock In) */}
              <div
                style={{
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <SignIn size={16} weight="bold" color={isLate ? '#D97706' : '#16A34A'} />
                    <span style={{ fontSize: '0.75rem', color: isLate ? '#B45309' : '#15803D', fontWeight: 700 }}>
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
                      padding: '2px 8px',
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

                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#334155', lineHeight: 1.1 }}>
                  {cleanTime(data.clockIn) || '--:--'} <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>WIB</span>
                </div>

                <div style={{ height: '1px', backgroundColor: '#E2E8F0', width: '100%' }} />

<div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700 }}>{inLocation.siteName}</div>

                {/* Location info */}
                <div style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, flexWrap: 'wrap' }}>
                  <MapPin size={13} color="#09B2FF" weight="fill" style={{ flexShrink: 0 }} />
                  <span>
                    {inLocation.coords?.join(', ') || '—'}
                  </span>
                  <span style={{ color: '#94A3B8', fontWeight: 400 }}>•</span>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    Radius: {inLocation.distanceLabel || data.clockInRadius || '8m'}
                  </span>
                </div>
              </div>

              {/* Keluar (Clock Out) */}
              <div
                style={{
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <SignOut size={16} weight="bold" color={isEarlyOut ? '#D97706' : hasClockOut ? '#DC2626' : '#94A3B8'} />
                    <span style={{ fontSize: '0.75rem', color: isEarlyOut ? '#B45309' : hasClockOut ? '#DC2626' : '#64748B', fontWeight: 700 }}>
                      {language === 'id' ? 'JAM KELUAR' : 'CLOCK OUT'}
                    </span>
                  </div>

                  {/* Only show early departure or an ongoing shift. */}
                  {(isEarlyOut || !hasClockOut) && <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      backgroundColor: isEarlyOut ? '#D97706' : '#94A3B8',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {isEarlyOut
                      ? (language === 'id' ? `Pulang Awal` : `Early Out`)
                      : (language === 'id' ? 'Bekerja' : 'Working')}
                  </span>}
                </div>

                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#334155', lineHeight: 1.1 }}>
                  {hasClockOut ? (
                    <>{cleanTime(data.clockOut)} <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>WIB</span></>
                  ) : (
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#64748B' }}>
                      {language === 'id' ? 'Sedang Bekerja...' : 'Working...'}
                    </span>
                  )}
                </div>

                <div style={{ height: '1px', backgroundColor: '#E2E8F0', width: '100%' }} />

<div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700 }}>{hasClockOut ? outLocation.siteName : '—'}</div>

                {/* Location info */}
                <div style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, flexWrap: 'wrap' }}>
                  <MapPin size={13} color="#09B2FF" weight="fill" style={{ flexShrink: 0 }} />
                  {hasClockOut ? (
                    <>
                      <span>
                        {outLocation.coords?.join(', ') || '—'}
                      </span>
                      <span style={{ color: '#94A3B8', fontWeight: 400 }}>•</span>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                        Radius: {outLocation.distanceLabel || data.clockOutRadius || '12m'}
                      </span>
                    </>
                  ) : (
                    <span>{language === 'id' ? 'Menunggu clock out...' : 'Awaiting clock out...'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Total Duration Row */}
            <div
              style={{
                backgroundColor: '#053079',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid #053079',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer size={20} weight="fill" color="#FFFFFF" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {language === 'id' ? 'Total Durasi Kerja' : 'Total Work Duration'}
                </span>
              </div>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#09B2FF' }}>
                {data.duration || (language === 'id' ? 'Sedang berjalan' : 'In progress')}
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: BUKTI PRESENSI (ATTENDANCE EVIDENCE / PHOTOS)
            ========================================================================= */}
        {!isOff && !isAlpha && (
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
                {language === 'id' ? 'Bukti Presensi' : 'Attendance Evidence'}
              </h2>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B' }}>
                {language === 'id' ? 'Foto Selfie' : 'Selfie Photos'}
              </span>
            </div>

            {/* 2 Separate Standalone Cards - Kanan Kiri (Grid 1fr 1fr) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Card 1: Clock In (Kiri) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <SignIn size={15} weight="bold" color="#16A34A" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D' }}>
                    {language === 'id' ? 'CLOCK IN' : 'CLOCK IN'}
                  </span>
                </div>

                {/* Photo Frame - Square / Kotak */}
                <div
                  onClick={() => {
                    const photoSrc = data.clockInPhoto || data.clockInSelfie || clockInSelfie;
                    setSelectedPhotoModal({
                      src: photoSrc,
                      title: language === 'id' ? 'Foto Presensi Masuk' : 'Clock In Attendance Photo',
                      time: `${cleanTime(data.clockIn) || '07:42'} WIB`,
                      date: data.date || 'Hari ini',
                      status: isLate
                        ? (language === 'id' ? `Telat ${lateMinutes}m` : `Late ${lateMinutes}m`)
                        : (language === 'id' ? 'Tepat Waktu' : 'On Time'),
                      statusBg: isLate ? '#D97706' : '#16A34A',
                      coords: inLocation.coords?.join(', ') || '—',
                    });
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  <img
                    src={data.clockInPhoto || data.clockInSelfie || clockInSelfie}
                    alt="Clock In Selfie"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: '4px',
                      bottom: '4px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: '3px',
                      padding: '2px 5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      color: '#FFFFFF',
                      fontSize: '0.5625rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <ArrowsOut size={10} weight="bold" />
                    <span>{language === 'id' ? 'Lihat' : 'View'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Clock Out (Kanan) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <SignOut size={15} weight="bold" color="#DC2626" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>
                    {language === 'id' ? 'CLOCK OUT' : 'CLOCK OUT'}
                  </span>
                </div>

                {/* Photo Frame or Placeholder - Square / Kotak */}
                {hasClockOut ? (
                  <div
                    onClick={() => {
                      const photoSrc = data.clockOutPhoto || data.clockOutSelfie || clockOutSelfie;
                      setSelectedPhotoModal({
                        src: photoSrc,
                        title: language === 'id' ? 'Foto Presensi Keluar' : 'Clock Out Attendance Photo',
                        time: `${cleanTime(data.clockOut) || '17:05'} WIB`,
                        date: data.date || 'Hari ini',
                        status: isEarlyOut
                          ? (language === 'id' ? `Pulang Awal` : `Early Out`)
                          : (language === 'id' ? 'Selesai' : 'Completed'),
                        statusBg: isEarlyOut ? '#D97706' : '#DC2626',
                        coords: outLocation.coords?.join(', ') || '—',
                      });
                    }}
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '100%',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    <img
                      src={data.clockOutPhoto || data.clockOutSelfie || clockOutSelfie}
                      alt="Clock Out Selfie"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '4px',
                        bottom: '4px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        borderRadius: '3px',
                        padding: '2px 5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        color: '#FFFFFF',
                        fontSize: '0.5625rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(2px)',
                      }}
                    >
                      <ArrowsOut size={10} weight="bold" />
                      <span>{language === 'id' ? 'Lihat' : 'View'}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      paddingTop: '100%',
                      borderRadius: '4px',
                      position: 'relative',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px dashed #CBD5E1',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <Camera size={22} weight="duotone" color="#94A3B8" />
                      <span style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600, lineHeight: 1.2 }}>
                        {language === 'id' ? 'Belum Ada Foto' : 'No Photo Yet'}
                      </span>
                      <span style={{ fontSize: '0.5625rem', color: '#94A3B8' }}>
                        {language === 'id' ? 'Menunggu Checkout' : 'Awaiting Clock Out'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Image Modal */}
      {selectedPhotoModal && (
        <div
          onClick={() => setSelectedPhotoModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '340px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} weight="fill" color="#02388A" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                  {selectedPhotoModal.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Modal Image */}
            <div style={{ position: 'relative', width: '100%', backgroundColor: '#000000' }}>
              <img
                src={selectedPhotoModal.src}
                alt={selectedPhotoModal.title}
                style={{
                  width: '100%',
                  maxHeight: '320px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 700 }}>{selectedPhotoModal.time}</span>
                  <span style={{ fontSize: '0.6875rem', color: '#CBD5E1' }}>{selectedPhotoModal.coords}</span>
                </div>
                <span
                  style={{
                    backgroundColor: selectedPhotoModal.statusBg || '#16A34A',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedPhotoModal.status}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {language === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecordDetailView;

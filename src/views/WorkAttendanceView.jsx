import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  CaretLeft,
  CaretRight,
  Clock,
  SignIn,
  SignOut,
  MapPin,
  CalendarCheck,
  FileText,
  ChartLineUp,
  Receipt,
  CheckCircle,
  WarningCircle,
  XCircle,
  X,
  Camera,
  ArrowsClockwise,
  Info,
  CalendarBlank,
  UserCheck,
  Buildings,
  ShieldCheck,
  Sparkle,
  Hourglass,
  SlidersHorizontal,
  MagnifyingGlass,
  Check,
  NavigationArrow,
  Sun,
  MoonStars,
  QrCode,
  Scan,
  Lightning,
  CornersOut,
  UserFocus,
} from '@phosphor-icons/react';

// Import Illustrations
import {
  outOfRangeLocation,
  successCheck,
  clipboardChecklist,
  emptyStateQuestion,
} from '../assets/illustrations';

/**
 * Top Header for Work Attendance
 */
export const WorkAttendanceHeader = ({ onBack, currentDate = new Date(2026, 8, 28) }) => {
  const { language } = useLanguage();

  const formattedDate = currentDate.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '16px 20px',
        backgroundColor: '#02388A',
        color: '#FFFFFF',
        boxSizing: 'border-box',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <CaretLeft size={24} weight="bold" />
      </button>

      <h1
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          margin: 0,
          color: '#FFFFFF',
          letterSpacing: '-0.2px',
          textAlign: 'center',
          flex: 1,
        }}
      >
        {language === 'id' ? 'Presensi Kerja' : 'Work Attendance'}
      </h1>

      <div style={{ width: '32px' }} />
    </div>
  );
};

/**
 * Main Work Attendance View
 */
export const WorkAttendanceView = ({ user, onBack, onNavigateMenu }) => {
  const { language } = useLanguage();

  // State: Clock In / Out status
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [elapsedDuration, setElapsedDuration] = useState('00j 00m');

  // Modals state
  const [isMethodSheetOpen, setIsMethodSheetOpen] = useState(false);
  const [attendanceMethod, setAttendanceMethod] = useState('QR'); // 'QR' | 'PHOTO'
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isSelfieFullscreenOpen, setIsSelfieFullscreenOpen] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [actionType, setActionType] = useState('CLOCK_IN'); // 'CLOCK_IN' | 'CLOCK_OUT'
  const [isOutOfRadius, setIsOutOfRadius] = useState(false);
  const [isOutOfRadiusSheetOpen, setIsOutOfRadiusSheetOpen] = useState(false);
  const [isCheckInPageOpen, setIsCheckInPageOpen] = useState(false);
  const [isPreviewPhotoOpen, setIsPreviewPhotoOpen] = useState(false);
  const [checkInSnapshot, setCheckInSnapshot] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  // Front camera stream & video ref
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Real GPS coordinates state with realistic fallback
  const [userCoords, setUserCoords] = useState({ lat: -6.208824, lng: 106.845598 });

  // Geolocation lookup
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (pos && pos.coords) {
            setUserCoords({
              lat: Number(pos.coords.latitude.toFixed(6)),
              lng: Number(pos.coords.longitude.toFixed(6)),
            });
          }
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Front Camera setup for Full-Screen Selfie
  useEffect(() => {
    if (isSelfieFullscreenOpen && !capturedSelfie) {
      let isMounted = true;
      const startCamera = async () => {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
              audio: false,
            });
            if (isMounted) {
              streamRef.current = stream;
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(() => {});
              }
              setCameraError(false);
            } else {
              stream.getTracks().forEach((track) => track.stop());
            }
          } else {
            setCameraError(true);
          }
        } catch (err) {
          console.warn('Front camera not accessible, using interactive simulation:', err);
          if (isMounted) setCameraError(true);
        }
      };

      startCamera();

      return () => {
        isMounted = false;
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [isSelfieFullscreenOpen, capturedSelfie]);

  // Handle taking selfie photo
  const handleTakeSelfie = () => {
    if (videoRef.current && !cameraError) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        // Mirror front camera horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedSelfie(dataUrl);
      } catch (e) {
        setCapturedSelfie('simulated_photo');
      }
    } else {
      setCapturedSelfie('simulated_photo');
    }
  };

  const handleRetakeSelfie = () => {
    setCapturedSelfie(null);
  };

  const handleUsePhoto = () => {
    const photoToUse = capturedSelfie || 'simulated_photo';
    setCheckInSnapshot({
      photo: photoToUse,
      time: currentTime || '08:14:00 WIB',
      timeShort: currentTime ? currentTime.substring(0, 5) : '08:14',
      date: '28 Sep 2026',
      location: baseLocationName,
      coords: userCoords,
      actionType: actionType,
    });
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsSelfieFullscreenOpen(false);
    if (isOutOfRadius) {
      setIsOutOfRadiusSheetOpen(true);
    } else {
      setIsCheckInPageOpen(true);
    }
  };

  const handleFinalCheckIn = () => {
    setIsCheckInPageOpen(false);
    handleConfirmClock();
  };

  const handleCloseSelfieCamera = () => {
    setIsSelfieFullscreenOpen(false);
    setCapturedSelfie(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // History Filter state
  const [historyFilter, setHistoryFilter] = useState('ALL'); // 'ALL' | 'HADIR' | 'TERLAMBAT' | 'LIBUR'

  // Permission form state
  const [permType, setPermType] = useState('LEAVE');
  const [permReason, setPermReason] = useState('');
  const [permSuccess, setPermSuccess] = useState(false);

  // Time of Day state (Pagi/Siang vs Malam)
  const [isNightTime, setIsNightTime] = useState(false);

  // Live Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      setIsNightTime(currentHour < 6 || currentHour >= 18);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} WIB`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const roleCode = user?.roleCode || 'BM';
  const isEng = roleCode === 'ENG';
  const isHk = roleCode === 'HK';
  const isSec = roleCode === 'SEC';

  const userName = user?.name || (isEng ? 'Dedi Kurniawan' : isHk ? 'Rina Melati' : isSec ? 'Bambang Wijaya' : 'Ahmad Pratama');
  const userDept = user?.unitOrDept || (isEng ? 'Engineering Division' : isHk ? 'Housekeeping Division' : isSec ? 'Security Division' : 'Building Management');
  const empId = isEng ? 'ENG-8821' : isHk ? 'HK-4419' : isSec ? 'SEC-1092' : 'BM-0012';

  const roleBadgeBg = isEng ? '#FFEDD5' : isHk ? '#FEF3C7' : isSec ? '#FEE2E2' : '#F3E8FF';
  const roleBadgeColor = isEng ? '#C2410C' : isHk ? '#B45309' : isSec ? '#B91C1C' : '#6B21A8';

  const activeShiftName = isEng
    ? 'Shift Pagi'
    : isHk
    ? 'Shift Pagi'
    : isSec
    ? 'Shift Pagi'
    : 'Shift Reguler';

  const activeShiftHours = isEng
    ? '08.00 - 17.00'
    : isHk
    ? '06.30 - 15.30'
    : isSec
    ? '07.00 - 19.00'
    : '08.00 - 17.00';

  const activeShiftTitle = `${activeShiftName} (${activeShiftHours})`;

  const activeLocationTitle = isEng
    ? 'Workshop Engineering • Radius 15m'
    : isHk
    ? 'Janitor Hub & Koridor • Radius 15m'
    : isSec
    ? 'Pos Gerbang Utama • Radius 15m'
    : 'Lobby Tower A • Radius 15m';

  const baseLocationName = isEng
    ? 'Workshop Engineering'
    : isHk
    ? 'Janitor Hub & Koridor'
    : isSec
    ? 'Pos Gerbang Utama'
    : 'Lobby Tower A';

  // Helper to parse time in minutes
  const getMinutesFromTime = (timeStr) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
    if (!match) return 0;
    return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  };

  const getShiftStartMinutes = () => {
    if (isHk) return 6 * 60 + 30; // 06:30
    if (isSec) return 7 * 60; // 07:00
    return 8 * 60; // 08:00
  };

  const checkIsLate = (timeStr) => {
    if (!timeStr) return false;
    const timeMins = getMinutesFromTime(timeStr);
    const startMins = getShiftStartMinutes();
    return timeMins > startMins;
  };

  const getLateMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const timeMins = getMinutesFromTime(timeStr);
    const startMins = getShiftStartMinutes();
    return Math.max(0, timeMins - startMins);
  };

  const isClockInLate = clockInTime ? checkIsLate(clockInTime) : false;
  const clockInLateMinutes = clockInTime ? getLateMinutes(clockInTime) : 0;

  // 7 Days Attendance History Mock Data adapted per role
  const last7DaysHistory = [
    {
      id: 'att-1',
      date: 'Senin, 28 Sep 2026',
      dateEn: 'Monday, 28 Sep 2026',
      isToday: true,
      shift: activeShiftTitle,
      clockIn: clockInTime || '08:14',
      clockOut: clockOutTime || (isClockedIn ? 'Sedang Bekerja...' : '--:--'),
      duration: isClockedIn ? elapsedDuration : clockOutTime ? '08j 50m' : '-',
      status: isClockedIn ? (isClockInLate ? 'TERLAMBAT' : 'HADIR') : clockOutTime ? (isClockInLate ? 'TERLAMBAT' : 'HADIR') : 'BELUM_ABSEN',
      statusLabel: language === 'id'
        ? (isClockedIn ? (isClockInLate ? `Terlambat (${clockInLateMinutes}m)` : 'Tepat Waktu') : clockOutTime ? (isClockInLate ? `Terlambat (${clockInLateMinutes}m)` : 'Selesai') : 'Belum Absen')
        : (isClockedIn ? (isClockInLate ? `Late (${clockInLateMinutes}m)` : 'On Time') : clockOutTime ? (isClockInLate ? `Late (${clockInLateMinutes}m)` : 'Completed') : 'Pending'),
      statusColor: isClockInLate ? '#D97706' : '#16A34A',
      statusBg: isClockInLate ? '#FEF3C7' : '#DCFCE7',
      location: activeLocationTitle,
      note: isEng ? 'Pemeliharaan MEP harian' : isHk ? 'Presensi kebersihan harian' : isSec ? 'Tugas pos keamanan utama' : 'Presensi harian kantor pengelola',
    },
    {
      id: 'att-2',
      date: 'Minggu, 27 Sep 2026',
      dateEn: 'Sunday, 27 Sep 2026',
      isToday: false,
      shift: 'Libur Mingguan (Off)',
      clockIn: '-',
      clockOut: '-',
      duration: '-',
      status: 'LIBUR',
      statusLabel: language === 'id' ? 'Libur Reguler' : 'Day Off',
      statusColor: '#64748B',
      statusBg: '#F1F5F9',
      location: '-',
      note: 'Jadwal libur mingguan',
    },
    {
      id: 'att-3',
      date: 'Sabtu, 26 Sep 2026',
      dateEn: 'Saturday, 26 Sep 2026',
      isToday: false,
      shift: activeShiftTitle,
      clockIn: '07:58',
      clockOut: '17:05',
      duration: '09j 07m',
      status: 'HADIR',
      statusLabel: language === 'id' ? 'Tepat Waktu' : 'On Time',
      statusColor: '#2563EB',
      statusBg: '#DBEAFE',
      location: isEng ? 'Ruang Panel B1 • Radius 12m' : isHk ? 'Koridor Lantai 5-10 • Radius 12m' : isSec ? 'Pos Timur • Radius 12m' : 'Pintu Masuk Staff • Radius 12m',
      note: isEng ? 'Pekerjaan perbaikan lift lantai 10' : isHk ? 'General cleaning koridor' : isSec ? 'Patroli perimeter malam & CCTV' : 'Briefing vendor maintenance',
    },
    {
      id: 'att-4',
      date: 'Jumat, 25 Sep 2026',
      dateEn: 'Friday, 25 Sep 2026',
      isToday: false,
      shift: activeShiftTitle,
      clockIn: '07:50',
      clockOut: '17:00',
      duration: '09j 10m',
      status: 'HADIR',
      statusLabel: language === 'id' ? 'Tepat Waktu' : 'On Time',
      statusColor: '#2563EB',
      statusBg: '#DBEAFE',
      location: isEng ? 'Engineering Room B1 • Radius 8m' : isHk ? 'Area Kolam & Gym • Radius 8m' : isSec ? 'Screening Tamu Basement • Radius 8m' : 'Kantor Pengelola • Radius 8m',
      note: isEng ? 'Pemeliharaan genset rutin mingguan' : isHk ? 'Sanitasi fasilitas fitness' : isSec ? 'Screening tamu VIP & akses basement' : 'Audit kepuasan tenant mingguan',
    },
    {
      id: 'att-5',
      date: 'Kamis, 24 Sep 2026',
      dateEn: 'Thursday, 24 Sep 2026',
      isToday: false,
      shift: activeShiftTitle,
      clockIn: '08:18',
      clockOut: '17:30',
      duration: '09j 12m',
      status: 'TERLAMBAT',
      statusLabel: language === 'id' ? 'Terlambat (18m)' : 'Late (18m)',
      statusColor: '#D97706',
      statusBg: '#FEF3C7',
      location: isEng ? 'Ruang Chiller • Radius 18m' : isHk ? 'Lobby Barat • Radius 18m' : isSec ? 'Pos Barat • Radius 18m' : 'Lobby Tower A • Radius 18m',
      note: 'Macet jalur tol lingkar luar',
    },
    {
      id: 'att-6',
      date: 'Rabu, 23 Sep 2026',
      dateEn: 'Wednesday, 23 Sep 2026',
      isToday: false,
      shift: activeShiftTitle,
      clockIn: '08:02',
      clockOut: '17:15',
      duration: '09j 13m',
      status: 'HADIR',
      statusLabel: language === 'id' ? 'Tepat Waktu' : 'On Time',
      statusColor: '#2563EB',
      statusBg: '#DBEAFE',
      location: isEng ? 'Ruang STP • Radius 10m' : isHk ? 'Void Lobby • Radius 10m' : isSec ? 'Pintu Darurat • Radius 10m' : 'Lobby Tower A • Radius 10m',
      note: isEng ? 'Inspeksi pompa air & panel STP' : isHk ? 'Pembersihan kaca void lobby' : isSec ? 'Inspeksi hydrant & pintu darurat' : 'Inspeksi operasional gedung',
    },
    {
      id: 'att-7',
      date: 'Selasa, 22 Sep 2026',
      dateEn: 'Tuesday, 22 Sep 2026',
      isToday: false,
      shift: activeShiftTitle,
      clockIn: '07:55',
      clockOut: '17:04',
      duration: '09j 09m',
      status: 'HADIR',
      statusLabel: language === 'id' ? 'Tepat Waktu' : 'On Time',
      statusColor: '#2563EB',
      statusBg: '#DBEAFE',
      location: isEng ? 'Unit 14B • Radius 14m' : isHk ? 'Linen Room • Radius 14m' : isSec ? 'Gerbang Logistik • Radius 14m' : 'Lobby Tower A • Radius 14m',
      note: isEng ? 'Perbaikan instalasi listrik unit 14B' : isHk ? 'Restock chemical & inventory' : isSec ? 'Pengawalan bongkar muatan logistik' : 'Review laporan keuangan IPL',
    },
  ];

  // Filter history
  const filteredHistory = last7DaysHistory.filter((item) => {
    if (historyFilter === 'ALL') return true;
    if (historyFilter === 'HADIR') return item.status === 'HADIR';
    if (historyFilter === 'TERLAMBAT') return item.status === 'TERLAMBAT';
    if (historyFilter === 'LIBUR') return item.status === 'LIBUR';
    return true;
  });

  // Handle Clock Action Confirmation
  const handleConfirmClock = () => {
    if (actionType === 'CLOCK_IN') {
      setIsClockedIn(true);
      setClockInTime('08:14 WIB');
      setClockOutTime(null);
    } else {
      setIsClockedIn(false);
      setClockOutTime('17:05 WIB');
    }
    setIsActionModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  // Get modal container target
  const getModalTarget = () => {
    if (typeof document === 'undefined') return null;
    return (
      document.getElementById('phone-screen-container') ||
      document.querySelector('.android-device-screen') ||
      document.body
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        paddingBottom: '32px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Banner Gradient Background */}
      <div
        style={{
          background: 'linear-gradient(180deg, #02388A 0%, #0348AF 60%, #F8FAFC 100%)',
          padding: '16px 16px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* =========================================================================
            1. LIVE CLOCK & HERO ATTENDANCE CARD
            ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 8px 24px rgba(2, 56, 138, 0.12)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Live Time, Date & Live GPS Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isNightTime ? (
                <MoonStars
                  size={26}
                  weight="fill"
                  color="#6366F1"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.35))',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <Sun
                  size={26}
                  weight="fill"
                  color="#F59E0B"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))',
                    flexShrink: 0,
                  }}
                />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                {/* Tanggal di Atas */}
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#64748B',
                  }}
                >
                  {language === 'id' ? 'Senin, 28 Sep 2026' : 'Monday, Sep 28, 2026'}
                </span>

                {/* Jam di Bawah */}
                <span
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.2px',
                    fontVariantNumeric: 'tabular-nums',
                    marginTop: '2px',
                  }}
                >
                  {currentTime || '08:14:00 WIB'}
                </span>
              </div>
            </div>

            {/* Live GPS Badge disamping jam */}
            <div
              style={{
                backgroundColor: '#2563EB',
                borderRadius: '9999px',
                padding: '5px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              <NavigationArrow size={13} weight="fill" color="#FFFFFF" />
              <span>Live GPS</span>
            </div>
          </div>

          {/* Clock In vs Clock Out Dual Boxes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {/* Clock In Box */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SignIn size={14} weight="bold" color="#2563EB" />
                  Clock In
                </span>
                {clockInTime ? (
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isClockInLate ? '#FEF3C7' : '#DCFCE7',
                      color: isClockInLate ? '#B45309' : '#15803D',
                    }}
                  >
                    {isClockInLate
                      ? (language === 'id' ? (clockInLateMinutes > 0 ? `Terlambat (${clockInLateMinutes}m)` : 'Terlambat') : (clockInLateMinutes > 0 ? `Late (${clockInLateMinutes}m)` : 'Late'))
                      : (language === 'id' ? 'Tepat Waktu' : 'On Time')}
                  </span>
                ) : null}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: clockInTime ? '#0F172A' : '#94A3B8', letterSpacing: '-0.3px' }}>
                {clockInTime || '--:--'}
              </div>
              <div style={{ fontSize: '0.625rem', color: '#64748B' }}>
                {clockInTime ? '28 Sep 2026' : (language === 'id' ? 'Belum Clock In' : 'Not yet clocked in')}
              </div>
            </div>

            {/* Clock Out Box */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SignOut size={14} weight="bold" color="#D97706" />
                  Clock Out
                </span>
                {clockOutTime ? (
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                    }}
                  >
                    {language === 'id' ? 'Selesai' : 'Done'}
                  </span>
                ) : null}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: clockOutTime ? '#0F172A' : '#94A3B8', letterSpacing: '-0.3px' }}>
                {clockOutTime || '--:--'}
              </div>
              <div style={{ fontSize: '0.625rem', color: '#64748B' }}>
                {clockOutTime ? '28 Sep 2026' : (language === 'id' ? 'Belum Clock Out' : 'Not yet clocked out')}
              </div>
            </div>
          </div>

          {/* Shift Info (Sebelah Kiri) & Working Duration (Sebelah Kanan) Dual Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {/* Shift Info Box */}
            <div
              style={{
                backgroundColor: '#EFF6FF',
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #DBEAFE',
              }}
            >
              <Clock size={20} weight="fill" color="#2563EB" />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#1E40AF' }}>
                  {activeShiftName}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1E3A8A', marginTop: '1px' }}>
                  {activeShiftHours}
                </div>
              </div>
            </div>

            {/* Working Duration Box */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #DCFCE7',
              }}
            >
              <Hourglass size={20} weight="fill" color="#16A34A" />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#166534' }}>
                  {language === 'id' ? 'Durasi Kehadiran' : 'Work Duration'}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#14532D', marginTop: '1px' }}>
                  {isClockedIn ? elapsedDuration : clockOutTime ? '08j 51m' : '00j 00m'}
                </div>
              </div>
            </div>
          </div>

          {/* Big Action Clock In / Clock Out Button */}
          <button
            type="button"
            onClick={() => {
              setActionType(isClockedIn ? 'CLOCK_OUT' : 'CLOCK_IN');
              setIsMethodSheetOpen(true);
            }}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: isClockedIn ? '#D97706' : '#16A34A',
              color: '#FFFFFF',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.9375rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.15s ease',
            }}
          >
            {isClockedIn ? (
              <>
                <SignOut size={20} weight="bold" />
                <span>{language === 'id' ? 'Clock Out Sekarang' : 'Clock Out Now'}</span>
              </>
            ) : (
              <>
                <SignIn size={20} weight="bold" />
                <span>{language === 'id' ? 'Clock In Sekarang' : 'Clock In Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* =========================================================================
            2. 4 OTHER MENUS (HORIZONTAL GRID)
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#1E293B',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {language === 'id' ? 'Menu Lainnya' : 'Other Menus'}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
            }}
          >
            {/* 1. Shift Schedule */}
            <div
              onClick={() => setIsShiftModalOpen(true)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 3px 8px rgba(37, 99, 235, 0.25)',
                }}
              >
                <CalendarCheck size={22} weight="fill" />
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  lineHeight: 1.2,
                }}
              >
                {language === 'id' ? 'Jadwal Shift' : 'Shift Schedule'}
              </span>
            </div>

            {/* 2. Employee Permission */}
            <div
              onClick={() => setIsPermissionModalOpen(true)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 3px 8px rgba(16, 185, 129, 0.25)',
                }}
              >
                <FileText size={22} weight="fill" />
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  lineHeight: 1.2,
                }}
              >
                {language === 'id' ? 'Izin / Cuti' : 'Permission'}
              </span>
            </div>

            {/* 3. Report Attendance */}
            <div
              onClick={() => setIsReportModalOpen(true)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 3px 8px rgba(139, 92, 246, 0.25)',
                }}
              >
                <ChartLineUp size={22} weight="fill" />
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  lineHeight: 1.2,
                }}
              >
                {language === 'id' ? 'Laporan Absensi' : 'Report'}
              </span>
            </div>

            {/* 4. Payslip */}
            <div
              onClick={() => setIsPayslipModalOpen(true)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 3px 8px rgba(245, 158, 11, 0.25)',
                }}
              >
                <Receipt size={22} weight="fill" />
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  lineHeight: 1.2,
                }}
              >
                {language === 'id' ? 'Slip Gaji' : 'Payslip'}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. HISTORY ABSEN SEMINGGU TERAKHIR (LAST 7 DAYS HISTORY)
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Section Title & Range */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  margin: 0,
                  letterSpacing: '-0.2px',
                }}
              >
                {language === 'id' ? 'Riwayat Absen 7 Hari Terakhir' : 'Last 7 Days Attendance'}
              </h2>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                22 Sep 2026 - 28 Sep 2026
              </span>
            </div>

            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
            >
              5 Hadir • 1 Libur
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'ALL', label: language === 'id' ? 'Semua (7)' : 'All (7)' },
              { id: 'HADIR', label: language === 'id' ? 'Hadir (5)' : 'Present (5)' },
              { id: 'TERLAMBAT', label: language === 'id' ? 'Terlambat (1)' : 'Late (1)' },
              { id: 'LIBUR', label: language === 'id' ? 'Libur (1)' : 'Off (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setHistoryFilter(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: historyFilter === tab.id ? '1px solid #02388A' : '1px solid #E2E8F0',
                  backgroundColor: historyFilter === tab.id ? '#02388A' : '#FFFFFF',
                  color: historyFilter === tab.id ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* History Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: item.isToday ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: item.isToday ? '0 2px 8px rgba(37, 99, 235, 0.08)' : 'none',
                }}
              >
                {/* Header: Date & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                      {language === 'id' ? item.date : item.dateEn}
                    </span>
                    {item.isToday && (
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid #DBEAFE',
                        }}
                      >
                        {language === 'id' ? 'Hari Ini' : 'Today'}
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: item.statusBg,
                      color: item.statusColor,
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {item.statusLabel}
                  </span>
                </div>

                {/* Body: Shift & Clock Times */}
                {item.status !== 'LIBUR' ? (
                  <>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '6px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600 }}>
                          Clock In
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                          {item.clockIn}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600 }}>
                          Clock Out
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                          {item.clockOut}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600 }}>
                          {language === 'id' ? 'Total Durasi' : 'Duration'}
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803D', marginTop: '2px' }}>
                          {item.duration}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="#64748B" />
                        {item.location}
                      </span>
                      <span>{item.shift}</span>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#64748B',
                      fontSize: '0.75rem',
                    }}
                  >
                    <CalendarBlank size={16} color="#64748B" />
                    <span>{language === 'id' ? 'Jadwal hari libur resmi mingguan karyawan' : 'Official weekly day off roster'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 0: ATTENDANCE METHOD SELECTION BOTTOM SHEET
          ========================================================================= */}
      {isMethodSheetOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            onClick={() => setIsMethodSheetOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 20px 32px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'slideUp 0.25s ease-out',
                boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.12)',
              }}
            >
              {/* Drag Handle Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-4px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '4px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '9999px',
                  }}
                />
              </div>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {actionType === 'CLOCK_IN'
                      ? (language === 'id' ? 'Pilih Metode Clock In' : 'Select Clock In Method')
                      : (language === 'id' ? 'Pilih Metode Clock Out' : 'Select Clock Out Method')}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0 0' }}>
                    {language === 'id'
                      ? 'Pilih cara validasi presensi kerja Anda'
                      : 'Choose your attendance verification method'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMethodSheetOpen(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B',
                    flexShrink: 0,
                  }}
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* 2 Method Option Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Option 1: Scan QR Code */}
                <button
                  type="button"
                  onClick={() => {
                    setAttendanceMethod('QR');
                    setIsMethodSheetOpen(false);
                    setIsActionModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-secondary, #09B2FF)';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: '#EAF7FF',
                      border: '1px solid #BAE6FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-secondary, #09B2FF)',
                      flexShrink: 0,
                    }}
                  >
                    <QrCode size={24} weight="bold" color="var(--color-secondary, #09B2FF)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                      {language === 'id' ? 'Scan QR Code' : 'Scan QR Code'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.3 }}>
                      {language === 'id'
                        ? 'Pindai barcode QR yang tertempel di area pos atau radius presensi'
                        : 'Scan the official QR barcode placed at the workstation radius'}
                    </div>
                  </div>
                  <CaretRight size={18} weight="bold" color="#94A3B8" />
                </button>

                {/* Option 2: Foto Selfie */}
                <button
                  type="button"
                  onClick={() => {
                    setAttendanceMethod('PHOTO');
                    setIsMethodSheetOpen(false);
                    setIsSelfieFullscreenOpen(true);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-secondary, #09B2FF)';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: '#EAF7FF',
                      border: '1px solid #BAE6FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-secondary, #09B2FF)',
                      flexShrink: 0,
                    }}
                  >
                    <Camera size={24} weight="bold" color="var(--color-secondary, #09B2FF)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                      {language === 'id' ? 'Foto Selfie' : 'Selfie Photo'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.3 }}>
                      {language === 'id'
                        ? 'Ambil foto selfie di tempat, lokasi presensi akan terdeteksi otomatis via GPS'
                        : 'Take a selfie on-site, your attendance location will be captured via GPS'}
                    </div>
                  </div>
                  <CaretRight size={18} weight="bold" color="#94A3B8" />
                </button>
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 1: SCAN QR CODE ACTION MODAL
          ========================================================================= */}
      {isActionModalOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <style>{`
              @keyframes qrLaserAnim {
                0% { top: 15%; opacity: 0.8; }
                50% { top: 80%; opacity: 1; }
                100% { top: 15%; opacity: 0.8; }
              }
            `}</style>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 20px 28px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '92%',
                overflowY: 'auto',
                animation: 'slideUp 0.25s ease-out',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {actionType === 'CLOCK_IN' ? (language === 'id' ? 'Scan QR Clock In' : 'Scan QR Clock In') : (language === 'id' ? 'Scan QR Clock Out' : 'Scan QR Clock Out')}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.5625rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                      }}
                    >
                      QR Scanner
                    </span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                    {currentTime} • 28 Sep 2026
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B',
                    flexShrink: 0,
                  }}
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* QR SCANNER VIEWPORT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    height: '180px',
                    backgroundColor: '#090D16',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    border: '1.5px solid #1E293B',
                  }}
                >
                  {/* Scanner Center Box */}
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      border: '2px solid rgba(56, 189, 248, 0.6)',
                      borderRadius: '12px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    }}
                  >
                    {/* Corner Accents */}
                    <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '12px', height: '12px', borderTop: '3px solid #38BDF8', borderLeft: '3px solid #38BDF8', borderTopLeftRadius: '4px' }} />
                    <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px', borderTop: '3px solid #38BDF8', borderRight: '3px solid #38BDF8', borderTopRightRadius: '4px' }} />
                    <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '12px', height: '12px', borderBottom: '3px solid #38BDF8', borderLeft: '3px solid #38BDF8', borderBottomLeftRadius: '4px' }} />
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', borderBottom: '3px solid #38BDF8', borderRight: '3px solid #38BDF8', borderBottomRightRadius: '4px' }} />

                    {/* QR Icon in center */}
                    <QrCode size={48} color="#94A3B8" weight="light" style={{ opacity: 0.65 }} />

                    {/* Animated Laser Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '6px',
                        right: '6px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent 0%, #38BDF8 50%, transparent 100%)',
                        boxShadow: '0 0 8px #38BDF8',
                        animation: 'qrLaserAnim 2s infinite ease-in-out',
                      }}
                    />
                  </div>

                  {/* Top Right Flashlight Button */}
                  <button
                    type="button"
                    onClick={() => setIsFlashlightOn(!isFlashlightOn)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      border: 'none',
                      backgroundColor: isFlashlightOn ? '#FBBF24' : 'rgba(30, 41, 59, 0.8)',
                      color: isFlashlightOn ? '#0F172A' : '#FFFFFF',
                      borderRadius: '9999px',
                      padding: '4px 10px',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <Lightning size={12} weight="fill" />
                    <span>{isFlashlightOn ? 'Flash ON' : 'Flash'}</span>
                  </button>

                  {/* Bottom Status Text */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      fontSize: '0.6875rem',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle size={12} weight="fill" color="#22C55E" />
                    <span>{language === 'id' ? 'QR Code Terdeteksi • Siap Validasi' : 'QR Code Detected • Ready'}</span>
                  </div>
                </div>

                {/* Verification Info Box */}
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.75rem',
                    color: '#1E40AF',
                  }}
                >
                  <CheckCircle size={18} weight="fill" color="#2563EB" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{language === 'id' ? 'Pos QR Resmi Terverifikasi' : 'Official QR Post Verified'}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#1E3A8A' }}>{activeLocationTitle}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsActionModalOpen(false);
                      setAttendanceMethod('PHOTO');
                      setIsSelfieFullscreenOpen(true);
                    }}
                    style={{
                      border: 'none',
                      background: '#FFFFFF',
                      color: '#2563EB',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {language === 'id' ? 'Ganti Foto' : 'Switch Photo'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClock}
                  style={{
                    flex: 2,
                    height: '42px',
                    backgroundColor: actionType === 'CLOCK_IN' ? '#16A34A' : '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {actionType === 'CLOCK_IN' ? (
                    <>
                      <SignIn size={18} weight="bold" />
                      <span>{language === 'id' ? 'Konfirmasi Presensi QR' : 'Confirm QR Clock In'}</span>
                    </>
                  ) : (
                    <>
                      <SignOut size={18} weight="bold" />
                      <span>{language === 'id' ? 'Konfirmasi Presensi QR' : 'Confirm QR Clock Out'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 1.5: FULL-SCREEN FRONT CAMERA VIEW (SELFIE ATTENDANCE)
          ========================================================================= */}
      {isSelfieFullscreenOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {/* Top Bar Floating */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                padding: '16px 16px 24px 16px',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <button
                type="button"
                onClick={handleCloseSelfieCamera}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                }}
              >
                <X size={24} weight="bold" />
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {actionType === 'CLOCK_IN'
                    ? (language === 'id' ? 'Selfie Clock In' : 'Selfie Clock In')
                    : (language === 'id' ? 'Selfie Clock Out' : 'Selfie Clock Out')}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                  {currentTime}
                </div>
              </div>

              {/* Interactive Radius Simulation Toggle */}
              <button
                type="button"
                onClick={() => setIsOutOfRadius(!isOutOfRadius)}
                title={isOutOfRadius ? 'Klik untuk simulasi Di Dalam Radius' : 'Klik untuk simulasi Di Luar Radius'}
                style={{
                  border: 'none',
                  backgroundColor: isOutOfRadius ? 'rgba(239, 68, 68, 0.9)' : 'rgba(22, 163, 74, 0.9)',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                <span>{isOutOfRadius ? 'Luar Radius' : 'Dalam Radius'}</span>
              </button>
            </div>

            {/* Video Viewport / Photo Snapshot */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#090D16',
                overflow: 'hidden',
              }}
            >
              {capturedSelfie && capturedSelfie !== 'simulated_photo' ? (
                <img
                  src={capturedSelfie}
                  alt="Captured Selfie"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)', // Front Camera Mirroring
                  }}
                />
              ) : (
                /* Interactive Front Camera Simulation View */
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at 50% 40%, #1E293B 0%, #090D16 80%)',
                    position: 'relative',
                    color: '#FFFFFF',
                  }}
                >
                  <div
                    style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '2px solid rgba(56, 189, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <UserCheck size={64} color="#38BDF8" weight="light" />
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {userName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                    {language === 'id' ? 'Kamera Depan Aktif' : 'Front Camera Active'}
                  </span>
                </div>
              )}

              {/* Attendance Timestamp Watermark Overlay (Bottom-Left) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.72)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.6875rem',
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                    maxWidth: '94%',
                  }}
                >
                  {/* Lokasi (Tanpa Radius) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: '#38BDF8' }}>
                    <MapPin size={13} weight="fill" color="#38BDF8" />
                    <span>{baseLocationName}</span>
                  </div>

                  {/* Tanggal dan Jam */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F1F5F9', fontWeight: 600 }}>
                    <Clock size={12} weight="bold" color="#94A3B8" />
                    <span>28 Sep 2026 • {currentTime || '08:14:00 WIB'}</span>
                  </div>

                  {/* Lat dan Long */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'monospace' }}>
                    <NavigationArrow size={11} weight="fill" color="#94A3B8" />
                    <span>Lat: {userCoords.lat}, Long: {userCoords.lng}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div
              style={{
                padding: '24px 20px 32px 20px',
                backgroundColor: '#000000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              {!capturedSelfie ? (
                <>
                  {/* Shutter Button */}
                  <button
                    type="button"
                    onClick={handleTakeSelfie}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      border: '4px solid #FFFFFF',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      transition: 'transform 0.1s ease',
                    }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  </button>
                  <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                    {language === 'id' ? 'Ketuk untuk mengambil foto selfie' : 'Tap shutter to capture selfie'}
                  </span>
                </>
              ) : (
                /* After Capture Controls */
                <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '360px' }}>
                  <button
                    type="button"
                    onClick={handleRetakeSelfie}
                    style={{
                      flex: 1,
                      height: '46px',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <ArrowsClockwise size={18} weight="bold" />
                    <span>{language === 'id' ? 'Foto Ulang' : 'Retake'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUsePhoto}
                    style={{
                      flex: 2,
                      height: '46px',
                      backgroundColor: 'var(--primary, #053079)',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Check size={20} weight="bold" />
                    <span>Use Photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 1.8: CHECK IN CONFIRMATION BOTTOM SHEET (PROAPPS DESIGN SYSTEM)
          ========================================================================= */}
      {isCheckInPageOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            onClick={() => setIsCheckInPageOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 99998,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(4px)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-background-surface, #FFFFFF)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '16px 20px 32px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                animation: 'slideUp 0.25s ease-out',
                boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.16)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Drag Handle Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-4px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '4px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '9999px',
                  }}
                />
              </div>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-text-primary, #334155)', margin: 0 }}>
                    {actionType === 'CLOCK_IN'
                      ? (language === 'id' ? 'Konfirmasi Clock In' : 'Confirm Clock In')
                      : (language === 'id' ? 'Konfirmasi Clock Out' : 'Confirm Clock Out')}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #64748B)', margin: '4px 0 0 0' }}>
                    {language === 'id'
                      ? 'Verifikasi lokasi radius dan detail presensi Anda'
                      : 'Verify your radius location and presence details'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheckInPageOpen(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary, #64748B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* Mini Map Preview Card (Matching Screenshot Reference) */}
              <div
                style={{
                  height: '185px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid var(--color-border-default, #E5E7EB)',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
                }}
              >
                {/* SVG Vector Map */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                >
                  <rect width="400" height="200" fill="#F8FAFC" />
                  <path d="M0,0 L140,0 L110,80 L0,65 Z" fill="#DCFCE7" opacity="0.8" />
                  <path d="M260,0 L400,0 L400,90 L280,65 Z" fill="#F0FDF4" opacity="0.9" />
                  <path d="M0,150 L120,130 L100,200 L0,200 Z" fill="#F0FDF4" opacity="0.75" />
                  <path d="M280,140 L400,160 L400,200 L260,200 Z" fill="#DCFCE7" opacity="0.75" />
                  <path d="M-20,75 Q180,100 420,85" stroke="#FFFFFF" strokeWidth="24" fill="none" />
                  <path d="M-20,75 Q180,100 420,85" stroke="#E2E8F0" strokeWidth="26" fill="none" style={{ zIndex: -1 }} />
                  <path d="M200,-20 Q210,100 190,220" stroke="#FFFFFF" strokeWidth="26" fill="none" />
                  <path d="M200,-20 Q210,100 190,220" stroke="#E2E8F0" strokeWidth="28" fill="none" />
                  <path d="M40,140 Q180,130 360,140" stroke="#FFFFFF" strokeWidth="18" fill="none" />
                  <circle
                    cx="200"
                    cy="100"
                    r="80"
                    fill="rgba(9, 178, 255, 0.16)"
                    stroke="#09B2FF"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                </svg>

                {/* Center User Pin inside Radius */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 4,
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary, #053079)',
                      border: '3px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 10px rgba(5, 48, 121, 0.45)',
                    }}
                  >
                    <UserCheck size={18} weight="bold" color="#FFFFFF" />
                  </div>
                </div>
              </div>

              {/* Grid Cards (Waktu Masuk & Foto Selfie) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {/* Waktu Presensi */}
                <div
                  style={{
                    backgroundColor: 'var(--color-background-surface, #FFFFFF)',
                    border: '1px solid var(--color-border-default, #E5E7EB)',
                    borderRadius: '14px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-text-secondary, #64748B)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      {actionType === 'CLOCK_IN' ? (language === 'id' ? 'Waktu Masuk' : 'Clock In') : (language === 'id' ? 'Waktu Pulang' : 'Clock Out')}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text-primary, #334155)' }}>
                      {checkInSnapshot?.timeShort || (currentTime ? currentTime.substring(0, 5) : '08:14')} WIB
                    </div>
                    {actionType === 'CLOCK_IN' && (
                      <div style={{ marginTop: '2px' }}>
                        <span
                          style={{
                            fontSize: '0.5625rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: checkIsLate(checkInSnapshot?.time || currentTime) ? '#FEF3C7' : '#DCFCE7',
                            color: checkIsLate(checkInSnapshot?.time || currentTime) ? '#B45309' : '#15803D',
                            display: 'inline-block',
                          }}
                        >
                          {checkIsLate(checkInSnapshot?.time || currentTime)
                            ? (language === 'id'
                                ? (getLateMinutes(checkInSnapshot?.time || currentTime) > 0 ? `Terlambat (${getLateMinutes(checkInSnapshot?.time || currentTime)}m)` : 'Terlambat')
                                : (getLateMinutes(checkInSnapshot?.time || currentTime) > 0 ? `Late (${getLateMinutes(checkInSnapshot?.time || currentTime)}m)` : 'Late'))
                            : (language === 'id' ? 'Tepat Waktu' : 'On Time')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-selected-background, #EAF7FF)',
                      border: '1px solid #BAE6FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary, #053079)',
                      flexShrink: 0,
                    }}
                  >
                    {actionType === 'CLOCK_IN' ? (
                      <SignIn size={16} weight="bold" color="var(--color-primary, #053079)" />
                    ) : (
                      <SignOut size={16} weight="bold" color="var(--color-primary, #053079)" />
                    )}
                  </div>
                </div>

                {/* Foto Selfie */}
                <div
                  style={{
                    backgroundColor: 'var(--color-background-surface, #FFFFFF)',
                    border: '1px solid var(--color-border-default, #E5E7EB)',
                    borderRadius: '14px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-text-secondary, #64748B)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      {language === 'id' ? 'Foto Selfie' : 'Selfie'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPreviewPhotoOpen(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-secondary, #09B2FF)',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {language === 'id' ? 'Lihat Foto' : 'See Photo'}
                    </button>
                  </div>
                  <div
                    onClick={() => setIsPreviewPhotoOpen(true)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1.5px solid var(--color-secondary, #09B2FF)',
                      backgroundColor: 'var(--color-primary, #053079)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {checkInSnapshot?.photo && checkInSnapshot.photo !== 'simulated_photo' ? (
                      <img
                        src={checkInSnapshot.photo}
                        alt="Thumbnail"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <UserCheck size={16} color="#FFFFFF" weight="bold" />
                    )}
                  </div>
                </div>
              </div>

              {/* Lokasi & Koordinat Lat Long */}
              <div
                style={{
                  backgroundColor: 'var(--color-background-surface, #FFFFFF)',
                  border: '1px solid var(--color-border-default, #E5E7EB)',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, paddingRight: '8px' }}>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-text-secondary, #64748B)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {language === 'id' ? 'Titik Lokasi & Koordinat' : 'Location & Coordinates'}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text-primary, #334155)' }}>
                    {checkInSnapshot?.location || baseLocationName}
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-secondary, #64748B)', fontFamily: 'monospace', marginTop: '2px' }}>
                    Lat: {checkInSnapshot?.coords?.lat || userCoords.lat}, Long: {checkInSnapshot?.coords?.lng || userCoords.lng}
                  </div>
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-selected-background, #EAF7FF)',
                    border: '1px solid #BAE6FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary, #053079)',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} weight="fill" color="var(--color-primary, #053079)" />
                </div>
              </div>

              {/* Bottom Confirm Action Button */}
              <button
                type="button"
                onClick={handleFinalCheckIn}
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: 'var(--color-primary, #053079)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  boxShadow: '0 4px 14px rgba(5, 48, 121, 0.25)',
                }}
              >
                {actionType === 'CLOCK_IN'
                  ? (language === 'id' ? 'Konfirmasi Clock In' : 'Confirm Clock In')
                  : (language === 'id' ? 'Konfirmasi Clock Out' : 'Confirm Clock Out')}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 1.85: OUT OF RADIUS BOTTOM SHEET (3D ILLUSTRATION & NOTIFICATION)
          ========================================================================= */}
      {isOutOfRadiusSheetOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            onClick={() => setIsOutOfRadiusSheetOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 99998,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(4px)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-background-surface, #FFFFFF)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '16px 20px 32px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                animation: 'slideUp 0.25s ease-out',
                boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.16)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Drag Handle Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-4px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '4px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '9999px',
                  }}
                />
              </div>

              {/* 3D Illustration: Out of Range Location (Full Width up to padding) */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '4px 0 2px 0' }}>
                <img
                  src={outOfRangeLocation}
                  alt="Outside Radius"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>

              {/* Header (Clean, No X button as requested) */}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary, #334155)', margin: 0 }}>
                  {language === 'id' ? 'Di Luar Radius Presensi' : 'Outside Attendance Radius'}
                </h3>
                <p style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary, #64748B)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {language === 'id'
                    ? 'Posisi Anda saat ini berada di luar batas area radius kerja'
                    : 'Your current location is outside the workplace radius boundary'}
                </p>
              </div>

              {/* Mini Map Preview Card with Out of Radius Marker */}
              <div
                style={{
                  height: '185px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid var(--color-border-default, #E5E7EB)',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
                }}
              >
                {/* SVG Vector Map */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                >
                  <rect width="400" height="200" fill="#F8FAFC" />
                  <path d="M0,0 L140,0 L110,80 L0,65 Z" fill="#DCFCE7" opacity="0.8" />
                  <path d="M260,0 L400,0 L400,90 L280,65 Z" fill="#F0FDF4" opacity="0.9" />
                  <path d="M0,150 L120,130 L100,200 L0,200 Z" fill="#F0FDF4" opacity="0.75" />
                  <path d="M280,140 L400,160 L400,200 L260,200 Z" fill="#DCFCE7" opacity="0.75" />
                  <path d="M-20,75 Q180,100 420,85" stroke="#FFFFFF" strokeWidth="24" fill="none" />
                  <path d="M-20,75 Q180,100 420,85" stroke="#E2E8F0" strokeWidth="26" fill="none" />
                  <path d="M200,-20 Q210,100 190,220" stroke="#FFFFFF" strokeWidth="26" fill="none" />
                  <path d="M200,-20 Q210,100 190,220" stroke="#E2E8F0" strokeWidth="28" fill="none" />
                  <path d="M40,140 Q180,130 360,140" stroke="#FFFFFF" strokeWidth="18" fill="none" />

                  {/* Workplace Radius Circle (15m radius widened & centered) */}
                  <circle
                    cx="185"
                    cy="105"
                    r="76"
                    fill="rgba(9, 178, 255, 0.16)"
                    stroke="#09B2FF"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Dotted Connection Line between office and user */}
                  <line
                    x1="185"
                    y1="105"
                    x2="340"
                    y2="38"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                </svg>

                {/* Office / Apartment Pin at Center of Radius */}
                <div
                  style={{
                    position: 'absolute',
                    left: '46.25%',
                    top: '52.5%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 3,
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary, #053079)',
                      border: '3px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 10px rgba(5, 48, 121, 0.45)',
                    }}
                  >
                    <Buildings size={18} weight="bold" color="#FFFFFF" />
                  </div>
                </div>

                {/* User Pin Outside Radius (Red / Warning) */}
                <div
                  style={{
                    position: 'absolute',
                    left: '83.75%',
                    top: '22.5%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 4,
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#DC2626',
                      border: '3px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 10px rgba(220, 38, 38, 0.55)',
                      position: 'relative',
                    }}
                  >
                    <UserCheck size={18} weight="bold" color="#FFFFFF" />
                  </div>
                </div>
              </div>



              {/* Distance Warning Card (Detected Distance & Max allowed radius) */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                    flexShrink: 0,
                  }}
                >
                  <WarningCircle size={20} weight="fill" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B' }}>
                    Detected Distance: ~125 meters
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#B91C1C', marginTop: '2px' }}>
                    Maximum allowed radius: 15 meters
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 1.9: FULL PHOTO PREVIEW MODAL
          ========================================================================= */}
      {isPreviewPhotoOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(8px)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {/* Close Button Top Right */}
            <div style={{ width: '100%', maxWidth: '340px', display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setIsPreviewPhotoOpen(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                }}
              >
                <X size={26} weight="bold" />
              </button>
            </div>

            {/* Photo Card Container */}
            <div
              style={{
                width: '100%',
                maxWidth: '340px',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#0F172A',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                position: 'relative',
              }}
            >
              {checkInSnapshot?.photo && checkInSnapshot.photo !== 'simulated_photo' ? (
                <img
                  src={checkInSnapshot.photo}
                  alt="Full Selfie Preview"
                  style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at 50% 40%, #1E293B 0%, #090D16 80%)',
                    color: '#FFFFFF',
                  }}
                >
                  <UserCheck size={72} color="#38BDF8" weight="light" />
                  <span style={{ fontSize: '1rem', fontWeight: 800, marginTop: '12px' }}>{userName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>{empId}</span>
                </div>
              )}

              {/* Watermark Overlay on Preview */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.72)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.6875rem',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: '#38BDF8' }}>
                    <MapPin size={13} weight="fill" color="#38BDF8" />
                    <span>{checkInSnapshot?.location || baseLocationName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F1F5F9', fontWeight: 600 }}>
                    <Clock size={12} weight="bold" color="#94A3B8" />
                    <span>{checkInSnapshot?.date || '28 Sep 2026'} • {checkInSnapshot?.time || '08:14:00 WIB'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94A3B8', fontSize: '0.625rem', fontFamily: 'monospace' }}>
                    <NavigationArrow size={11} weight="fill" color="#94A3B8" />
                    <span>Lat: {checkInSnapshot?.coords?.lat || userCoords.lat}, Long: {checkInSnapshot?.coords?.lng || userCoords.lng}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 2: SUCCESS PRESENCE BOTTOM SHEET
          ========================================================================= */}
      {isSuccessModalOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            onClick={() => setIsSuccessModalOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 99998,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(4px)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-background-surface, #FFFFFF)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '16px 20px 32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                animation: 'slideUp 0.25s ease-out',
                boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.16)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Drag Handle Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-4px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '4px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '9999px',
                  }}
                />
              </div>

              {/* 3D Success Illustration (Full Width up to padding) */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '4px 0 2px 0' }}>
                <img
                  src={successCheck}
                  alt="Success"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>

              {/* Title & Subtitle */}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary, #0F172A)', margin: 0 }}>
                  {actionType === 'CLOCK_IN'
                    ? (language === 'id' ? 'Clock In Berhasil!' : 'Clock In Successful!')
                    : (language === 'id' ? 'Clock Out Berhasil!' : 'Clock Out Successful!')}
                </h3>
                <p style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary, #64748B)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                  {actionType === 'CLOCK_IN'
                    ? (language === 'id' ? 'Selamat bekerja! Kehadiran Anda telah dicatat pada sistem.' : 'Have a great workday! Your attendance is recorded.')
                    : (language === 'id' ? 'Terima kasih atas kerja keras Anda hari ini. Sampai jumpa besok!' : 'Thank you for your hard work today. See you tomorrow!')}
                </p>
              </div>

              {/* Redesigned Clean Attendance Time Card */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-background-surface, #F8FAFC)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-default, #E2E8F0)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-selected-background, #EAF7FF)',
                      border: '1px solid #BAE6FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary, #053079)',
                      flexShrink: 0,
                    }}
                  >
                    {actionType === 'CLOCK_IN' ? (
                      <SignIn size={18} weight="bold" color="var(--color-primary, #053079)" />
                    ) : (
                      <SignOut size={18} weight="bold" color="var(--color-primary, #053079)" />
                    )}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-text-secondary, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                      {actionType === 'CLOCK_IN' ? (language === 'id' ? 'Waktu Masuk' : 'Clock In Time') : (language === 'id' ? 'Waktu Pulang' : 'Clock Out Time')}
                    </div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary, #0F172A)' }}>
                      {checkInSnapshot?.time || currentTime || '08:14:00 WIB'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {actionType === 'CLOCK_IN' && (
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        backgroundColor: checkIsLate(checkInSnapshot?.time || currentTime) ? '#FEF3C7' : '#DCFCE7',
                        color: checkIsLate(checkInSnapshot?.time || currentTime) ? '#B45309' : '#15803D',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                      }}
                    >
                      {checkIsLate(checkInSnapshot?.time || currentTime)
                        ? (language === 'id'
                            ? (getLateMinutes(checkInSnapshot?.time || currentTime) > 0 ? `Terlambat (${getLateMinutes(checkInSnapshot?.time || currentTime)}m)` : 'Terlambat')
                            : (getLateMinutes(checkInSnapshot?.time || currentTime) > 0 ? `Late (${getLateMinutes(checkInSnapshot?.time || currentTime)}m)` : 'Late'))
                        : (language === 'id' ? 'Tepat Waktu' : 'On Time')}
                    </span>
                  )}
                  <div
                    style={{
                      padding: '5px 10px',
                      borderRadius: '20px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border-default, #E2E8F0)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: 'var(--color-text-secondary, #64748B)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CalendarBlank size={12} weight="bold" color="var(--color-primary, #053079)" />
                    <span>{checkInSnapshot?.date || '28 Sep 2026'}</span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: 'var(--color-primary, #053079)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(5, 48, 121, 0.25)',
                }}
              >
                {language === 'id' ? 'Selesai' : 'Done'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 3: SHIFT SCHEDULE MODAL
          ========================================================================= */}
      {isShiftModalOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '80%',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarCheck size={20} color="#2563EB" weight="fill" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'id' ? 'Jadwal Shift Minggu Ini' : 'This Week Shift Schedule'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  style={{ border: 'none', background: 'transparent', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Shift Roster List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  {
                    day: 'Senin, 28 Sep',
                    shift: isSec ? 'Shift Pagi' : isHk ? 'Shift Pagi' : isEng ? 'Shift Pagi' : 'Shift Normal',
                    time: isSec ? '07:00 - 19:00' : isHk ? '06:30 - 15:30' : '08:00 - 17:00',
                    role: isSec ? 'Pos Gerbang Utama' : isHk ? 'Lobby & Public Area' : isEng ? 'Engineering On-Duty' : 'Office On-Duty',
                    status: 'Hari Ini',
                  },
                  {
                    day: 'Selasa, 29 Sep',
                    shift: isSec ? 'Shift Pagi' : isHk ? 'Shift Pagi' : isEng ? 'Shift Pagi' : 'Shift Normal',
                    time: isSec ? '07:00 - 19:00' : isHk ? '06:30 - 15:30' : '08:00 - 17:00',
                    role: isSec ? 'Patroli Basement & CCTV' : isHk ? 'Floor Corridor Cleaning' : isEng ? 'MEP & Genset Check' : 'Tenant Supervision',
                    status: 'Besok',
                  },
                  {
                    day: 'Rabu, 30 Sep',
                    shift: isSec ? 'Shift Malam' : isHk ? 'Shift Siang' : isEng ? 'Shift Siang' : 'Shift Normal',
                    time: isSec ? '19:00 - 07:00' : isHk ? '13:00 - 21:00' : isEng ? '13:00 - 22:00' : '08:00 - 17:00',
                    role: isSec ? 'Night Guard & Gate' : isHk ? 'Sanitasi Kolam & Gym' : isEng ? 'Engineering Standby' : 'Executive Duty',
                    status: 'Mendatang',
                  },
                  {
                    day: 'Kamis, 01 Okt',
                    shift: isSec ? 'Shift Malam' : isHk ? 'Shift Siang' : isEng ? 'Shift Siang' : 'Shift Normal',
                    time: isSec ? '19:00 - 07:00' : isHk ? '13:00 - 21:00' : isEng ? '13:00 - 22:00' : '08:00 - 17:00',
                    role: isSec ? 'Night Perimeter Patrol' : isHk ? 'Deep Cleaning Koridor' : isEng ? 'Engineering Standby' : 'Supervision & Audit',
                    status: 'Mendatang',
                  },
                  {
                    day: 'Jumat, 02 Okt',
                    shift: isSec ? 'Libur Reguler' : isHk ? 'Shift Pagi' : isEng ? 'Shift Malam' : 'Shift Normal',
                    time: isSec ? '-' : isHk ? '06:30 - 15:30' : isEng ? '22:00 - 07:00' : '08:00 - 17:00',
                    role: isSec ? 'Off Duty' : isHk ? 'Restroom & Waste Mgmt' : isEng ? 'Night System Check' : 'Management Office',
                    status: isSec ? 'Libur' : 'Mendatang',
                  },
                  {
                    day: 'Sabtu, 03 Okt',
                    shift: isSec ? 'Shift Pagi' : 'Libur Reguler',
                    time: isSec ? '07:00 - 19:00' : '-',
                    role: isSec ? 'Weekend Guard' : 'Off Duty',
                    status: isSec ? 'Mendatang' : 'Libur',
                  },
                  {
                    day: 'Minggu, 04 Okt',
                    shift: 'Libur Reguler',
                    time: '-',
                    role: 'Off Duty',
                    status: 'Libur',
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: s.status === 'Hari Ini' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                      backgroundColor: s.status === 'Hari Ini' ? '#EFF6FF' : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>{s.day}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{s.role} • {s.time}</div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: s.shift.includes('Libur') ? '#F1F5F9' : '#DCFCE7',
                        color: s.shift.includes('Libur') ? '#64748B' : '#15803D',
                      }}
                    >
                      {s.shift}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 4: EMPLOYEE PERMISSION (IZIN / CUTI) MODAL
          ========================================================================= */}
      {isPermissionModalOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '85%',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="#059669" weight="fill" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'id' ? 'Pengajuan Izin / Cuti' : 'Submit Permission / Leave'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsPermissionModalOpen(false);
                    setPermSuccess(false);
                  }}
                  style={{ border: 'none', background: 'transparent', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {permSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img src={clipboardChecklist} alt="Success" style={{ width: '100px', height: 'auto' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#15803D', margin: 0 }}>
                    {language === 'id' ? 'Pengajuan Berhasil Dikirim!' : 'Request Submitted!'}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                    {language === 'id' ? 'Formulir izin Anda telah diteruskan ke Manager untuk persetujuan.' : 'Your leave request has been sent to Manager for approval.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPermissionModalOpen(false);
                      setPermSuccess(false);
                    }}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#02388A',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 700,
                    }}
                  >
                    {language === 'id' ? 'Kembali' : 'Done'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Select Type */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {language === 'id' ? 'Jenis Pengajuan' : 'Type'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '6px' }}>
                      {[
                        { id: 'LEAVE', label: language === 'id' ? 'Cuti Tahunan' : 'Annual Leave' },
                        { id: 'SICK', label: language === 'id' ? 'Sakit' : 'Sick' },
                        { id: 'PERMIT', label: language === 'id' ? 'Izin Khusus' : 'Permission' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setPermType(t.id)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: '8px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            border: permType === t.id ? '1.5px solid #059669' : '1px solid #E2E8F0',
                            backgroundColor: permType === t.id ? '#ECFDF5' : '#FFFFFF',
                            color: permType === t.id ? '#059669' : '#64748B',
                            cursor: 'pointer',
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Input */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {language === 'id' ? 'Tanggal Pelaksanaan' : 'Date Range'}
                    </label>
                    <input
                      type="text"
                      defaultValue="29 Sep 2026 - 30 Sep 2026 (2 Hari)"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8125rem',
                        marginTop: '4px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Reason Textarea */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {language === 'id' ? 'Alasan / Keterangan' : 'Reason / Note'}
                    </label>
                    <textarea
                      rows={3}
                      value={permReason}
                      onChange={(e) => setPermReason(e.target.value)}
                      placeholder={language === 'id' ? 'Tuliskan alasan pengajuan izin/cuti...' : 'Write reason for permission...'}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8125rem',
                        marginTop: '4px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setPermSuccess(true)}
                    style={{
                      marginTop: '6px',
                      width: '100%',
                      height: '42px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {language === 'id' ? 'Kirim Pengajuan' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 5: REPORT ATTENDANCE MODAL
          ========================================================================= */}
      {isReportModalOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '80%',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChartLineUp size={20} color="#6D28D9" weight="fill" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'id' ? 'Laporan Absensi Bulan Ini' : 'Monthly Attendance Report'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  style={{ border: 'none', background: 'transparent', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Monthly Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ backgroundColor: '#F0FDF4', padding: '12px', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#166534', fontWeight: 600 }}>Tingkat Kehadiran</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>96.5%</div>
                  <div style={{ fontSize: '0.625rem', color: '#15803D' }}>22 Hari Hadir dari 23 Shift</div>
                </div>

                <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#92400E', fontWeight: 600 }}>Keterlambatan</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>1 Kali</div>
                  <div style={{ fontSize: '0.625rem', color: '#B45309' }}>Total 18 menit keterlambatan</div>
                </div>

                <div style={{ backgroundColor: '#EFF6FF', padding: '12px', borderRadius: '12px', border: '1px solid #DBEAFE' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#1E40AF', fontWeight: 600 }}>Rata-rata Jam Kerja</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D4ED8', marginTop: '2px' }}>08j 54m</div>
                  <div style={{ fontSize: '0.625rem', color: '#1E40AF' }}>Per hari kerja aktif</div>
                </div>

                <div style={{ backgroundColor: '#F3E8FF', padding: '12px', borderRadius: '12px', border: '1px solid #E9D5FF' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#6B21A8', fontWeight: 600 }}>Cuti & Izin</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7E22CE', marginTop: '2px' }}>0 Hari</div>
                  <div style={{ fontSize: '0.625rem', color: '#7E22CE' }}>Sisa Cuti Tahunan: 12 Hari</div>
                </div>
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          MODAL 6: PAYSLIP MODAL
          ========================================================================= */}
      {isPayslipModalOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '85%',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Receipt size={20} color="#D97706" weight="fill" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'id' ? 'Slip Gaji • Sep 2026' : 'Payslip • Sep 2026'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayslipModalOpen(false)}
                  style={{ border: 'none', background: 'transparent', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Payslip Card Summary */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #02388A 0%, #0348AF 100%)',
                  borderRadius: '16px',
                  padding: '16px',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ fontSize: '0.6875rem', color: '#93C5FD', fontWeight: 600 }}>Total Gaji Bersih (Take Home Pay)</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.3px' }}>
                  {isEng ? 'Rp 6.850.000' : isSec ? 'Rp 6.150.000' : isHk ? 'Rp 5.650.000' : 'Rp 10.450.000'}
                </div>
                <div style={{ fontSize: '0.625rem', color: '#DBEAFE', marginTop: '4px' }}>
                  {userName} ({userDept}) • Periode: 01 Sep 2026 - 30 Sep 2026
                </div>
              </div>

              {/* Payslip Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Gaji Pokok</span>
                  <span style={{ fontWeight: 700 }}>{isEng ? 'Rp 5.200.000' : isSec ? 'Rp 4.600.000' : isHk ? 'Rp 4.300.000' : 'Rp 8.000.000'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Tunjangan Kehadiran & Shift</span>
                  <span style={{ fontWeight: 700 }}>{isEng ? 'Rp 850.000' : isSec ? 'Rp 900.000' : isHk ? 'Rp 800.000' : 'Rp 2.000.000'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Uang Makan & Operasional</span>
                  <span style={{ fontWeight: 700 }}>{isEng ? 'Rp 900.000' : isSec ? 'Rp 850.000' : isHk ? 'Rp 750.000' : 'Rp 1.000.000'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Insentif Roster / Jabatan</span>
                  <span style={{ fontWeight: 700 }}>{isEng ? 'Rp 350.000' : isSec ? 'Rp 250.000' : isHk ? 'Rp 200.000' : 'Rp 0'}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}>
                  <span>Potongan BPJS Ketenagakerjaan & Kes</span>
                  <span style={{ fontWeight: 700 }}>{isEng ? '- Rp 450.000' : isSec ? '- Rp 450.000' : isHk ? '- Rp 400.000' : '- Rp 550.000'}</span>
                </div>
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}
    </div>
  );
};

export default WorkAttendanceView;

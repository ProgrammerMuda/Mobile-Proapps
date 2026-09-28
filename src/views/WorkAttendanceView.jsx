import React, { useState, useEffect } from 'react';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          }}
        >
          {language === 'id' ? 'Presensi Kerja' : 'Work Attendance'}
        </h1>
      </div>
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
  const [actionType, setActionType] = useState('CLOCK_IN'); // 'CLOCK_IN' | 'CLOCK_OUT'
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

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
      status: isClockedIn ? 'HADIR' : clockOutTime ? 'HADIR' : 'BELUM_ABSEN',
      statusLabel: language === 'id' ? (isClockedIn ? 'Hadir Aktif' : clockOutTime ? 'Selesai' : 'Belum Absen') : (isClockedIn ? 'Active In' : clockOutTime ? 'Completed' : 'Pending'),
      statusColor: '#16A34A',
      statusBg: '#DCFCE7',
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
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                    }}
                  >
                    {language === 'id' ? 'Tepat Waktu' : 'On Time'}
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
                    background: '#F1F5F9',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B',
                    flexShrink: 0,
                  }}
                >
                  <X size={18} weight="bold" />
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
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB',
                      flexShrink: 0,
                    }}
                  >
                    <QrCode size={24} weight="bold" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>
                        {language === 'id' ? 'Scan QR Code' : 'Scan QR Code'}
                      </span>
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
                        {language === 'id' ? 'Cepat' : 'Fast'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.3 }}>
                      {language === 'id'
                        ? 'Pindai barcode QR yang terpasang di pos atau lokasi kerja'
                        : 'Scan the QR barcode located at the workstation or post'}
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
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      flexShrink: 0,
                    }}
                  >
                    <Camera size={24} weight="bold" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>
                        {language === 'id' ? 'Foto Selfie' : 'Selfie Photo'}
                      </span>
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
                        {language === 'id' ? 'Face Match' : 'Face Match'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.3 }}>
                      {language === 'id'
                        ? 'Ambil foto selfie dengan verifikasi pengenalan wajah otomatis'
                        : 'Take a selfie photo with instant facial verification'}
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
          MODAL 1: CLOCK IN / CLOCK OUT ACTION SHEET (QR CODE & SELFIE SIMULATION)
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
                      {attendanceMethod === 'QR'
                        ? (actionType === 'CLOCK_IN' ? (language === 'id' ? 'Scan QR Clock In' : 'Scan QR Clock In') : (language === 'id' ? 'Scan QR Clock Out' : 'Scan QR Clock Out'))
                        : (actionType === 'CLOCK_IN' ? (language === 'id' ? 'Foto Selfie Clock In' : 'Selfie Clock In') : (language === 'id' ? 'Foto Selfie Clock Out' : 'Selfie Clock Out'))}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.5625rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: attendanceMethod === 'QR' ? '#EFF6FF' : '#DCFCE7',
                        color: attendanceMethod === 'QR' ? '#2563EB' : '#15803D',
                      }}
                    >
                      {attendanceMethod === 'QR' ? 'QR Scanner' : 'Face Match'}
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
                    background: '#F1F5F9',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B',
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Viewfinder simulation based on method */}
              {attendanceMethod === 'QR' ? (
                /* QR SCANNER VIEWPORT */
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
                      onClick={() => setAttendanceMethod('PHOTO')}
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
              ) : (
                /* SELFIE CAMERA VIEWPORT */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      height: '180px',
                      backgroundColor: '#0F172A',
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
                    <Camera size={38} color="#38BDF8" weight="bold" />
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                      {language === 'id' ? 'Wajah Terverifikasi Otomatis' : 'Face Verified Automatically'}
                    </span>
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(22, 163, 74, 0.85)',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle size={12} weight="fill" />
                      <span>Match 99.4%</span>
                    </div>
                  </div>

                  {/* Verification Info */}
                  <div
                    style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #DCFCE7',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.75rem',
                      color: '#15803D',
                    }}
                  >
                    <CheckCircle size={18} weight="fill" color="#16A34A" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{language === 'id' ? 'Verifikasi Kehadiran Siap' : 'Attendance Verification Ready'}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#166534' }}>{userName} • {activeShiftTitle}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttendanceMethod('QR')}
                      style={{
                        border: 'none',
                        background: '#FFFFFF',
                        color: '#15803D',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {language === 'id' ? 'Ganti QR' : 'Switch QR'}
                    </button>
                  </div>
                </div>
              )}

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
                      <span>
                        {attendanceMethod === 'QR'
                          ? (language === 'id' ? 'Konfirmasi Presensi QR' : 'Confirm QR Clock In')
                          : (language === 'id' ? 'Konfirmasi Presensi Foto' : 'Confirm Photo Clock In')}
                      </span>
                    </>
                  ) : (
                    <>
                      <SignOut size={18} weight="bold" />
                      <span>
                        {attendanceMethod === 'QR'
                          ? (language === 'id' ? 'Konfirmasi Presensi QR' : 'Confirm QR Clock Out')
                          : (language === 'id' ? 'Konfirmasi Presensi Foto' : 'Confirm Photo Clock Out')}
                      </span>
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
          MODAL 2: SUCCESS PRESENCE POPUP
          ========================================================================= */}
      {isSuccessModalOpen && (() => {
        const modalTarget = getModalTarget();
        const modalElement = (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                width: '100%',
                maxWidth: '340px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                animation: 'scaleIn 0.2s ease-out',
              }}
            >
              <img
                src={successCheck}
                alt="Success"
                style={{
                  width: '130px',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {actionType === 'CLOCK_IN'
                    ? (language === 'id' ? 'Clock In Berhasil!' : 'Clock In Successful!')
                    : (language === 'id' ? 'Clock Out Berhasil!' : 'Clock Out Successful!')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '6px 0 0 0' }}>
                  {actionType === 'CLOCK_IN'
                    ? (language === 'id' ? 'Selamat bekerja! Kehadiran Anda telah dicatat pada sistem.' : 'Have a great workday! Your attendance is recorded.')
                    : (language === 'id' ? 'Terima kasih atas kerja keras Anda hari ini. Sampai jumpa besok!' : 'Thank you for your hard work today. See you tomorrow!')}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  width: '100%',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                  {currentTime} • {userName}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>{activeShiftName}</span>
                  <span>•</span>
                  <span style={{ fontWeight: 600, color: attendanceMethod === 'QR' ? '#2563EB' : '#059669' }}>
                    {attendanceMethod === 'QR' ? 'Via Scan QR' : 'Via Foto Selfie'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'id' ? 'Tutup' : 'Close'}
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
                  style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} weight="bold" />
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
                  style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} weight="bold" />
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
                  style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} weight="bold" />
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
                  style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} weight="bold" />
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

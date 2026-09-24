import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  CaretLeft,
  CaretRight,
  CaretDown,
  Buildings,
  Users,
  Receipt,
  Clock,
  Warning,
  Drop,
  Lightning,
  X,
  Key,
  Car,
  Package,
  UsersThree,
  User,
  CalendarCheck,
  CalendarBlank,
  Wrench,
  ClipboardText,
  CheckCircle,
  MapPin,
  Plus,
  SunDim,
  SignIn,
  Fingerprint,
  Timer,
  SealCheck,
  HourglassMedium,
  Star,
  ChatTeardropText,
  Door,
  Cube,
  MagnifyingGlass,
} from '@phosphor-icons/react';

const MONTHS = [
  { short: 'Jan', full: 'January' },
  { short: 'Feb', full: 'February' },
  { short: 'Mar', full: 'March' },
  { short: 'Apr', full: 'April' },
  { short: 'May', full: 'May' },
  { short: 'Jun', full: 'June' },
  { short: 'Jul', full: 'July' },
  { short: 'Aug', full: 'August' },
  { short: 'Sep', full: 'September' },
  { short: 'Oct', full: 'October' },
  { short: 'Nov', full: 'November' },
  { short: 'Dec', full: 'December' },
];

export const OverviewHeader = () => {
  const { t } = useLanguage();
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: '#334155',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        height: '52px',
        borderBottom: '1px solid #F1F5F9',
        flexShrink: 0,
        zIndex: 40,
        boxSizing: 'border-box',
        boxShadow: 'none',
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E293B',
          margin: 0,
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}
      >
        {t('overview.title')}
      </h1>
    </header>
  );
};

/**
 * Engineering Specific Overview Sub-Component
 */
const YEARLY_ATTENDANCE_DATA = {
  2026: {
    totalWorkDays: 203,
    avgAttendance: '97.0%',
    totalOnTime: 191,
    totalLate: 6,
    totalLeave: 6,
    totalAlpha: 0,
    months: [
      { month: 'Sep 2026', attendancePct: '96%', onTime: 22, late: 1, leave: 1, alpha: 0, totalDays: 24, isCurrent: true },
      { month: 'Agu 2026', attendancePct: '100%', onTime: 22, late: 0, leave: 0, alpha: 0, totalDays: 22 },
      { month: 'Jul 2026', attendancePct: '96%', onTime: 22, late: 1, leave: 1, alpha: 0, totalDays: 24 },
      { month: 'Jun 2026', attendancePct: '100%', onTime: 22, late: 0, leave: 0, alpha: 0, totalDays: 22 },
      { month: 'Mei 2026', attendancePct: '95.5%', onTime: 20, late: 1, leave: 1, alpha: 0, totalDays: 22 },
      { month: 'Apr 2026', attendancePct: '95.7%', onTime: 21, late: 1, leave: 1, alpha: 0, totalDays: 23 },
      { month: 'Mar 2026', attendancePct: '100%', onTime: 23, late: 0, leave: 0, alpha: 0, totalDays: 23 },
      { month: 'Feb 2026', attendancePct: '95.2%', onTime: 19, late: 1, leave: 1, alpha: 0, totalDays: 21 },
      { month: 'Jan 2026', attendancePct: '95.5%', onTime: 20, late: 1, leave: 1, alpha: 0, totalDays: 22 },
    ],
  },
  2025: {
    totalWorkDays: 261,
    avgAttendance: '97.7%',
    totalOnTime: 247,
    totalLate: 8,
    totalLeave: 6,
    totalAlpha: 0,
    months: [
      { month: 'Des 2025', attendancePct: '100%', onTime: 22, late: 0, leave: 0, alpha: 0, totalDays: 22 },
      { month: 'Nov 2025', attendancePct: '95.7%', onTime: 21, late: 1, leave: 1, alpha: 0, totalDays: 23 },
      { month: 'Okt 2025', attendancePct: '100%', onTime: 23, late: 0, leave: 0, alpha: 0, totalDays: 23 },
      { month: 'Sep 2025', attendancePct: '95.5%', onTime: 20, late: 1, leave: 1, alpha: 0, totalDays: 22 },
      { month: 'Agu 2025', attendancePct: '100%', onTime: 22, late: 0, leave: 0, alpha: 0, totalDays: 22 },
      { month: 'Jul 2025', attendancePct: '95.7%', onTime: 21, late: 1, leave: 1, alpha: 0, totalDays: 23 },
      { month: 'Jun 2025', attendancePct: '100%', onTime: 21, late: 0, leave: 0, alpha: 0, totalDays: 21 },
      { month: 'Mei 2025', attendancePct: '95.2%', onTime: 19, late: 1, leave: 1, alpha: 0, totalDays: 21 },
      { month: 'Apr 2025', attendancePct: '100%', onTime: 22, late: 0, leave: 0, alpha: 0, totalDays: 22 },
      { month: 'Mar 2025', attendancePct: '95.7%', onTime: 21, late: 1, leave: 1, alpha: 0, totalDays: 23 },
      { month: 'Feb 2025', attendancePct: '100%', onTime: 20, late: 0, leave: 0, alpha: 0, totalDays: 20 },
      { month: 'Jan 2025', attendancePct: '95.5%', onTime: 20, late: 1, leave: 1, alpha: 0, totalDays: 22 },
    ],
  },
};

const EngineeringOverviewContent = ({ t, onNavigateDetails }) => {
  const { language } = useLanguage();
  const [clockedIn, setClockedIn] = useState(true);
  const [isYearlyModalOpen, setIsYearlyModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isWoMonthPickerOpen, setIsWoMonthPickerOpen] = useState(false);
  const [woSelectedMonth, setWoSelectedMonth] = useState(8); // 8 = September
  const [woSelectedYear, setWoSelectedYear] = useState(2026);
  const [woPickerTempMonth, setWoPickerTempMonth] = useState(8);
  const [woPickerTempYear, setWoPickerTempYear] = useState(2026);

  const [isInspMonthPickerOpen, setIsInspMonthPickerOpen] = useState(false);
  const [inspSelectedMonth, setInspSelectedMonth] = useState(8); // 8 = September
  const [inspSelectedYear, setInspSelectedYear] = useState(2026);
  const [inspPickerTempMonth, setInspPickerTempMonth] = useState(8);
  const [inspPickerTempYear, setInspPickerTempYear] = useState(2026);

  const [isHsMonthPickerOpen, setIsHsMonthPickerOpen] = useState(false);
  const [hsSelectedMonth, setHsSelectedMonth] = useState(8); // 8 = September
  const [hsSelectedYear, setHsSelectedYear] = useState(2026);
  const [hsPickerTempMonth, setHsPickerTempMonth] = useState(8);
  const [hsPickerTempYear, setHsPickerTempYear] = useState(2026);

  const [isMeterMonthPickerOpen, setIsMeterMonthPickerOpen] = useState(false);
  const [meterSelectedMonth, setMeterSelectedMonth] = useState(8); // 8 = September
  const [meterSelectedYear, setMeterSelectedYear] = useState(2026);
  const [meterPickerTempMonth, setMeterPickerTempMonth] = useState(8);
  const [meterPickerTempYear, setMeterPickerTempYear] = useState(2026);

  const [isUnrecordedModalOpen, setIsUnrecordedModalOpen] = useState(false);
  const [unrecordedFilterTab, setUnrecordedFilterTab] = useState('ALL'); // 'ALL' | 'WATER' | 'ELECTRIC'
  const [unrecordedSearchQuery, setUnrecordedSearchQuery] = useState('');

  const SAMPLE_UNRECORDED_UNITS = [
    { id: '1', unit: 'Tower A - Unit 08A', floor: 'Lantai 8', type: 'water', meterType: 'Water Meter', meterNo: 'WM-A0801', lastReading: '124.5 m³' },
    { id: '2', unit: 'Tower A - Unit 12B', floor: 'Lantai 12', type: 'electric', meterType: 'Electric Meter', meterNo: 'EM-A1202', lastReading: '1,450 kWh' },
    { id: '3', unit: 'Tower B - Unit 03C', floor: 'Lantai 3', type: 'water', meterType: 'Water Meter', meterNo: 'WM-B0303', lastReading: '88.2 m³' },
    { id: '4', unit: 'Tower B - Unit 07D', floor: 'Lantai 7', type: 'electric', meterType: 'Electric Meter', meterNo: 'EM-B0704', lastReading: '2,110 kWh' },
    { id: '5', unit: 'Tower C - Unit 15A', floor: 'Lantai 15', type: 'water', meterType: 'Water Meter', meterNo: 'WM-C1501', lastReading: '205.1 m³' },
    { id: '6', unit: 'Tower C - Unit 18B', floor: 'Lantai 18', type: 'electric', meterType: 'Electric Meter', meterNo: 'EM-C1802', lastReading: '980 kWh' },
    { id: '7', unit: 'Tower A - Unit 22C', floor: 'Lantai 22', type: 'water', meterType: 'Water Meter', meterNo: 'WM-A2203', lastReading: '143.0 m³' },
    { id: '8', unit: 'Tower B - Unit 10A', floor: 'Lantai 10', type: 'electric', meterType: 'Electric Meter', meterNo: 'EM-B1001', lastReading: '1,720 kWh' },
  ];

  const WO_MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const WO_MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const currentWoMonthName = language === 'id' ? WO_MONTHS_ID[woSelectedMonth] : WO_MONTHS_EN[woSelectedMonth];
  const currentHsMonthName = language === 'id' ? WO_MONTHS_ID[hsSelectedMonth] : WO_MONTHS_EN[hsSelectedMonth];
  const currentInspMonthName = language === 'id' ? WO_MONTHS_ID[inspSelectedMonth] : WO_MONTHS_EN[inspSelectedMonth];
  const currentMeterMonthName = language === 'id' ? WO_MONTHS_ID[meterSelectedMonth] : WO_MONTHS_EN[meterSelectedMonth];

  const handleViewDetails = (section) => {
    if (onNavigateDetails) {
      onNavigateDetails(section);
    } else {
      alert(t('overview.detailsAlert', { section }));
    }
  };

  const currentYearData = YEARLY_ATTENDANCE_DATA[selectedYear] || YEARLY_ATTENDANCE_DATA[2026];

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
          SECTION 1: Shift Hari Ini (Today Shift)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.eng.todayShift')}
          </h2>
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
            }}
          >
            {t('overview.eng.onTime')}
          </span>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
            {t('overview.eng.shiftTime')}
          </div>

          {/* 2 Side-by-Side Clock Cards (Clock In vs Clock Out) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {/* Card Masuk / Clock In */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '10px 12px',
                border: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                {t('overview.eng.clockIn')}
              </span>
              <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.3px' }}>
                07:52 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#64748B' }}>WIB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <SealCheck size={14} weight="fill" color="#16A34A" />
                <span style={{ fontSize: '0.6875rem', color: '#16A34A', fontWeight: 600 }}>
                  {t('overview.eng.recorded')}
                </span>
              </div>
            </div>

            {/* Card Keluar / Clock Out (Empty -- : -- if haven't gone home) */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '10px 12px',
                border: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                {t('overview.eng.clockOut')}
              </span>
              <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: !clockedIn ? '#1E293B' : '#94A3B8', letterSpacing: '-0.3px' }}>
                {!clockedIn ? (
                  <>17:01 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#64748B' }}>WIB</span></>
                ) : (
                  '-- : --'
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                {!clockedIn ? (
                  <>
                    <SealCheck size={14} weight="fill" color="#16A34A" />
                    <span style={{ fontSize: '0.6875rem', color: '#16A34A', fontWeight: 600 }}>
                      {t('overview.eng.recorded')}
                    </span>
                  </>
                ) : (
                  <>
                    <HourglassMedium size={14} weight="fill" color="#94A3B8" />
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>
                      {t('overview.eng.notRecorded')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: Rekap Presensi Bulanan (Monthly Attendance)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.eng.monthlyAttendanceTitle')}
          </h2>

          <button
            type="button"
            onClick={() => handleViewDetails('Employee attendance')}
            style={{
              background: 'none',
              border: 'none',
              color: '#02388A',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span>{t('overview.viewDetails')}</span>
            <CaretRight size={14} weight="bold" />
          </button>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            {language === 'id' ? 'Bulan Ini (September 2026)' : 'This Month (September 2026)'}
          </div>

          {/* Hero Fill Attendance Rate Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #02388A 0%, #0052CC 60%, #0284C7 100%)',
              borderRadius: '14px',
              padding: '13px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle background glow effect */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(2, 56, 138, 0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarBlank size={18} weight="fill" color="#38BDF8" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.1px' }}>
                  {t('overview.eng.attendancePct')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  23/24 {language === 'id' ? 'Hari' : 'Days'}
                </span>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1,
                    letterSpacing: '-0.5px',
                  }}
                >
                  96%
                </span>
              </div>
            </div>

            {/* Glowing White Progress Bar on Semi-transparent Track */}
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '96%',
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                }}
              />
            </div>
          </div>

          {/* 4 Day Count KPI Metrics Micro-Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}
          >
            {/* On Time */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderRadius: '12px',
                padding: '10px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1 }}>22</span>
              <span style={{ fontSize: '0.6875rem', color: '#15803D', fontWeight: 600 }}>{t('overview.eng.onTime')}</span>
            </div>

            {/* Late */}
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FEF3C7',
                borderRadius: '12px',
                padding: '10px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>1</span>
              <span style={{ fontSize: '0.6875rem', color: '#B45309', fontWeight: 600 }}>{t('overview.eng.late')}</span>
            </div>

            {/* Leave */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '10px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#475569', lineHeight: 1.1 }}>1</span>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>{t('overview.eng.leaveDays')}</span>
            </div>

            {/* Alpha */}
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FEE2E2',
                borderRadius: '12px',
                padding: '10px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>0</span>
              <span style={{ fontSize: '0.6875rem', color: '#991B1B', fontWeight: 600 }}>{t('overview.eng.alpha')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Attendance Breakdown Bottom Sheet Modal */}
      {isYearlyModalOpen && (() => {
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsYearlyModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {t('overview.eng.yearlyAttendanceTitle')}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {t('overview.eng.annualSummary')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsYearlyModalOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '6px 10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedYear((y) => (y === 2026 ? 2025 : y))}
                  disabled={selectedYear === 2025}
                  style={{
                    backgroundColor: selectedYear === 2025 ? '#F1F5F9' : '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: selectedYear === 2025 ? 'default' : 'pointer',
                    color: selectedYear === 2025 ? '#94A3B8' : '#02388A',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {selectedYear}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedYear((y) => (y === 2025 ? 2026 : y))}
                  disabled={selectedYear === 2026}
                  style={{
                    backgroundColor: selectedYear === 2026 ? '#F1F5F9' : '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: selectedYear === 2026 ? 'default' : 'pointer',
                    color: selectedYear === 2026 ? '#94A3B8' : '#02388A',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* Annual Aggregate KPI Card (4 Metric Columns + Progress Footer) */}
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  borderRadius: '14px',
                  padding: '12px',
                  border: '1px solid #DBEAFE',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#16A34A' }}>
                      {currentYearData.totalOnTime}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#166534', marginTop: '2px', fontWeight: 600 }}>
                      {t('overview.eng.onTime')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#D97706' }}>
                      {currentYearData.totalLate}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#9A3412', marginTop: '2px', fontWeight: 600 }}>
                      {t('overview.eng.late')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#64748B' }}>
                      {currentYearData.totalLeave}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#475569', marginTop: '2px', fontWeight: 600 }}>
                      {t('overview.eng.leaveDays')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#DC2626' }}>
                      {currentYearData.totalAlpha}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#991B1B', marginTop: '2px', fontWeight: 600 }}>
                      {t('overview.eng.alpha')}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#1E40AF' }}>
                      {t('overview.eng.avgAttendance')} ({selectedYear})
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#02388A' }}>
                      {currentYearData.avgAttendance}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: currentYearData.avgAttendance, height: '100%', backgroundColor: '#02388A', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>

              {/* Monthly Breakdown List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '42vh', paddingRight: '2px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
                  {t('overview.eng.monthlyBreakdown')} ({selectedYear})
                </span>

                {currentYearData.months.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: item.isCurrent ? '#F0F9FF' : '#F8FAFC',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      border: item.isCurrent ? '1.5px solid #BAE6FD' : '1px solid #E2E8F0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>
                          {item.month}
                        </span>
                        {item.isCurrent && (
                          <span
                            style={{
                              backgroundColor: '#E0F2FE',
                              color: '#0284C7',
                              fontSize: '0.625rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '9999px',
                            }}
                          >
                            Bulan Ini
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          color: parseFloat(item.attendancePct) >= 98 ? '#16A34A' : '#02388A',
                        }}
                      >
                        {item.attendancePct}
                      </span>
                    </div>

                    {/* Metric mini row with Alpha */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                      <span>
                        <strong style={{ color: '#16A34A' }}>{item.onTime}</strong> {t('overview.eng.onTime')}
                      </span>
                      <span>•</span>
                      <span>
                        <strong style={{ color: item.late > 0 ? '#D97706' : '#64748B' }}>{item.late}</strong> {t('overview.eng.late')}
                      </span>
                      <span>•</span>
                      <span>
                        <strong style={{ color: '#64748B' }}>{item.leave}</strong> {t('overview.eng.leaveDays')}
                      </span>
                      <span>•</span>
                      <span>
                        <strong style={{ color: item.alpha > 0 ? '#DC2626' : '#64748B' }}>{item.alpha}</strong> {t('overview.eng.alpha')}
                      </span>
                      <span>•</span>
                      <span>
                        {item.totalDays} {t('overview.eng.totalWorkDays')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}


      {/* =========================================================================
          SECTION 3: Perintah Kerja (Work Order)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.eng.woTitle')}
          </h2>
          <button
            type="button"
            onClick={() => {
              setWoPickerTempMonth(woSelectedMonth);
              setWoPickerTempYear(woSelectedYear);
              setIsWoMonthPickerOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{currentWoMonthName} {woSelectedYear}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >

        {/* 3 Activity Performance Metrics (Summary Badges) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            textAlign: 'center',
          }}
        >
          {/* 1. Total Request */}
          <div
            onClick={() => handleViewDetails('My Work Orders')}
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '8px 4px',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              22
            </div>
            <div style={{ fontSize: '0.625rem', color: '#334155', fontWeight: 700, lineHeight: 1.2 }}>
              <div>Total</div>
              <div>{language === 'id' ? 'Request' : 'Requests'}</div>
            </div>
          </div>

          {/* 2. Survey yang Telah Dilakukan (Biru) */}
          <div
            onClick={() => handleViewDetails('My Work Orders')}
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '12px',
              padding: '8px 4px',
              border: '1px solid #DBEAFE',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D4ED8', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              8
            </div>
            <div style={{ fontSize: '0.625rem', color: '#1E40AF', fontWeight: 700, lineHeight: 1.2 }}>
              <div>{language === 'id' ? 'Survey yang' : 'Surveys'}</div>
              <div>{language === 'id' ? 'Telah Dilakukan' : 'Conducted'}</div>
            </div>
          </div>

          {/* 3. Pekerjaan yang Telah Dilakukan */}
          <div
            onClick={() => handleViewDetails('My Work Orders')}
            style={{
              backgroundColor: '#F0FDF4',
              borderRadius: '12px',
              padding: '8px 4px',
              border: '1px solid #DCFCE7',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803D', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              14
            </div>
            <div style={{ fontSize: '0.625rem', color: '#166534', fontWeight: 700, lineHeight: 1.2 }}>
              <div>{language === 'id' ? 'Pekerjaan yang' : 'Works'}</div>
              <div>{language === 'id' ? 'Telah Dilakukan' : 'Executed'}</div>
            </div>
          </div>
        </div>

        {/* Dynamic Dual Line / Area Chart (Same style as Tenant Requests) */}
        <div
          onClick={() => handleViewDetails('My Work Orders')}
          style={{
            cursor: 'pointer',
            marginTop: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
              {language === 'id' ? 'Tren Aktivitas Mingguan' : 'Weekly Activity Trend'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.6875rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1D4ED8' }}>
                <span style={{ width: '10px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px' }} />
                <span>Survey</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803D' }}>
                <span style={{ width: '10px', height: '3px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                <span>{language === 'id' ? 'Pekerjaan' : 'Work'}</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', position: 'relative' }}>
            <svg
              viewBox="0 0 340 160"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                overflow: 'visible',
                animation: 'chartFadeIn 0.35s ease-out',
              }}
            >
              <defs>
                <linearGradient id="woSurveyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="woWorkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              {[
                { val: '6', y: 22 },
                { val: '4', y: 56 },
                { val: '2', y: 90 },
                { val: '0', y: 124 },
              ].map((grid) => (
                <g key={grid.val}>
                  <text
                    x="18"
                    y={grid.y + 4}
                    fontSize="10"
                    fontWeight="500"
                    fill="#94A3B8"
                    textAnchor="end"
                  >
                    {grid.val}
                  </text>
                  <line
                    x1="28"
                    y1={grid.y}
                    x2="330"
                    y2={grid.y}
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Work Area Under Line (Green) */}
              <path
                d="M 55,73 L 135,56 L 215,56 L 295,73 L 295,124 L 55,124 Z"
                fill="url(#woWorkGrad)"
                style={{ animation: 'areaFadeIn 0.4s ease-out' }}
              />

              {/* Work Connecting Line (Green) */}
              <path
                d="M 55,73 L 135,56 L 215,56 L 295,73"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Survey Area Under Line (Blue) */}
              <path
                d="M 55,107 L 135,73 L 215,90 L 295,90 L 295,124 L 55,124 Z"
                fill="url(#woSurveyGrad)"
                style={{ animation: 'areaFadeIn 0.4s ease-out' }}
              />

              {/* Survey Connecting Line (Blue) */}
              <path
                d="M 55,107 L 135,73 L 215,90 L 295,90"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points & Values for Work (Green) */}
              {[
                { x: 55, y: 73, val: '3' },
                { x: 135, y: 56, val: '4' },
                { x: 215, y: 56, val: '4' },
                { x: 295, y: 73, val: '3' },
              ].map((pt, i) => (
                <g key={`work-${i}`}>
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fontSize="11"
                    fontWeight="700"
                    fill="#15803D"
                    textAnchor="middle"
                  >
                    {pt.val}
                  </text>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#16A34A"
                    strokeWidth="2.5"
                  />
                </g>
              ))}

              {/* Data Points & Values for Survey (Blue) */}
              {[
                { x: 55, y: 107, val: '1' },
                { x: 135, y: 73, val: '3' },
                { x: 215, y: 90, val: '2' },
                { x: 295, y: 90, val: '2' },
              ].map((pt, i) => (
                <g key={`survey-${i}`}>
                  <text
                    x={pt.x}
                    y={pt.y + 15}
                    fontSize="11"
                    fontWeight="700"
                    fill="#1D4ED8"
                    textAnchor="middle"
                  >
                    {pt.val}
                  </text>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                  />
                </g>
              ))}

              {/* X-Axis Labels */}
              {[
                { x: 55, label: language === 'id' ? 'Mg 1' : 'W1' },
                { x: 135, label: language === 'id' ? 'Mg 2' : 'W2' },
                { x: 215, label: language === 'id' ? 'Mg 3' : 'W3' },
                { x: 295, label: language === 'id' ? 'Mg 4' : 'W4' },
              ].map((axis, i) => (
                <text
                  key={`axis-${i}`}
                  x={axis.x}
                  y="146"
                  fontSize="10"
                  fontWeight="600"
                  fill="#64748B"
                  textAnchor="middle"
                >
                  {axis.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* View All Work Orders Button */}
        <button
          type="button"
          onClick={() => handleViewDetails('Work Order')}
          style={{
            width: '100%',
            height: '38px',
            backgroundColor: '#FFFFFF',
            color: '#02388A',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '2px',
          }}
        >
          {t('overview.eng.viewAllWo')}
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
    </div>

      {/* Work Order Month Picker Bottom Sheet Modal */}
      {isWoMonthPickerOpen && (() => {
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsWoMonthPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Pilih Periode Work Order' : 'Select Work Order Period'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {language === 'id' ? 'Pilih bulan dan tahun' : 'Choose month and year'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWoMonthPickerOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setWoPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {woPickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setWoPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12 Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {(language === 'id' ? WO_MONTHS_ID : WO_MONTHS_EN).map((mName, idx) => {
                  const isSelected = woPickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setWoPickerTempMonth(idx)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#02388A' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => {
                  setWoSelectedMonth(woPickerTempMonth);
                  setWoSelectedYear(woPickerTempYear);
                  setIsWoMonthPickerOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                {language === 'id' ? 'Terapkan Periode' : 'Apply Period'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}


      {/* =========================================================================
          SECTION: Home Service (Under Work Order)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.hk.hsTitle')}
          </h2>
          <button
            type="button"
            onClick={() => {
              setHsPickerTempMonth(hsSelectedMonth);
              setHsPickerTempYear(hsSelectedYear);
              setIsHsMonthPickerOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{currentHsMonthName} {hsSelectedYear}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          {/* Donut Chart Breakdown for Home Service */}
          <div
            onClick={() => handleViewDetails('Home Service')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '4px 0',
            }}
          >
            {/* Left Donut SVG with Center Label */}
            <div
              style={{
                position: 'relative',
                width: '110px',
                height: '110px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="110"
                height="110"
                viewBox="0 0 120 120"
                style={{
                  transform: 'rotate(-90deg)',
                  overflow: 'visible',
                }}
              >
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                />
                {/* Works Executed Segment (66.7% - Green #16A34A) */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="12"
                  strokeDasharray={`${(12 / 18) * 289.03} 289.03`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Surveys Conducted Segment (33.3% - Blue #2563EB) */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="12"
                  strokeDasharray={`${(6 / 18) * 289.03} 289.03`}
                  strokeDashoffset={-((12 / 18) * 289.03)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Text */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1,
                    letterSpacing: '-0.3px',
                  }}
                >
                  18
                </span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#64748B',
                    marginTop: '2px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  Total
                </span>
              </div>
            </div>

            {/* Right Breakdown Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Works / Layanan Item */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                      {language === 'id' ? 'Pekerjaan yang Dilakukan' : 'Works Executed'}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                      66.7% {language === 'id' ? 'dari total' : 'of total'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#15803D' }}>
                  12
                </span>
              </div>

              <div style={{ height: '1px', backgroundColor: '#E2E8F0', width: '100%' }} />

              {/* Surveys Item */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                      {language === 'id' ? 'Survey yang Dilakukan' : 'Surveys Conducted'}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                      33.3% {language === 'id' ? 'dari total' : 'of total'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1D4ED8' }}>
                  6
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

          {/* Weekly Activity Trend (Survey vs Layanan / Works) */}
          <div
            onClick={() => handleViewDetails('Home Service')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                {language === 'id' ? 'Tren Aktivitas Mingguan' : 'Weekly Activity Trend'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.6875rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1D4ED8' }}>
                  <span style={{ width: '10px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px' }} />
                  <span>Survey</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803D' }}>
                  <span style={{ width: '10px', height: '3px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                  <span>{language === 'id' ? 'Pekerjaan' : 'Work'}</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', position: 'relative' }}>
              <svg
                viewBox="0 0 340 160"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  overflow: 'visible',
                  animation: 'chartFadeIn 0.35s ease-out',
                }}
              >
                <defs>
                  <linearGradient id="engHsSurveyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="engHsWorkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines & Labels */}
                {[
                  { val: '6', y: 22 },
                  { val: '4', y: 56 },
                  { val: '2', y: 90 },
                  { val: '0', y: 124 },
                ].map((grid) => (
                  <g key={grid.val}>
                    <text
                      x="18"
                      y={grid.y + 4}
                      fontSize="10"
                      fontWeight="500"
                      fill="#94A3B8"
                      textAnchor="end"
                    >
                      {grid.val}
                    </text>
                    <line
                      x1="28"
                      y1={grid.y}
                      x2="330"
                      y2={grid.y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Work Area Under Line (Green) */}
                <path
                  d="M 55,73 L 135,73 L 215,56 L 295,90 L 295,124 L 55,124 Z"
                  fill="url(#engHsWorkGrad)"
                  style={{ animation: 'areaFadeIn 0.4s ease-out' }}
                />

                {/* Work Connecting Line (Green) */}
                <path
                  d="M 55,73 L 135,73 L 215,56 L 295,90"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Survey Area Under Line (Blue) */}
                <path
                  d="M 55,107 L 135,90 L 215,107 L 295,90 L 295,124 L 55,124 Z"
                  fill="url(#engHsSurveyGrad)"
                  style={{ animation: 'areaFadeIn 0.4s ease-out' }}
                />

                {/* Survey Connecting Line (Blue) */}
                <path
                  d="M 55,107 L 135,90 L 215,107 L 295,90"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points & Values for Work (Green) */}
                {[
                  { x: 55, y: 73, val: '3' },
                  { x: 135, y: 73, val: '3' },
                  { x: 215, y: 56, val: '4' },
                  { x: 295, y: 90, val: '2' },
                ].map((pt, i) => (
                  <g key={`hs-work-${i}`}>
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      fontSize="11"
                      fontWeight="700"
                      fill="#15803D"
                      textAnchor="middle"
                    >
                      {pt.val}
                    </text>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#16A34A"
                      strokeWidth="2.5"
                    />
                  </g>
                ))}

                {/* Data Points & Values for Survey (Blue) */}
                {[
                  { x: 55, y: 107, val: '1' },
                  { x: 135, y: 90, val: '2' },
                  { x: 215, y: 107, val: '1' },
                  { x: 295, y: 90, val: '2' },
                ].map((pt, i) => (
                  <g key={`hs-survey-${i}`}>
                    <text
                      x={pt.x}
                      y={pt.y + 15}
                      fontSize="11"
                      fontWeight="700"
                      fill="#1D4ED8"
                      textAnchor="middle"
                    >
                      {pt.val}
                    </text>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                    />
                  </g>
                ))}

                {/* X-Axis Labels */}
                {[
                  { x: 55, label: language === 'id' ? 'Mg 1' : 'W1' },
                  { x: 135, label: language === 'id' ? 'Mg 2' : 'W2' },
                  { x: 215, label: language === 'id' ? 'Mg 3' : 'W3' },
                  { x: 295, label: language === 'id' ? 'Mg 4' : 'W4' },
                ].map((axis, i) => (
                  <text
                    key={`hs-axis-${i}`}
                    x={axis.x}
                    y="142"
                    fontSize="10"
                    fontWeight="600"
                    fill="#64748B"
                    textAnchor="middle"
                  >
                    {axis.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Customer Satisfaction & Review Summary - Rich Fill Card */}
          <div
            onClick={() => handleViewDetails('Home Service')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
              borderRadius: '12px',
              padding: '10px 14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(180, 83, 9, 0.18)',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              gap: '12px',
            }}
          >
            {/* Background Glow Effect */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Left: Star Icon + Score & Stars + Subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Star size={18} weight="fill" color="#FEF08A" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.3px' }}>
                    4.9
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={11} weight="fill" color="#FDE047" />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#FEF3C7', lineHeight: 1 }}>
                  {language === 'id' ? 'Rating Kepuasan Tenant' : 'Tenant Satisfaction'}
                </span>
              </div>
            </div>

            {/* Right: Satisfaction % & Review Count */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', zIndex: 1 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                98% {language === 'id' ? 'Puas' : 'Satisfied'}
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#FEF3C7', lineHeight: 1 }}>
                12 {language === 'id' ? 'Ulasan' : 'Reviews'}
              </span>
            </div>
          </div>

          {/* View All Home Services Button */}
          <button
            type="button"
            onClick={() => handleViewDetails('Home Service')}
            style={{
              width: '100%',
              height: '38px',
              backgroundColor: '#FFFFFF',
              color: '#02388A',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '2px',
            }}
          >
            {language === 'id' ? 'Lihat Semua Home Service' : 'View All Home Services'}
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Home Service Month Picker Bottom Sheet Modal */}
      {isHsMonthPickerOpen && (() => {
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsHsMonthPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Pilih Periode Home Service' : 'Select Home Service Period'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {language === 'id' ? 'Pilih bulan dan tahun' : 'Choose month and year'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHsMonthPickerOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setHsPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {hsPickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setHsPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12 Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {(language === 'id' ? WO_MONTHS_ID : WO_MONTHS_EN).map((mName, idx) => {
                  const isSelected = hsPickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setHsPickerTempMonth(idx)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#02388A' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => {
                  setHsSelectedMonth(hsPickerTempMonth);
                  setHsSelectedYear(hsPickerTempYear);
                  setIsHsMonthPickerOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                  boxShadow: 'none',
                }}
              >
                {language === 'id' ? 'Terapkan' : 'Apply'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}


      {/* =========================================================================
          SECTION 4: Jadwal Inspeksi Rutin (Bulanan & Tren Mingguan)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.eng.inspectionTitle')}
          </h2>
          <button
            type="button"
            onClick={() => {
              setInspPickerTempMonth(inspSelectedMonth);
              setInspPickerTempYear(inspSelectedYear);
              setIsInspMonthPickerOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{currentInspMonthName} {inspSelectedYear}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          {/* 3 Activity Performance Metrics (Summary Badges) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            {/* 1. Total Jadwal Inspeksi */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '8px 4px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                24
              </div>
              <div style={{ fontSize: '0.625rem', color: '#334155', fontWeight: 700, lineHeight: 1.2 }}>
                <div>Total</div>
                <div>{language === 'id' ? 'Jadwal' : 'Schedules'}</div>
              </div>
            </div>

            {/* 2. Selesai / Completed (Hijau) */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: '12px',
                padding: '8px 4px',
                border: '1px solid #DCFCE7',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803D', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                20
              </div>
              <div style={{ fontSize: '0.625rem', color: '#166534', fontWeight: 700, lineHeight: 1.2 }}>
                <div>{language === 'id' ? 'Inspeksi' : 'Inspections'}</div>
                <div>{language === 'id' ? 'Selesai' : 'Completed'}</div>
              </div>
            </div>

            {/* 3. Belum Dikerjakan / Pending (Orange) */}
            <div
              style={{
                backgroundColor: '#FFF7ED',
                borderRadius: '12px',
                padding: '8px 4px',
                border: '1px solid #FFEDD5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#C2410C', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                4
              </div>
              <div style={{ fontSize: '0.625rem', color: '#9A3412', fontWeight: 700, lineHeight: 1.2 }}>
                <div>{language === 'id' ? 'Inspeksi' : 'Inspections'}</div>
                <div>{language === 'id' ? 'Pending' : 'Pending'}</div>
              </div>
            </div>
          </div>

          {/* Dynamic Grouped Bar Chart for Weekly Inspections (Green Selesai vs Orange Pending) */}
          <div style={{ marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                {language === 'id' ? 'Tren Inspeksi Mingguan' : 'Weekly Inspection Trend'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.6875rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803D' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                  <span>{language === 'id' ? 'Selesai' : 'Completed'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#C2410C' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#F97316', borderRadius: '2px' }} />
                  <span>{language === 'id' ? 'Pending' : 'Pending'}</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', position: 'relative' }}>
              <svg
                viewBox="0 0 340 160"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  overflow: 'visible',
                  animation: 'chartFadeIn 0.35s ease-out',
                }}
              >
                {/* Y-Axis Grid Lines & Labels */}
                {[
                  { val: '8', y: 24 },
                  { val: '6', y: 49 },
                  { val: '4', y: 74 },
                  { val: '2', y: 99 },
                  { val: '0', y: 124 },
                ].map((grid) => (
                  <g key={grid.val}>
                    <text
                      x="18"
                      y={grid.y + 4}
                      fontSize="10"
                      fontWeight="500"
                      fill="#94A3B8"
                      textAnchor="end"
                    >
                      {grid.val}
                    </text>
                    <line
                      x1="28"
                      y1={grid.y}
                      x2="330"
                      y2={grid.y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Grouped Bars per Week */}
                {[
                  {
                    week: language === 'id' ? 'Mg 1' : 'W1',
                    centerX: 70,
                    complete: { val: 5, x: 54, y: 61.5, height: 62.5 },
                    pending: { val: 0, x: 72, y: 124, height: 0 },
                  },
                  {
                    week: language === 'id' ? 'Mg 2' : 'W2',
                    centerX: 140,
                    complete: { val: 6, x: 124, y: 49, height: 75 },
                    pending: { val: 1, x: 142, y: 111.5, height: 12.5 },
                  },
                  {
                    week: language === 'id' ? 'Mg 3' : 'W3',
                    centerX: 210,
                    complete: { val: 5, x: 194, y: 61.5, height: 62.5 },
                    pending: { val: 1, x: 212, y: 111.5, height: 12.5 },
                  },
                  {
                    week: language === 'id' ? 'Mg 4' : 'W4',
                    centerX: 280,
                    complete: { val: 4, x: 264, y: 74, height: 50 },
                    pending: { val: 2, x: 282, y: 99, height: 25 },
                  },
                ].map((item, idx) => (
                  <g key={item.week}>
                    {/* Complete Bar (Green) */}
                    {item.complete.height > 0 && (
                      <rect
                        x={item.complete.x}
                        y={item.complete.y}
                        width="14"
                        height={item.complete.height}
                        rx="3"
                        ry="3"
                        fill="#16A34A"
                        className="animate-bar-grow"
                        style={{ animationDelay: `${0.05 + idx * 0.05}s` }}
                      />
                    )}
                    <text
                      x={item.complete.x + 7}
                      y={item.complete.y - 4}
                      fontSize="10"
                      fontWeight="700"
                      fill="#15803D"
                      textAnchor="middle"
                    >
                      {item.complete.val}
                    </text>

                    {/* Pending Bar (Orange) */}
                    {item.pending.height > 0 ? (
                      <rect
                        x={item.pending.x}
                        y={item.pending.y}
                        width="14"
                        height={item.pending.height}
                        rx="3"
                        ry="3"
                        fill="#F97316"
                        className="animate-bar-grow"
                        style={{ animationDelay: `${0.08 + idx * 0.05}s` }}
                      />
                    ) : (
                      <rect
                        x={item.pending.x}
                        y={122}
                        width="14"
                        height="2"
                        rx="1"
                        ry="1"
                        fill="#FED7AA"
                      />
                    )}
                    <text
                      x={item.pending.x + 7}
                      y={item.pending.val === 0 ? 116 : item.pending.y - 4}
                      fontSize="10"
                      fontWeight="700"
                      fill="#C2410C"
                      textAnchor="middle"
                    >
                      {item.pending.val}
                    </text>

                    {/* X-Axis Label */}
                    <text
                      x={item.centerX}
                      y="144"
                      fontSize="11"
                      fontWeight="600"
                      fill="#64748B"
                      textAnchor="middle"
                    >
                      {item.week}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* 2 Categorical Breakdown Cards (Complete - Green vs Pending - Orange) with Asset, Floor, Room */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {/* Card 1: Selesai / Complete (Hijau Solid Fill) */}
            <div
              style={{
                backgroundColor: '#16A34A',
                borderRadius: '14px',
                padding: '12px 12px',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.18)',
              }}
            >
              {/* Header Selesai */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={16} weight="fill" color="#FFFFFF" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {t('overview.eng.inspectedDone')}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  20
                </span>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.22)' }} />

              {/* Breakdown List: Asset, Floor, Room */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Wrench size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catAsset')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    8
                  </span>
                </div>

                {/* Floor */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Buildings size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catFloor')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    7
                  </span>
                </div>

                {/* Room */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Door size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catRoom')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    5
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Belum Dikerjakan / Pending (Orange Solid Fill) */}
            <div
              style={{
                backgroundColor: '#F97316',
                borderRadius: '14px',
                padding: '12px 12px',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.18)',
              }}
            >
              {/* Header Pending */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={16} weight="fill" color="#FFFFFF" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {t('overview.eng.inspectedPending')}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  4
                </span>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.22)' }} />

              {/* Breakdown List: Asset, Floor, Room */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Wrench size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catAsset')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    1
                  </span>
                </div>

                {/* Floor */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Buildings size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catFloor')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    2
                  </span>
                </div>

                {/* Room */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Door size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catRoom')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <button
            type="button"
            onClick={() => alert('Opening all inspection schedules')}
            style={{
              width: '100%',
              height: '38px',
              backgroundColor: '#FFFFFF',
              color: '#02388A',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '2px',
            }}
          >
            {t('overview.eng.viewAllInspections')}
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Inspection Month Picker Modal */}
      {isInspMonthPickerOpen && (() => {
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsInspMonthPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Pilih Periode Inspeksi' : 'Select Inspection Period'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {language === 'id' ? 'Pilih bulan dan tahun' : 'Choose month and year'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInspMonthPickerOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setInspPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {inspPickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setInspPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12 Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {(language === 'id' ? WO_MONTHS_ID : WO_MONTHS_EN).map((mName, idx) => {
                  const isSelected = inspPickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setInspPickerTempMonth(idx)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#02388A' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => {
                  setInspSelectedMonth(inspPickerTempMonth);
                  setInspSelectedYear(inspPickerTempYear);
                  setIsInspMonthPickerOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                {language === 'id' ? 'Terapkan Periode' : 'Apply Period'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          SECTION 5: Progres Scan Meter Utilitas (Utility Meter Scanning Progress - Matches BM)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Section Header OUTSIDE Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {t('overview.eng.meterTitle')}
          </h2>

          {/* Month Selector Pill */}
          <button
            type="button"
            onClick={() => {
              setMeterPickerTempMonth(meterSelectedMonth);
              setMeterPickerTempYear(meterSelectedYear);
              setIsMeterMonthPickerOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{`${currentMeterMonthName} ${meterSelectedYear}`}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Card 1: Water Meter */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'none',
          }}
        >
          {/* Top Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Drop size={18} weight="fill" color="#09B2FF" />
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}>
                {t('overview.waterMeter')}
              </span>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#053079' }}>
              {t('overview.scanned', { count: 824, total: 952 })}
            </span>
          </div>

          {/* Progress Bar (86.5% scanned) */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#F1F5F9',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '86.5%',
                height: '100%',
                backgroundColor: '#09B2FF',
                borderRadius: '9999px',
                transition: 'width 0.4s ease-out',
              }}
            />
          </div>

          {/* Bottom Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>
              {t('overview.notRecordedYet', { count: 128 })}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#10B981' }}>
              86.5%
            </span>
          </div>
        </div>

        {/* Card 2: Electric Meter */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'none',
          }}
        >
          {/* Top Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightning size={18} weight="fill" color="#EAB308" />
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}>
                {t('overview.electricMeter')}
              </span>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#053079' }}>
              {t('overview.scanned', { count: 946, total: '1.080' })}
            </span>
          </div>

          {/* Progress Bar (87.6% scanned) */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#F1F5F9',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '87.6%',
                height: '100%',
                backgroundColor: '#EAB308',
                borderRadius: '9999px',
                transition: 'width 0.4s ease-out',
              }}
            />
          </div>

          {/* Bottom Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>
              {t('overview.notRecordedYet', { count: 134 })}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#10B981' }}>
              87.6%
            </span>
          </div>
        </div>

        {/* Show Unrecorded Utility Button */}
        <button
          type="button"
          onClick={() => setIsUnrecordedModalOpen(true)}
          style={{
            width: '100%',
            height: '38px',
            backgroundColor: '#FFFFFF',
            color: '#02388A',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '2px',
          }}
        >
          {t('overview.eng.showUnrecordedUtility')}
          <CaretRight size={14} weight="bold" />
        </button>
      </div>

      {/* Unrecorded Utility Bottom Sheet Modal */}
      {isUnrecordedModalOpen && (() => {
        const modalTarget = typeof document !== 'undefined'
          ? document.getElementById('phone-screen-container') || document.querySelector('.android-device-screen') || document.body
          : null;

        const filteredUnits = SAMPLE_UNRECORDED_UNITS.filter((item) => {
          const matchTab = unrecordedFilterTab === 'ALL'
            ? true
            : unrecordedFilterTab === 'WATER'
            ? item.type === 'water'
            : item.type === 'electric';
          const matchQuery = unrecordedSearchQuery.trim() === ''
            ? true
            : item.unit.toLowerCase().includes(unrecordedSearchQuery.toLowerCase()) ||
              item.floor.toLowerCase().includes(unrecordedSearchQuery.toLowerCase()) ||
              item.meterNo.toLowerCase().includes(unrecordedSearchQuery.toLowerCase());
          return matchTab && matchQuery;
        });

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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsUnrecordedModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Utilitas Belum Dicatat' : 'Unrecorded Utility'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {`${currentMeterMonthName} ${meterSelectedYear} • 262 ${language === 'id' ? 'Unit Belum Dicatat' : 'Pending Units'}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUnrecordedModalOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#F1F5F9',
                  padding: '4px',
                  borderRadius: '10px',
                  gap: '4px',
                }}
              >
                {[
                  { key: 'ALL', label: language === 'id' ? 'Semua (262)' : 'All (262)' },
                  { key: 'WATER', label: language === 'id' ? 'Air (128)' : 'Water (128)' },
                  { key: 'ELECTRIC', label: language === 'id' ? 'Listrik (134)' : 'Electric (134)' },
                ].map((tab) => {
                  const isActive = unrecordedFilterTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setUnrecordedFilterTab(tab.key)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                        color: isActive ? '#053079' : '#64748B',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  padding: '8px 12px',
                  gap: '8px',
                }}
              >
                <MagnifyingGlass size={16} color="#94A3B8" weight="bold" />
                <input
                  type="text"
                  value={unrecordedSearchQuery}
                  onChange={(e) => setUnrecordedSearchQuery(e.target.value)}
                  placeholder={language === 'id' ? 'Cari unit, lantai, no. meter...' : 'Search unit, floor, meter no...'}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.8125rem',
                    color: '#1E293B',
                    width: '100%',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                {unrecordedSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setUnrecordedSearchQuery('')}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                    }}
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </div>

              {/* Unit List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  paddingRight: '2px',
                }}
              >
                {filteredUnits.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.8125rem' }}>
                    {language === 'id' ? 'Tidak ada unit ditemukan' : 'No units found'}
                  </div>
                ) : (
                  filteredUnits.map((item) => {
                    const isWater = item.type === 'water';
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: isWater ? '#E0F2FE' : '#FEF9C3',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {isWater ? (
                              <Drop size={18} weight="fill" color="#09B2FF" />
                            ) : (
                              <Lightning size={18} weight="fill" color="#EAB308" />
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>
                              {item.unit}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                              {item.floor} • No: {item.meterNo}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                            }}
                          >
                            {language === 'id' ? 'Belum Dicatat' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsUnrecordedModalOpen(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                {language === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* Utility Meter Month Picker Bottom Sheet Modal */}
      {isMeterMonthPickerOpen && (() => {
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsMeterMonthPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Pilih Periode Scan Meter' : 'Select Meter Scanning Period'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {language === 'id' ? 'Pilih bulan dan tahun' : 'Choose month and year'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMeterMonthPickerOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMeterPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {meterPickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setMeterPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12 Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {(language === 'id' ? WO_MONTHS_ID : WO_MONTHS_EN).map((mName, idx) => {
                  const isSelected = meterPickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setMeterPickerTempMonth(idx)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#02388A' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => {
                  setMeterSelectedMonth(meterPickerTempMonth);
                  setMeterSelectedYear(meterPickerTempYear);
                  setIsMeterMonthPickerOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                  boxShadow: 'none',
                }}
              >
                {language === 'id' ? 'Terapkan' : 'Apply'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}
    </div>
  );
};

/**
 * Housekeeping Specific Overview Sub-Component
 */
const HousekeepingOverviewContent = ({ t, onNavigateDetails }) => {
  const { language } = useLanguage();
  const [clockedIn, setClockedIn] = useState(true);
  const [isYearlyModalOpen, setIsYearlyModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isHsMonthPickerOpen, setIsHsMonthPickerOpen] = useState(false);
  const [hsSelectedMonth, setHsSelectedMonth] = useState(8); // 8 = September
  const [hsSelectedYear, setHsSelectedYear] = useState(2026);
  const [hsPickerTempMonth, setHsPickerTempMonth] = useState(8);
  const [hsPickerTempYear, setHsPickerTempYear] = useState(2026);

  const [isInspMonthPickerOpen, setIsInspMonthPickerOpen] = useState(false);
  const [inspSelectedMonth, setInspSelectedMonth] = useState(8); // 8 = September
  const [inspSelectedYear, setInspSelectedYear] = useState(2026);
  const [inspPickerTempMonth, setInspPickerTempMonth] = useState(8);
  const [inspPickerTempYear, setInspPickerTempYear] = useState(2026);

  const HS_MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const HS_MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const currentHsMonthName = language === 'id' ? HS_MONTHS_ID[hsSelectedMonth] : HS_MONTHS_EN[hsSelectedMonth];
  const currentInspMonthName = language === 'id' ? HS_MONTHS_ID[inspSelectedMonth] : HS_MONTHS_EN[inspSelectedMonth];

  const handleViewDetails = (section) => {
    if (onNavigateDetails) {
      onNavigateDetails(section);
    } else {
      alert(t('overview.detailsAlert', { section }));
    }
  };

  const currentYearData = YEARLY_ATTENDANCE_DATA[selectedYear] || YEARLY_ATTENDANCE_DATA[2026];

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
          SECTION 1: Shift Hari Ini (Today Shift)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.eng.todayShift')}
          </h2>
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
            }}
          >
            {t('overview.eng.onTime')}
          </span>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
            Morning Shift • 07:00 - 16:00 WIB
          </div>

          {/* 2 Side-by-Side Clock Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '10px 12px',
                border: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                {t('overview.eng.clockIn')}
              </span>
              <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.3px' }}>
                06:55 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#64748B' }}>WIB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <SealCheck size={14} weight="fill" color="#16A34A" />
                <span style={{ fontSize: '0.6875rem', color: '#16A34A', fontWeight: 600 }}>
                  {t('overview.eng.recorded')}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '10px 12px',
                border: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                {t('overview.eng.clockOut')}
              </span>
              <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: !clockedIn ? '#1E293B' : '#94A3B8', letterSpacing: '-0.3px' }}>
                {!clockedIn ? (
                  <>16:05 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#64748B' }}>WIB</span></>
                ) : (
                  '-- : --'
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                {!clockedIn ? (
                  <>
                    <SealCheck size={14} weight="fill" color="#16A34A" />
                    <span style={{ fontSize: '0.6875rem', color: '#16A34A', fontWeight: 600 }}>
                      {t('overview.eng.recorded')}
                    </span>
                  </>
                ) : (
                  <>
                    <HourglassMedium size={14} weight="fill" color="#94A3B8" />
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>
                      {t('overview.eng.notRecorded')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: Rekap Presensi Bulanan (Monthly Attendance)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.eng.monthlyAttendanceTitle')}
          </h2>

          <button
            type="button"
            onClick={() => handleViewDetails('Employee attendance')}
            style={{
              background: 'none',
              border: 'none',
              color: '#02388A',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span>{t('overview.viewDetails')}</span>
            <CaretRight size={14} weight="bold" />
          </button>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            {language === 'id' ? 'Bulan Ini (September 2026)' : 'This Month (September 2026)'}
          </div>

          {/* Hero Fill Attendance Rate Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #02388A 0%, #0052CC 60%, #0284C7 100%)',
              borderRadius: '14px',
              padding: '13px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle background glow effect */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(2, 56, 138, 0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarBlank size={18} weight="fill" color="#38BDF8" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.1px' }}>
                  {t('overview.eng.attendancePct')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  23/24 {language === 'id' ? 'Hari' : 'Days'}
                </span>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1,
                    letterSpacing: '-0.5px',
                  }}
                >
                  96%
                </span>
              </div>
            </div>

            {/* Glowing White Progress Bar on Semi-transparent Track */}
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '96%',
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                }}
              />
            </div>
          </div>

          {/* 4 KPI Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1 }}>22</span>
              <span style={{ fontSize: '0.6875rem', color: '#15803D', fontWeight: 600 }}>{t('overview.eng.onTime')}</span>
            </div>
            <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>1</span>
              <span style={{ fontSize: '0.6875rem', color: '#B45309', fontWeight: 600 }}>{t('overview.eng.late')}</span>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#475569', lineHeight: 1.1 }}>1</span>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>{t('overview.eng.leaveDays')}</span>
            </div>
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>0</span>
              <span style={{ fontSize: '0.6875rem', color: '#991B1B', fontWeight: 600 }}>{t('overview.eng.alpha')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: Home Service / Tugas Housekeeping
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.hk.hsTitle')}
          </h2>
          <button
            type="button"
            onClick={() => {
              setHsPickerTempMonth(hsSelectedMonth);
              setHsPickerTempYear(hsSelectedYear);
              setIsHsMonthPickerOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{currentHsMonthName} {hsSelectedYear}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          {/* Donut Chart Breakdown for Home Service */}
          <div
            onClick={() => handleViewDetails('Home Service')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '4px 0',
            }}
          >
            {/* Left Donut SVG with Center Label */}
            <div
              style={{
                position: 'relative',
                width: '110px',
                height: '110px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="110"
                height="110"
                viewBox="0 0 120 120"
                style={{
                  transform: 'rotate(-90deg)',
                  overflow: 'visible',
                }}
              >
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                />
                {/* Works Executed Segment (66.7% - Green #16A34A) */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="12"
                  strokeDasharray={`${(12 / 18) * 289.03} 289.03`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Surveys Conducted Segment (33.3% - Blue #2563EB) */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="12"
                  strokeDasharray={`${(6 / 18) * 289.03} 289.03`}
                  strokeDashoffset={-((12 / 18) * 289.03)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Text */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1,
                    letterSpacing: '-0.3px',
                  }}
                >
                  18
                </span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#64748B',
                    marginTop: '2px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  Total
                </span>
              </div>
            </div>

            {/* Right Breakdown Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Works / Layanan Item */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                      {language === 'id' ? 'Layanan yang Dilakukan' : 'Services Executed'}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                      66.7% {language === 'id' ? 'dari total' : 'of total'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#15803D' }}>
                  12
                </span>
              </div>

              <div style={{ height: '1px', backgroundColor: '#E2E8F0', width: '100%' }} />

              {/* Surveys Item */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                      {language === 'id' ? 'Survey yang Dilakukan' : 'Surveys Conducted'}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                      33.3% {language === 'id' ? 'dari total' : 'of total'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1D4ED8' }}>
                  6
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

          {/* Weekly Activity Trend (Survey vs Layanan / Works) */}
          <div
            onClick={() => handleViewDetails('Home Service')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                {language === 'id' ? 'Tren Aktivitas Mingguan' : 'Weekly Activity Trend'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.6875rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1D4ED8' }}>
                  <span style={{ width: '10px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px' }} />
                  <span>Survey</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803D' }}>
                  <span style={{ width: '10px', height: '3px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                  <span>{language === 'id' ? 'Layanan' : 'Services'}</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', position: 'relative' }}>
              <svg
                viewBox="0 0 340 160"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  overflow: 'visible',
                  animation: 'chartFadeIn 0.35s ease-out',
                }}
              >
                <defs>
                  <linearGradient id="hkHsSurveyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="hkHsWorkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines & Labels */}
                {[
                  { val: '6', y: 22 },
                  { val: '4', y: 56 },
                  { val: '2', y: 90 },
                  { val: '0', y: 124 },
                ].map((grid) => (
                  <g key={grid.val}>
                    <text
                      x="18"
                      y={grid.y + 4}
                      fontSize="10"
                      fontWeight="500"
                      fill="#94A3B8"
                      textAnchor="end"
                    >
                      {grid.val}
                    </text>
                    <line
                      x1="28"
                      y1={grid.y}
                      x2="330"
                      y2={grid.y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Work Area Under Line (Green) */}
                <path
                  d="M 55,73 L 135,73 L 215,56 L 295,90 L 295,124 L 55,124 Z"
                  fill="url(#hkHsWorkGrad)"
                  style={{ animation: 'areaFadeIn 0.4s ease-out' }}
                />

                {/* Work Connecting Line (Green) */}
                <path
                  d="M 55,73 L 135,73 L 215,56 L 295,90"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Survey Area Under Line (Blue) */}
                <path
                  d="M 55,107 L 135,90 L 215,107 L 295,90 L 295,124 L 55,124 Z"
                  fill="url(#hkHsSurveyGrad)"
                  style={{ animation: 'areaFadeIn 0.4s ease-out' }}
                />

                {/* Survey Connecting Line (Blue) */}
                <path
                  d="M 55,107 L 135,90 L 215,107 L 295,90"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points & Values for Work (Green) */}
                {[
                  { x: 55, y: 73, val: '3' },
                  { x: 135, y: 73, val: '3' },
                  { x: 215, y: 56, val: '4' },
                  { x: 295, y: 90, val: '2' },
                ].map((pt, i) => (
                  <g key={`hk-hs-work-${i}`}>
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      fontSize="11"
                      fontWeight="700"
                      fill="#15803D"
                      textAnchor="middle"
                    >
                      {pt.val}
                    </text>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#16A34A"
                      strokeWidth="2.5"
                    />
                  </g>
                ))}

                {/* Data Points & Values for Survey (Blue) */}
                {[
                  { x: 55, y: 107, val: '1' },
                  { x: 135, y: 90, val: '2' },
                  { x: 215, y: 107, val: '1' },
                  { x: 295, y: 90, val: '2' },
                ].map((pt, i) => (
                  <g key={`hk-hs-survey-${i}`}>
                    <text
                      x={pt.x}
                      y={pt.y + 15}
                      fontSize="11"
                      fontWeight="700"
                      fill="#1D4ED8"
                      textAnchor="middle"
                    >
                      {pt.val}
                    </text>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                    />
                  </g>
                ))}

                {/* X-Axis Labels */}
                {[
                  { x: 55, label: language === 'id' ? 'Mg 1' : 'W1' },
                  { x: 135, label: language === 'id' ? 'Mg 2' : 'W2' },
                  { x: 215, label: language === 'id' ? 'Mg 3' : 'W3' },
                  { x: 295, label: language === 'id' ? 'Mg 4' : 'W4' },
                ].map((axis, i) => (
                  <text
                    key={`hk-hs-axis-${i}`}
                    x={axis.x}
                    y="142"
                    fontSize="10"
                    fontWeight="600"
                    fill="#64748B"
                    textAnchor="middle"
                  >
                    {axis.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Customer Satisfaction & Review Summary - Rich Fill Card */}
          <div
            onClick={() => handleViewDetails('Home Service')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
              borderRadius: '12px',
              padding: '10px 14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(180, 83, 9, 0.18)',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              gap: '12px',
            }}
          >
            {/* Background Glow Effect */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Left: Star Icon + Score & Stars + Subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Star size={18} weight="fill" color="#FEF08A" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.3px' }}>
                    4.9
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={11} weight="fill" color="#FDE047" />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#FEF3C7', lineHeight: 1 }}>
                  {language === 'id' ? 'Rating Kepuasan Tenant' : 'Tenant Satisfaction'}
                </span>
              </div>
            </div>

            {/* Right: Satisfaction % & Review Count */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', zIndex: 1 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                98% {language === 'id' ? 'Puas' : 'Satisfied'}
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#FEF3C7', lineHeight: 1 }}>
                12 {language === 'id' ? 'Ulasan' : 'Reviews'}
              </span>
            </div>
          </div>

          {/* View All Home Services Button */}
          <button
            type="button"
            onClick={() => handleViewDetails('Home Service')}
            style={{
              width: '100%',
              height: '38px',
              backgroundColor: '#FFFFFF',
              color: '#02388A',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '2px',
            }}
          >
            {t('overview.hk.viewAllHs')}
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Home Service Month Picker Bottom Sheet Modal */}
      {isHsMonthPickerOpen && (() => {
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsHsMonthPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Pilih Periode Home Service' : 'Select Home Service Period'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {language === 'id' ? 'Pilih bulan dan tahun' : 'Choose month and year'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHsMonthPickerOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setHsPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {hsPickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setHsPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12 Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {(language === 'id' ? HS_MONTHS_ID : HS_MONTHS_EN).map((mName, idx) => {
                  const isSelected = hsPickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setHsPickerTempMonth(idx)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#02388A' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => {
                  setHsSelectedMonth(hsPickerTempMonth);
                  setHsSelectedYear(hsPickerTempYear);
                  setIsHsMonthPickerOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                {language === 'id' ? 'Terapkan Periode' : 'Apply Period'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          SECTION 4: Jadwal Inspeksi Kebersihan (Bulanan & Tren Mingguan)
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.hk.inspectionTitle')}
          </h2>
          <button
            type="button"
            onClick={() => {
              setInspPickerTempMonth(inspSelectedMonth);
              setInspPickerTempYear(inspSelectedYear);
              setIsInspMonthPickerOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{currentInspMonthName} {inspSelectedYear}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          {/* 3 Activity Performance Metrics (Summary Badges) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            {/* 1. Total Jadwal Inspeksi */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '8px 4px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                24
              </div>
              <div style={{ fontSize: '0.625rem', color: '#334155', fontWeight: 700, lineHeight: 1.2 }}>
                <div>Total</div>
                <div>{language === 'id' ? 'Jadwal' : 'Schedules'}</div>
              </div>
            </div>

            {/* 2. Selesai / Completed (Hijau) */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: '12px',
                padding: '8px 4px',
                border: '1px solid #DCFCE7',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803D', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                20
              </div>
              <div style={{ fontSize: '0.625rem', color: '#166534', fontWeight: 700, lineHeight: 1.2 }}>
                <div>{language === 'id' ? 'Inspeksi' : 'Inspections'}</div>
                <div>{language === 'id' ? 'Selesai' : 'Completed'}</div>
              </div>
            </div>

            {/* 3. Belum Dikerjakan / Pending (Orange) */}
            <div
              style={{
                backgroundColor: '#FFF7ED',
                borderRadius: '12px',
                padding: '8px 4px',
                border: '1px solid #FFEDD5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#C2410C', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                4
              </div>
              <div style={{ fontSize: '0.625rem', color: '#9A3412', fontWeight: 700, lineHeight: 1.2 }}>
                <div>{language === 'id' ? 'Inspeksi' : 'Inspections'}</div>
                <div>{language === 'id' ? 'Pending' : 'Pending'}</div>
              </div>
            </div>
          </div>

          {/* Dynamic Grouped Bar Chart for Weekly Inspections (Green Selesai vs Orange Pending) */}
          <div style={{ marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                {language === 'id' ? 'Tren Inspeksi Mingguan' : 'Weekly Inspection Trend'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.6875rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803D' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                  <span>{language === 'id' ? 'Selesai' : 'Completed'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#C2410C' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#F97316', borderRadius: '2px' }} />
                  <span>{language === 'id' ? 'Pending' : 'Pending'}</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', position: 'relative' }}>
              <svg
                viewBox="0 0 340 160"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  overflow: 'visible',
                  animation: 'chartFadeIn 0.35s ease-out',
                }}
              >
                {/* Y-Axis Grid Lines & Labels */}
                {[
                  { val: '8', y: 24 },
                  { val: '6', y: 49 },
                  { val: '4', y: 74 },
                  { val: '2', y: 99 },
                  { val: '0', y: 124 },
                ].map((grid) => (
                  <g key={grid.val}>
                    <text
                      x="18"
                      y={grid.y + 4}
                      fontSize="10"
                      fontWeight="500"
                      fill="#94A3B8"
                      textAnchor="end"
                    >
                      {grid.val}
                    </text>
                    <line
                      x1="28"
                      y1={grid.y}
                      x2="330"
                      y2={grid.y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Grouped Bars per Week */}
                {[
                  {
                    week: language === 'id' ? 'Mg 1' : 'W1',
                    centerX: 70,
                    complete: { val: 5, x: 54, y: 61.5, height: 62.5 },
                    pending: { val: 0, x: 72, y: 124, height: 0 },
                  },
                  {
                    week: language === 'id' ? 'Mg 2' : 'W2',
                    centerX: 140,
                    complete: { val: 6, x: 124, y: 49, height: 75 },
                    pending: { val: 1, x: 142, y: 111.5, height: 12.5 },
                  },
                  {
                    week: language === 'id' ? 'Mg 3' : 'W3',
                    centerX: 210,
                    complete: { val: 5, x: 194, y: 61.5, height: 62.5 },
                    pending: { val: 1, x: 212, y: 111.5, height: 12.5 },
                  },
                  {
                    week: language === 'id' ? 'Mg 4' : 'W4',
                    centerX: 280,
                    complete: { val: 4, x: 264, y: 74, height: 50 },
                    pending: { val: 2, x: 282, y: 99, height: 25 },
                  },
                ].map((item, idx) => (
                  <g key={item.week}>
                    {/* Complete Bar (Green) */}
                    {item.complete.height > 0 && (
                      <rect
                        x={item.complete.x}
                        y={item.complete.y}
                        width="14"
                        height={item.complete.height}
                        rx="3"
                        ry="3"
                        fill="#16A34A"
                        className="animate-bar-grow"
                        style={{ animationDelay: `${0.05 + idx * 0.05}s` }}
                      />
                    )}
                    <text
                      x={item.complete.x + 7}
                      y={item.complete.y - 4}
                      fontSize="10"
                      fontWeight="700"
                      fill="#15803D"
                      textAnchor="middle"
                    >
                      {item.complete.val}
                    </text>

                    {/* Pending Bar (Orange) */}
                    {item.pending.height > 0 ? (
                      <rect
                        x={item.pending.x}
                        y={item.pending.y}
                        width="14"
                        height={item.pending.height}
                        rx="3"
                        ry="3"
                        fill="#F97316"
                        className="animate-bar-grow"
                        style={{ animationDelay: `${0.08 + idx * 0.05}s` }}
                      />
                    ) : (
                      <rect
                        x={item.pending.x}
                        y={122}
                        width="14"
                        height="2"
                        rx="1"
                        ry="1"
                        fill="#FED7AA"
                      />
                    )}
                    <text
                      x={item.pending.x + 7}
                      y={item.pending.val === 0 ? 116 : item.pending.y - 4}
                      fontSize="10"
                      fontWeight="700"
                      fill="#C2410C"
                      textAnchor="middle"
                    >
                      {item.pending.val}
                    </text>

                    {/* X-Axis Label */}
                    <text
                      x={item.centerX}
                      y="144"
                      fontSize="11"
                      fontWeight="600"
                      fill="#64748B"
                      textAnchor="middle"
                    >
                      {item.week}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* 2 Categorical Breakdown Cards (Complete - Green vs Pending - Orange) with Asset, Floor, Room */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {/* Card 1: Selesai / Complete (Hijau Solid Fill) */}
            <div
              style={{
                backgroundColor: '#16A34A',
                borderRadius: '14px',
                padding: '12px 12px',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.18)',
              }}
            >
              {/* Header Selesai */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={16} weight="fill" color="#FFFFFF" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {t('overview.eng.inspectedDone')}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  20
                </span>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.22)' }} />

              {/* Breakdown List: Asset, Floor, Room */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Wrench size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catAsset')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    8
                  </span>
                </div>

                {/* Floor */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Buildings size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catFloor')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    7
                  </span>
                </div>

                {/* Room */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Door size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catRoom')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    5
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Belum Dikerjakan / Pending (Orange Solid Fill) */}
            <div
              style={{
                backgroundColor: '#F97316',
                borderRadius: '14px',
                padding: '12px 12px',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.18)',
              }}
            >
              {/* Header Pending */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={16} weight="fill" color="#FFFFFF" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {t('overview.eng.inspectedPending')}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  4
                </span>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.22)' }} />

              {/* Breakdown List: Asset, Floor, Room */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Wrench size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catAsset')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    1
                  </span>
                </div>

                {/* Floor */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Buildings size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catFloor')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    2
                  </span>
                </div>

                {/* Room */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Door size={12} weight="bold" color="#FFFFFF" />
                    <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {t('overview.eng.catRoom')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.24)',
                      minWidth: '22px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      padding: '0 4px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                    }}
                  >
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <button
            type="button"
            onClick={() => alert('Opening all housekeeping inspection schedules')}
            style={{
              width: '100%',
              height: '38px',
              backgroundColor: '#FFFFFF',
              color: '#02388A',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '2px',
            }}
          >
            {t('overview.eng.viewAllInspections')}
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Inspection Month Picker Modal */}
      {isInspMonthPickerOpen && (() => {
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsInspMonthPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '9999px',
                  margin: '0 auto -4px auto',
                }}
              />

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Pilih Periode Inspeksi' : 'Select Inspection Period'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {language === 'id' ? 'Pilih bulan dan tahun' : 'Choose month and year'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInspMonthPickerOpen(false)}
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setInspPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {inspPickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setInspPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12 Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {(language === 'id' ? HS_MONTHS_ID : HS_MONTHS_EN).map((mName, idx) => {
                  const isSelected = inspPickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setInspPickerTempMonth(idx)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#02388A' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => {
                  setInspSelectedMonth(inspPickerTempMonth);
                  setInspSelectedYear(inspPickerTempYear);
                  setIsInspMonthPickerOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                {language === 'id' ? 'Terapkan Periode' : 'Apply Period'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}

      {/* =========================================================================
          SECTION 5: Pengelolaan Sampah & Stok Kimia
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header OUTSIDE Card */}
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
            {t('overview.hk.garbageTitle')}
          </h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
            Period Sep 2026
          </span>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          {/* Waste Chutes Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} color="#16A34A" weight="fill" />
                {t('overview.hk.garbageStations')}
              </span>
              <span style={{ fontWeight: 700, color: '#02388A' }}>28 / 30 (93.3%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '93.3%', height: '100%', backgroundColor: '#16A34A', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Chemical Stock Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Drop size={14} color="#0EA5E9" weight="fill" />
                {t('overview.hk.chemicalSupply')}
              </span>
              <span style={{ fontWeight: 700, color: '#02388A' }}>88.5% Stock Safe</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '88.5%', height: '100%', backgroundColor: '#0EA5E9', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Building Management Overview View
 * Implements:
 * 1. Building summary
 * 2. Finances this month
 * 3. Today's operations (Tenant Requests Line Chart & Employee attendance Bar Chart)
 * 4. Utility Recording (Water meter & Electric meter + Month Picker Filter)
 */
export const OverviewReportView = ({ user, onNavigateDetails }) => {
  const { t } = useLanguage();
  const isTenant = user?.roleCode === 'TENANT';
  const isEngineering = user?.roleCode === 'ENG';
  const isHousekeeping = user?.roleCode === 'HK';
  const isSecurity = user?.roleCode === 'SEC';
  const [utilityPeriod, setUtilityPeriod] = useState('Jul 2026');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [tempYear, setTempYear] = useState(2026);
  const [tempMonth, setTempMonth] = useState('Jul');

  const handleOpenPicker = () => {
    const parts = utilityPeriod.split(' ');
    if (parts.length === 2) {
      setTempMonth(parts[0]);
      setTempYear(parseInt(parts[1], 10) || 2026);
    }
    setIsPickerOpen(true);
  };

  const handleApplyPicker = () => {
    setUtilityPeriod(`${tempMonth} ${tempYear}`);
    setIsPickerOpen(false);
  };

  const handleViewDetails = (section) => {
    if (onNavigateDetails) {
      onNavigateDetails(section);
    } else {
      alert(t('overview.detailsAlert', { section }));
    }
  };

  // If user is Engineering, render rich Engineering Overview
  if (isEngineering) {
    return <EngineeringOverviewContent t={t} onNavigateDetails={onNavigateDetails} />;
  }

  // If user is Housekeeping, render rich Housekeeping Overview
  if (isHousekeeping) {
    return <HousekeepingOverviewContent t={t} onNavigateDetails={onNavigateDetails} />;
  }

  // If user is Security, render empty overview container
  if (isSecurity) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          backgroundColor: '#F8FAFC',
          fontFamily: 'var(--font-sans)',
          boxSizing: 'border-box',
          userSelect: 'none',
        }}
      />
    );
  }

  // If user is Tenant, render Tenant Overview Report matching design
  if (isTenant) {
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
        {/* 1. Total Billing This Month Card (Coral/Red Alert Card) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F87171 0%, #EF4444 60%, #DC2626 100%)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'none',
            color: '#FFFFFF',
          }}
        >
          {/* Top Info Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                <Receipt size={22} weight="fill" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px' }}>
                <div style={{ fontSize: '0.8125rem', opacity: 0.92, fontWeight: 500, lineHeight: 1.2 }}>
                  {t('overview.totalBilling')}
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  Rp 2.500.000,00
                </div>
              </div>
            </div>

            {/* Overdue Badge & Late Days */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#EF4444',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  boxShadow: 'none',
                }}
              >
                {t('overview.overdue')}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.95 }}>
                {t('overview.lateDays')}
              </span>
            </div>
          </div>

          {/* Pay CTA Button */}
          <button
            type="button"
            onClick={() => alert(t('overview.payAlert'))}
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#7F1D1D',
              color: '#FFFFFF',
              fontSize: '0.9375rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, transform 0.1s ease',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.2px',
              boxShadow: 'none',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {t('overview.pay')}
          </button>
        </div>

        {/* 2. Utility Recording Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.2px' }}>
              {t('overview.utilityRecording')}
            </h3>
            <button
              type="button"
              onClick={() => alert(t('overview.utilityAlert'))}
              style={{
                background: 'none',
                border: 'none',
                color: '#053079',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span>{t('overview.viewDetails')}</span>
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          {/* 2 Mini Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {/* Electric Card */}
            <div
              style={{
                backgroundColor: '#FFFBEB',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                border: '1px solid #FEF3C7',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightning size={16} weight="fill" color="#EAB308" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>
                  {t('overview.electric')}
                </span>
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.2px' }}>
                1280 kWh
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>
                {t('overview.thisMonth')}
              </div>
            </div>

            {/* Water Card */}
            <div
              style={{
                backgroundColor: '#F0F9FF',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                border: '1px solid #E0F2FE',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Drop size={16} weight="fill" color="#09B2FF" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>
                  {t('overview.water')}
                </span>
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.2px' }}>
                1280 M³
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>
                {t('overview.thisMonth')}
              </div>
            </div>
          </div>

          {/* Trends Subtitle */}
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
            {t('overview.trendsLast6Months')}
          </div>

          {/* SVG Multi-Line Trend Chart */}
          <div style={{ width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 340 190" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
              <defs>
                <linearGradient id="tenantWaterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09B2FF" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#09B2FF" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="tenantElecGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EAB308" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#EAB308" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Grid Lines and Y Labels */}
              {[
                { val: '100', y: 20 },
                { val: '80', y: 48 },
                { val: '60', y: 76 },
                { val: '40', y: 104 },
                { val: '20', y: 132 },
                { val: '0', y: 160 },
              ].map((grid) => (
                <g key={grid.val}>
                  <text x="18" y={grid.y + 4} textAnchor="end" fontSize="10" fill="#94A3B8" fontWeight="500">
                    {grid.val}
                  </text>
                  <line x1="32" y1={grid.y} x2="330" y2={grid.y} stroke="#F1F5F9" strokeWidth="1" />
                </g>
              ))}

              {/* Water Area & Line */}
              <path
                className="animate-area-fade"
                d="M 35 160 L 35 146 C 65 105, 75 90, 95 93 C 115 96, 125 128, 140 120 C 148 100, 152 53, 160 51 C 168 50, 190 115, 215 135 C 235 125, 255 70, 270 65 C 280 62, 290 85, 305 88 C 318 90, 325 97, 330 98 L 330 160 Z"
                fill="url(#tenantWaterGrad)"
              />
              <path
                className="animate-line-draw"
                d="M 35 146 C 65 105, 75 90, 95 93 C 115 96, 125 128, 140 120 C 148 100, 152 53, 160 51 C 168 50, 190 115, 215 135 C 235 125, 255 70, 270 65 C 280 62, 290 85, 305 88 C 318 90, 325 97, 330 98"
                fill="none"
                stroke="#09B2FF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Electric Area & Line */}
              <path
                className="animate-area-fade"
                d="M 35 160 L 35 160 C 55 130, 75 88, 95 87 C 115 86, 125 142, 140 146 C 155 150, 175 128, 190 129 C 205 130, 212 148, 220 149 C 235 150, 250 138, 260 140 C 270 142, 275 154, 285 154 C 300 154, 315 110, 330 90 L 330 160 Z"
                fill="url(#tenantElecGrad)"
                style={{ animationDelay: '0.2s' }}
              />
              <path
                className="animate-line-draw"
                d="M 35 160 C 55 130, 75 88, 95 87 C 115 86, 125 142, 140 146 C 155 150, 175 128, 190 129 C 205 130, 212 148, 220 149 C 235 150, 250 138, 260 140 C 270 142, 275 154, 285 154 C 300 154, 315 110, 330 90"
                fill="none"
                stroke="#EAB308"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ animationDelay: '0.2s' }}
              />

              {/* Data Dots for Water */}
              {[
                { x: 35, y: 146 },
                { x: 95, y: 93 },
                { x: 160, y: 51 },
                { x: 215, y: 135 },
                { x: 270, y: 65 },
                { x: 330, y: 98 },
              ].map((pt, i) => (
                <circle
                  key={`tw-${i}`}
                  className="animate-dot-pop"
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#09B2FF"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                />
              ))}

              {/* Data Dots for Electric */}
              {[
                { x: 35, y: 160 },
                { x: 95, y: 87 },
                { x: 160, y: 146 },
                { x: 220, y: 149 },
                { x: 270, y: 142 },
                { x: 330, y: 90 },
              ].map((pt, i) => (
                <circle
                  key={`te-${i}`}
                  className="animate-dot-pop"
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#EAB308"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                />
              ))}

              {/* X Labels */}
              {[
                { label: 'Jan', x: 40 },
                { label: 'Feb', x: 95 },
                { label: 'Mar', x: 155 },
                { label: 'Apr', x: 215 },
                { label: 'May', x: 275 },
                { label: 'Jun', x: 325 },
              ].map((m) => (
                <text key={m.label} x={m.x} y="178" textAnchor="middle" fontSize="11" fill="#94A3B8" fontWeight="500">
                  {m.label}
                </text>
              ))}
            </svg>
          </div>

          {/* Legends */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#EAB308' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>
                {t('overview.electricKwh')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#09B2FF' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>
                {t('overview.waterM3')}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Tenant Request Card with 6-Bar Chart */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'none',
          }}
        >
          {/* Header */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.2px' }}>
            {t('overview.tenantRequests')}
          </h3>

          {/* Headline Stat */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '-2px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#053079', lineHeight: 1 }}>
              12
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#94A3B8' }}>
              {t('overview.totalRequests')}
            </span>
          </div>

          {/* SVG 6-Bar Chart with Dashed Grid */}
          <div style={{ width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 340 180" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
              {/* Horizontal Dashed Grid Lines & Y-Labels */}
              {[
                { val: '30', y: 20 },
                { val: '20', y: 48 },
                { val: '10', y: 78 },
                { val: '5', y: 104 },
                { val: '2', y: 124 },
                { val: '0', y: 146 },
              ].map((grid) => (
                <g key={grid.val}>
                  <text x="18" y={grid.y + 4} textAnchor="end" fontSize="10" fill="#94A3B8" fontWeight="500">
                    {grid.val}
                  </text>
                  <line
                    x1="28"
                    y1={grid.y}
                    x2="330"
                    y2={grid.y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={grid.val === '0' ? 'none' : '3 3'}
                  />
                </g>
              ))}

              {/* Vertical Dashed Guidelines for Columns */}
              {[54, 104, 154, 204, 254, 304].map((xPos, idx) => (
                <line
                  key={`vline-${idx}`}
                  x1={xPos}
                  y1={20}
                  x2={xPos}
                  y2={146}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* 6 Secondary Color Bars */}
              {[
                { label: 'WR', x: 45, val: 20, height: 98, y: 48 },
                { label: 'GIGO', x: 95, val: 30, height: 126, y: 20 },
                { label: 'FP', x: 145, val: 5, height: 42, y: 104 },
                { label: 'PMT', x: 195, val: 19, height: 95, y: 51 },
                { label: 'RSV', x: 245, val: 14, height: 75, y: 71 },
                { label: 'HS', x: 295, val: 12, height: 68, y: 78 },
              ].map((bar, idx) => (
                <g key={bar.label}>
                  <rect
                    className="animate-bar-grow"
                    x={bar.x}
                    y={bar.y}
                    width="18"
                    height={bar.height}
                    rx="2"
                    ry="2"
                    fill="#09B2FF"
                    style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
                  />
                  <text
                    x={bar.x + 9}
                    y="164"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#64748B"
                    fontWeight="600"
                  >
                    {bar.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* 4. Tenant Unit Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.2px' }}>
              {t('overview.tenantUnit')}
            </h3>
            <button
              type="button"
              onClick={() => alert(t('overview.unitAlert'))}
              style={{
                background: 'none',
                border: 'none',
                color: '#053079',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span>{t('overview.viewDetails')}</span>
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          {/* Unit Info Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#EAF7FF',
                color: '#09B2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Key size={22} weight="fill" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.2px', lineHeight: 1.15 }}>
                {t('overview.units', { count: 20 })}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B', marginTop: '1px' }}>
                {t('overview.ownerRenterCount', { owner: 15, renter: 5 })}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

          {/* Bottom Row: Member & Vehicles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* 2 Member */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Circle 1 */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#FFEBD6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF',
                    zIndex: 1,
                    position: 'relative',
                  }}
                >
                  <User size={15} weight="fill" color="#EA580C" />
                </div>

                {/* Circle 2 */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#FFEBD6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF',
                    marginLeft: '-8px',
                    zIndex: 2,
                    position: 'relative',
                  }}
                >
                  <User size={15} weight="fill" color="#EA580C" />
                </div>

                {/* Circle 3 */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#FFEBD6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF',
                    marginLeft: '-8px',
                    zIndex: 3,
                    position: 'relative',
                  }}
                >
                  <User size={15} weight="fill" color="#EA580C" />
                </div>
              </div>

              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>
                {t('overview.member', { count: 2 })}
              </span>
            </div>

            {/* 4 vehicles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={18} weight="fill" color="#007AFF" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>
                {t('overview.vehicles', { count: 4 })}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Package Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.2px' }}>
              {t('overview.package')}
            </h3>
            <button
              type="button"
              onClick={() => alert(t('overview.packageAlert'))}
              style={{
                background: 'none',
                border: 'none',
                color: '#053079',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span>{t('overview.viewDetails')}</span>
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          {/* Package Info Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#EAF7FF',
                color: '#09B2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Package size={22} weight="fill" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.2px', lineHeight: 1.15 }}>
                {t('overview.packageItems', { count: 3 })}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#EA580C', marginTop: '1px' }}>
                {t('overview.pendingPickup', { count: 1 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          SECTION 1: Building Summary
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {t('overview.buildingSummary')}
          </h2>

          <button
            type="button"
            onClick={() => handleViewDetails('Building summary')}
            style={{
              background: 'none',
              border: 'none',
              color: '#053079',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
            }}
          >
            <span>{t('overview.viewDetails')}</span>
            <CaretRight size={14} weight="bold" />
          </button>
        </div>

        {/* 2-Column Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          {/* Card 1: Total Units */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#EAF7FF',
                  color: '#09B2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Buildings size={18} weight="fill" />
              </div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#64748B',
                }}
              >
                {t('overview.totalUnits')}
              </span>
            </div>

            <div
              style={{
                fontSize: '1.625rem',
                fontWeight: 700,
                color: '#334155',
                letterSpacing: '-0.5px',
                lineHeight: 1,
              }}
            >
              1.082
            </div>
          </div>

          {/* Card 2: Total Tenants */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#EAF7FF',
                  color: '#09B2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={18} weight="fill" />
              </div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#64748B',
                }}
              >
                {t('overview.totalTenants')}
              </span>
            </div>

            <div
              style={{
                fontSize: '1.625rem',
                fontWeight: 700,
                color: '#334155',
                letterSpacing: '-0.5px',
                lineHeight: 1,
              }}
            >
              982
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: Finances This Month
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {t('overview.financesThisMonth')}
          </h2>

          <button
            type="button"
            onClick={() => handleViewDetails('Finances this month')}
            style={{
              background: 'none',
              border: 'none',
              color: '#053079',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
            }}
          >
            <span>{t('overview.viewDetails')}</span>
            <CaretRight size={14} weight="bold" />
          </button>
        </div>

        {/* Featured Financial Container Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Brand Gradient Hero Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #053079 0%, #0348B8 55%, #09B2FF 100%)',
              padding: '18px 16px 16px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative Translucent Graphic Circles */}
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-40px',
                left: '40%',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                pointerEvents: 'none',
              }}
            />

            {/* Top Stat Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Icon Badge */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Receipt size={20} weight="bold" />
                </div>

                {/* Subtitle & Main Value */}
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.9)',
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    {t('overview.totalBilling')}
                  </span>
                  <div
                    style={{
                      fontSize: '1.625rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      lineHeight: 1.15,
                      marginTop: '2px',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Rp 66 M
                  </div>
                </div>
              </div>

              {/* Percentage Pill Badge */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'inline-block',
                  }}
                />
                <span>{t('overview.collected', { pct: 69 })}</span>
              </div>
            </div>

            {/* Middle: Progress Bar */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.28)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '69%',
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '9999px',
                    transformOrigin: 'left center',
                    animation: 'barGrowHorizontal 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                />
              </div>
            </div>

            {/* Bottom: Paid & Unpaid Stats */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#FFFFFF',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontWeight: 600 }}>{t('overview.paid', { amount: 'Rp 45,7 M' })}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.65)',
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                  {t('overview.unpaid', { amount: 'Rp 20,3 M' })}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Outstanding & Fine Cards */}
          <div
            style={{
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Sub-Card 1: Outstanding */}
            <div
              style={{
                backgroundColor: '#FEF9C3',
                border: '1px solid #FEF08A',
                borderRadius: '8px',
                padding: '14px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '74px',
                boxSizing: 'border-box',
              }}
            >
              {/* Background Clock Watermark (Tightly in bottom right) */}
              <div
                style={{
                  position: 'absolute',
                  right: '-4px',
                  bottom: '-6px',
                  color: 'rgba(202, 138, 4, 0.16)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}
              >
                <Clock size={78} weight="bold" />
              </div>

              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#854D0E',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {t('overview.outstanding')}
              </span>

              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#CA8A04',
                  position: 'relative',
                  zIndex: 2,
                  lineHeight: 1.1,
                  marginTop: '6px',
                }}
              >
                Rp 8,6 M
              </div>
            </div>

            {/* Sub-Card 2: Fine */}
            <div
              style={{
                backgroundColor: '#FFE4E6',
                border: '1px solid #FECDD3',
                borderRadius: '8px',
                padding: '14px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '74px',
                boxSizing: 'border-box',
              }}
            >
              {/* Background Warning Watermark (Tightly in bottom right) */}
              <div
                style={{
                  position: 'absolute',
                  right: '0px',
                  bottom: '-4px',
                  color: 'rgba(225, 29, 72, 0.16)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}
              >
                <Warning size={76} weight="fill" />
              </div>

              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#9F1239',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {t('overview.fine')}
              </span>

              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#E11D48',
                  position: 'relative',
                  zIndex: 2,
                  lineHeight: 1.1,
                  marginTop: '6px',
                }}
              >
                Rp 1,3 M
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: Today's operations
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          {t('overview.todaysOperations')}
        </h2>

        {/* Card 1: Tenant Requests (Line Chart) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: 'none',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#334155',
                margin: 0,
                letterSpacing: '-0.2px',
              }}
            >
              {t('overview.tenantRequests')}
            </h3>

            <button
              type="button"
              onClick={() => handleViewDetails('Tenant Requests')}
              style={{
                background: 'none',
                border: 'none',
                color: '#053079',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-sans)',
                boxShadow: 'none',
              }}
            >
              <span>{t('overview.viewDetails')}</span>
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          {/* Headline Stat */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '-4px' }}>
            <span
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#053079',
                lineHeight: 1,
              }}
            >
              82
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748B' }}>
              {t('overview.totalRequestsToday')}
            </span>
          </div>

          {/* SVG Line Chart (Secondary Brand Color #09B2FF) */}
          <div style={{ width: '100%', position: 'relative', marginTop: '0px' }}>
            <svg
              viewBox="0 0 340 160"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                overflow: 'visible',
                animation: 'chartFadeIn 0.35s ease-out',
              }}
            >
              <defs>
                <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09B2FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#09B2FF" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              {[
                { val: '40', y: 18 },
                { val: '30', y: 46 },
                { val: '20', y: 74 },
                { val: '10', y: 102 },
                { val: '0', y: 130 },
              ].map((grid) => (
                <g key={grid.val}>
                  <text
                    x="18"
                    y={grid.y + 4}
                    fontSize="10"
                    fontWeight="500"
                    fill="#94A3B8"
                    textAnchor="end"
                  >
                    {grid.val}
                  </text>
                  <line
                    x1="28"
                    y1={grid.y}
                    x2="330"
                    y2={grid.y}
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Area Under Line */}
              <path
                d="M 40,51 L 95,71 L 150,91 L 205,74 L 260,80 L 315,96 L 315,130 L 40,130 Z"
                fill="url(#reqGradient)"
                style={{ animation: 'areaFadeIn 0.4s ease-out' }}
              />

              {/* Connecting Line */}
              <path
                d="M 40,51 L 95,71 L 150,91 L 205,74 L 260,80 L 315,96"
                fill="none"
                stroke="#09B2FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points & Values */}
              {[
                { x: 40, y: 51, val: '28', label: 'WR' },
                { x: 95, y: 71, val: '21', label: 'GIGO' },
                { x: 150, y: 91, val: '14', label: 'FP' },
                { x: 205, y: 74, val: '20', label: 'PMT' },
                { x: 260, y: 80, val: '18', label: 'RSV' },
                { x: 315, y: 96, val: '12', label: 'HS' },
              ].map((pt) => (
                <g key={pt.label}>
                  {/* Value on top */}
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fontSize="11"
                    fontWeight="700"
                    fill="#334155"
                    textAnchor="middle"
                  >
                    {pt.val}
                  </text>
                  {/* Point Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#09B2FF"
                    strokeWidth="2.5"
                  />
                  {/* X-Axis Label */}
                  <text
                    x={pt.x}
                    y="148"
                    fontSize="10"
                    fontWeight="600"
                    fill="#64748B"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Card 2: Employee attendance (Bar Chart) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'none',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#334155',
                margin: 0,
                letterSpacing: '-0.2px',
              }}
            >
              {t('overview.employeeAttendance')}
            </h3>

            <button
              type="button"
              onClick={() => handleViewDetails('Employee attendance')}
              style={{
                background: 'none',
                border: 'none',
                color: '#053079',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-sans)',
                boxShadow: 'none',
              }}
            >
              <span>{t('overview.viewDetails')}</span>
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          {/* Headline Stat */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '-6px' }}>
            <span
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#16A34A',
                lineHeight: 1,
              }}
            >
              108
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748B' }}>
              {t('overview.presentStat', { total: 218 })}
            </span>
          </div>

          {/* Vertical 3-Bar Chart matching Screenshot */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              alignItems: 'flex-end',
              marginTop: '4px',
              paddingTop: '0px',
            }}
          >
            {/* Present Bar Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>
                108
              </span>
              <div
                style={{
                  width: '100%',
                  height: '72px',
                  backgroundColor: '#10B981',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                  transition: 'height 0.4s ease',
                }}
              />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                {t('overview.present')}
              </span>
            </div>

            {/* Late Bar Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>
                17
              </span>
              <div
                style={{
                  width: '100%',
                  height: '16px',
                  backgroundColor: '#F59E0B',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                  transition: 'height 0.4s ease',
                }}
              />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                {t('overview.late')}
              </span>
            </div>

            {/* Absent Bar Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>
                110
              </span>
              <div
                style={{
                  width: '100%',
                  height: '74px',
                  backgroundColor: '#DC2626',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                  transition: 'height 0.4s ease',
                }}
              />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                {t('overview.absent')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: Utility Recording
          ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Section Header with Period Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {t('overview.utilityRecording')}
          </h2>

          {/* Month Selector Pill */}
          <button
            type="button"
            onClick={handleOpenPicker}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{utilityPeriod}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Card 1: Water Meter */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'none',
          }}
        >
          {/* Top Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Drop size={18} weight="fill" color="#09B2FF" />
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}>
                {t('overview.waterMeter')}
              </span>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#053079' }}>
              {t('overview.scanned', { count: 824, total: 952 })}
            </span>
          </div>

          {/* Progress Bar (86.5% scanned) */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#F1F5F9',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '86.5%',
                height: '100%',
                backgroundColor: '#09B2FF',
                borderRadius: '9999px',
                transition: 'width 0.4s ease-out',
              }}
            />
          </div>

          {/* Bottom Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>
              {t('overview.notRecordedYet', { count: 128 })}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#10B981' }}>
              86.5%
            </span>
          </div>
        </div>

        {/* Card 2: Electric Meter */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'none',
          }}
        >
          {/* Top Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightning size={18} weight="fill" color="#EAB308" />
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}>
                {t('overview.electricMeter')}
              </span>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#053079' }}>
              {t('overview.scanned', { count: 946, total: '1.080' })}
            </span>
          </div>

          {/* Progress Bar (87.6% scanned) */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#F1F5F9',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '87.6%',
                height: '100%',
                backgroundColor: '#EAB308',
                borderRadius: '9999px',
                transition: 'width 0.4s ease-out',
              }}
            />
          </div>

          {/* Bottom Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>
              {t('overview.notRecordedYet', { count: 134 })}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#10B981' }}>
              87.6%
            </span>
          </div>
        </div>

        {/* Show Unrecorded Utility Button */}
        <button
          type="button"
          onClick={() => handleViewDetails('Unrecorded Utility')}
          style={{
            width: '100%',
            height: '38px',
            backgroundColor: '#FFFFFF',
            color: '#02388A',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '2px',
          }}
        >
          {t('overview.eng.showUnrecordedUtility')}
          <CaretRight size={14} weight="bold" />
        </button>
      </div>

      {/* =========================================================================
          MONTH PICKER BOTTOM SHEET MODAL (Portal to Android Device Frame)
          ========================================================================= */}
      {isPickerOpen && (() => {
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
              backgroundColor: 'rgba(11, 17, 32, 0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              overflow: 'hidden',
              borderRadius: 0,
              margin: 0,
              padding: 0,
              boxSizing: 'border-box',
            }}
            onClick={() => setIsPickerOpen(false)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '28px',
                borderTopRightRadius: '28px',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                width: '100%',
                padding: '16px 20px 24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxSizing: 'border-box',
                userSelect: 'none',
                boxShadow: '0 -16px 40px rgba(0, 0, 0, 0.35)',
                animation: 'bottomSheetSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                zIndex: 10000,
                margin: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Drag Handle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '2px',
                  paddingBottom: '4px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '5px',
                    backgroundColor: '#CBD5E1',
                    borderRadius: '9999px',
                  }}
                />
              </div>

              {/* Header: Title & Close Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '4px',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: '#334155',
                      margin: 0,
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {t('overview.selectMonth')}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 400 }}>
                    {t('overview.filterUtilityDesc')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  aria-label="Close month picker"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'none',
                    border: 'none',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Year Selector Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '8px 14px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setTempYear((y) => y - 1)}
                  aria-label="Previous year"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: 'none',
                    border: 'none',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <CaretLeft size={18} weight="bold" />
                </button>

                <span
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#334155',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {tempYear}
                </span>

                <button
                  type="button"
                  onClick={() => setTempYear((y) => y + 1)}
                  aria-label="Next year"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: 'none',
                    border: 'none',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>

              {/* 12 Months Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                }}
              >
                {MONTHS.map((m) => {
                  const isSelected = tempMonth === m.short;
                  return (
                    <button
                      key={m.short}
                      type="button"
                      onClick={() => setTempMonth(m.short)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? '#053079' : '#F8FAFC',
                        color: isSelected ? '#FFFFFF' : '#334155',
                        border: isSelected ? '1px solid #053079' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                      }}
                    >
                      {m.short}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons Footer */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginTop: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {t('overview.cancel')}
                </button>

                <button
                  type="button"
                  onClick={handleApplyPicker}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    backgroundColor: '#053079',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {t('overview.apply')}
                </button>
              </div>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}
    </div>
  );
};

export default OverviewReportView;

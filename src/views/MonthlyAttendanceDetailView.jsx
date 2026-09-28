import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CalendarBlank,
  X,
  SealCheck,
  Warning,
  Clock,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import attendanceEmptySearch from '../assets/attendance-empty-search.png';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTH_SHORT_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DAY_NAMES_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

// Mock monthly attendance log generator
const generateMonthlyLogs = (year, monthIndex) => {
  // Generate mock logs for 24 work days
  const logs = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = daysInMonth; day >= 1; day--) {
    const dateObj = new Date(year, monthIndex, day);
    const dayOfWeek = dateObj.getDay();
    // Skip weekends (Sunday = 0, Saturday = 6)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    if (day === 24) {
      // Late In, On Time Out
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'late',
        inStatus: 'LATE',
        outStatus: 'ON_TIME',
        lateMinutes: 18,
        clockIn: '08:18 WIB',
        clockOut: '17:05 WIB',
        workDuration: '8h 47m',
        notes: 'Terlambat 18 menit (Macet Tol)',
      });
    } else if (day === 21) {
      // Early In, Early Out
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'early_out',
        inStatus: 'EARLY_IN',
        outStatus: 'EARLY_OUT',
        clockIn: '07:48 WIB',
        clockOut: '16:45 WIB',
        workDuration: '8h 57m',
        notes: 'Pulang 15 menit awal (Izin Urusan Keluarga)',
      });
    } else if (day === 18) {
      // Early In, On Time Out
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'early_in',
        inStatus: 'EARLY_IN',
        outStatus: 'ON_TIME',
        clockIn: '07:50 WIB',
        clockOut: '17:02 WIB',
        workDuration: '9h 12m',
        notes: 'Shift Pagi (Masuk Awal)',
      });
    } else if (day === 17) {
      // Alpha day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'alpha',
        inStatus: null,
        outStatus: null,
        clockIn: '-- : --',
        clockOut: '-- : --',
        workDuration: '0h 0m',
        notes: 'Tanpa Keterangan (Alpha)',
      });
    } else if (day === 14) {
      // Late day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'late',
        inStatus: 'LATE',
        outStatus: 'ON_TIME',
        lateMinutes: 14,
        clockIn: '08:14 WIB',
        clockOut: '17:05 WIB',
        workDuration: '8h 51m',
        notes: 'Terlambat 14 menit',
      });
    } else if (day === 8) {
      // 1 Leave day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'leave',
        inStatus: null,
        outStatus: null,
        clockIn: '-- : --',
        clockOut: '-- : --',
        workDuration: '0h 0m',
        notes: 'Cuti Tahunan (Disetujui)',
      });
    } else if (day === 3) {
      // 1 Alpha day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'alpha',
        inStatus: null,
        outStatus: null,
        clockIn: '-- : --',
        clockOut: '-- : --',
        workDuration: '0h 0m',
        notes: 'Tanpa Keterangan (Alpha)',
      });
    } else {
      // On time days
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'ontime',
        inStatus: 'ON_TIME',
        outStatus: 'ON_TIME',
        clockIn: '08:00 WIB',
        clockOut: '17:00 WIB',
        workDuration: '9h 00m',
        notes: 'Shift Pagi (08:00 - 17:00)',
      });
    }
  }

  return logs;
};

/**
 * Monthly Attendance Detail Header Bar
 */
export const MonthlyAttendanceDetailHeader = ({
  onBack,
  selectedMonth = 6, // 0-indexed (6 = July)
  selectedYear = 2026,
  onPrevMonth,
  onNextMonth,
  onOpenPicker,
}) => {
  const { language } = useLanguage();
  const monthName = language === 'id' ? MONTH_NAMES_ID[selectedMonth] : MONTH_NAMES[selectedMonth];
  const headerTitle = language === 'id' ? 'Laporan Presensi' : 'Report Attendance';

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: '#334155',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #E2E8F0',
        flexShrink: 0,
        zIndex: 40,
        boxSizing: 'border-box',
        boxShadow: 'none',
      }}
    >
      {/* 1. Title Row (Centered Title) */}
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '52px',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Overview"
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

        <h1
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
            textAlign: 'center',
            flex: 1,
          }}
        >
          {headerTitle}
        </h1>

        <div style={{ width: '32px' }} />
      </div>

      {/* 2. Date/Month Navigator Filter Row (Identical to BM Attendance Detail) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '10px 16px 14px 16px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
            flexShrink: 0,
            transition: 'background-color 0.15s ease',
          }}
        >
          <CaretLeft size={18} weight="bold" />
        </button>

        <button
          type="button"
          onClick={onOpenPicker}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            flex: 1,
            boxShadow: 'none',
          }}
        >
          <CalendarBlank size={18} weight="fill" color="#053079" />
          <span>{`${monthName} ${selectedYear}`}</span>
        </button>

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
            flexShrink: 0,
            transition: 'background-color 0.15s ease',
          }}
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </header>
  );
};

/**
 * Monthly Attendance Detail View Screen
 */
export const MonthlyAttendanceDetailView = ({
  selectedMonth = 8,
  selectedYear = 2026,
  onMonthChange,
  isPickerOpen,
  setIsPickerOpen,
}) => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [pickerTempMonth, setPickerTempMonth] = useState(selectedMonth);
  const [pickerTempYear, setPickerTempYear] = useState(selectedYear);

  const logs = generateMonthlyLogs(selectedYear, selectedMonth);

  const totalLogs = logs.length;
  const onTimeCount = logs.filter((l) => l.status === 'ontime').length;
  const lateCount = logs.filter((l) => l.status === 'late').length;
  const leaveCount = logs.filter((l) => l.status === 'leave').length;
  const alphaCount = logs.filter((l) => l.status === 'alpha').length;
  const presentCount = onTimeCount + lateCount;
  const attendanceRatePct = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 0;

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ONTIME') return log.status === 'ontime';
    if (activeFilter === 'LATE') return log.status === 'late';
    if (activeFilter === 'LEAVE') return log.status === 'leave';
    if (activeFilter === 'ALPHA') return log.status === 'alpha';
    return true;
  });

  const handleApplyMonthPicker = () => {
    if (onMonthChange) {
      onMonthChange(pickerTempMonth, pickerTempYear);
    }
    setIsPickerOpen(false);
  };

  const renderLogBadges = (log) => {
    if (log.status === 'leave') {
      return (
        <span
          style={{
            backgroundColor: '#F1F5F9',
            color: '#64748B',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Izin / Cuti' : 'Leave'}
        </span>
      );
    }
    if (log.status === 'alpha') {
      return (
        <span
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          Alpha
        </span>
      );
    }
    if (log.status === 'today' || log.status === 'pending') {
      return (
        <span
          style={{
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Hari Ini' : 'Today'}
        </span>
      );
    }

    const inStatus = log.inStatus || (log.status === 'late' ? 'LATE' : 'ON_TIME');
    const outStatus = log.outStatus || 'ON_TIME';

    // Rule: Jika clock in dan clock out keduanya on time, hanya tampilkan 1 badge On Time
    if (inStatus === 'ON_TIME' && outStatus === 'ON_TIME') {
      return (
        <span
          style={{
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Tepat Waktu' : 'On Time'}
        </span>
      );
    }

    const badges = [];

    // 1. Clock In Badge (Early In / Late / On Time)
    if (inStatus === 'EARLY_IN') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Masuk Awal' : 'Early In'}
        </span>
      );
    } else if (inStatus === 'LATE') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {log.lateMinutes ? (language === 'id' ? `Terlambat (${log.lateMinutes}m)` : `Late (${log.lateMinutes}m)`) : (language === 'id' ? 'Terlambat' : 'Late')}
        </span>
      );
    } else if (inStatus === 'ON_TIME') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Tepat Waktu' : 'On Time'}
        </span>
      );
    }

    // 2. Clock Out Badge (Early Out / On Time)
    if (outStatus === 'EARLY_OUT') {
      badges.push(
        <span
          key="out"
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Pulang Awal' : 'Early Out'}
        </span>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {badges}
      </div>
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
        padding: '16px',
        gap: '16px',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingBottom: '24px',
      }}
    >
      {/* 1. Monthly KPI Summary Card */}
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
        <div>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: 0 }}>
            {language === 'id' ? 'Ringkasan Kehadiran' : 'Attendance Summary'}
          </h2>
          <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
            {language === 'id'
              ? `${MONTH_NAMES_ID[selectedMonth]} ${selectedYear} • Divisi Engineering`
              : `${MONTH_NAMES[selectedMonth]} ${selectedYear} • Engineering Dept`}
          </p>
        </div>

        {/* Hero Fill Attendance Rate Banner (Placed ABOVE micro-cards) */}
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
                {language === 'id' ? 'Tingkat Kehadiran' : 'Attendance Rate'}
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
                {presentCount}/{totalLogs} {language === 'id' ? 'Hari' : 'Days'}
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
                {attendanceRatePct}%
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
                width: `${attendanceRatePct}%`,
                height: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1 }}>{onTimeCount}</span>
            <span style={{ fontSize: '0.6875rem', color: '#15803D', fontWeight: 600 }}>{language === 'id' ? 'Tepat' : 'On Time'}</span>
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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>{lateCount}</span>
            <span style={{ fontSize: '0.6875rem', color: '#B45309', fontWeight: 600 }}>{language === 'id' ? 'Terlambat' : 'Late'}</span>
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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#475569', lineHeight: 1.1 }}>{leaveCount}</span>
            <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>{language === 'id' ? 'Izin' : 'Leave'}</span>
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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>{alphaCount}</span>
            <span style={{ fontSize: '0.6875rem', color: '#991B1B', fontWeight: 600 }}>Alpha</span>
          </div>
        </div>
      </div>

      {/* 2. Daily Attendance Logs List Header & Filter Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: filteredLogs.length === 0 ? 1 : 'initial' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: '4px 0 0 0' }}>
          {language === 'id' ? 'Riwayat Absensi Harian' : 'Daily Attendance Records'}
        </h3>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {[
            { key: 'ALL', label: language === 'id' ? `Semua (${totalLogs})` : `All (${totalLogs})` },
            { key: 'ONTIME', label: language === 'id' ? `Tepat (${onTimeCount})` : `On Time (${onTimeCount})` },
            { key: 'LATE', label: language === 'id' ? `Terlambat (${lateCount})` : `Late (${lateCount})` },
            { key: 'LEAVE', label: language === 'id' ? `Izin (${leaveCount})` : `Leave (${leaveCount})` },
            { key: 'ALPHA', label: `Alpha (${alphaCount})` },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  backgroundColor: isActive ? '#02388A' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  border: isActive ? '1px solid #02388A' : '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {filteredLogs.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              flex: 1,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <img
              src={attendanceEmptySearch}
              alt="No Attendance Records Found"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '200px',
                objectFit: 'contain',
                marginBottom: '12px',
                filter: 'drop-shadow(0 6px 14px rgba(2, 56, 138, 0.08))',
              }}
            />
            <h4
              style={{
                fontSize: '1.0625rem',
                fontWeight: 800,
                color: '#334155',
                margin: '0 0 6px 0',
                letterSpacing: '-0.2px',
                textAlign: 'center',
              }}
            >
              No Attendance Records Found
            </h4>
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#64748B',
                margin: 0,
                lineHeight: 1.45,
                maxWidth: '300px',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              There are no attendance records matching your selected status filter.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const dayName = language === 'id' ? DAY_NAMES_ID[log.date.getDay()] : DAY_NAMES[log.date.getDay()];
            const monthStr = language === 'id' ? MONTH_SHORT_ID[selectedMonth] : MONTH_SHORT[selectedMonth];
            const dateDisplay = `${dayName}, ${log.dayNumber} ${monthStr} ${selectedYear}`;
            const isLate = log.status === 'late' || log.inStatus === 'LATE' || log.outStatus === 'EARLY_OUT';
            const isAlpha = log.status === 'alpha';
            const isOff = log.status === 'leave' || log.status === 'off' || log.status === 'LIBUR';

            let cardBg = '#FFFFFF';
            let cardBorder = '1px solid #E2E8F0';
            let tileBg = '#F8FAFC';
            let tileBorder = '1px solid #F1F5F9';

            if (isAlpha) {
              cardBg = '#FEF2F2';
              cardBorder = '1px solid #FECACA';
              tileBg = '#FFFFFF';
              tileBorder = '1px solid #FEE2E2';
            } else if (isLate) {
              cardBg = '#FFFBEB';
              cardBorder = '1px solid #FDE68A';
              tileBg = '#FFFFFF';
              tileBorder = '1px solid #FEF3C7';
            } else if (isOff) {
              cardBg = '#F1F5F9';
              cardBorder = '1px solid #E2E8F0';
              tileBg = '#FFFFFF';
              tileBorder = '1px solid #E2E8F0';
            }

            return (
              <div
                key={log.id}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  border: cardBorder,
                }}
              >
                {/* Date & Status Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    {dateDisplay}
                  </span>
                  {renderLogBadges(log)}
                </div>

                {/* Clock In & Clock Out Tiles */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    backgroundColor: tileBg,
                    borderRadius: '10px',
                    padding: '8px 12px',
                    border: tileBorder,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                      {language === 'id' ? 'Masuk' : 'Clock In'}
                    </span>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                      {log.clockIn}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                      {language === 'id' ? 'Keluar' : 'Clock Out'}
                    </span>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                      {log.clockOut}
                    </div>
                  </div>
                </div>

                {/* Footer Notes & Duration */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                  <span style={{ color: isLate ? '#B45309' : isAlpha ? '#DC2626' : '#64748B', fontWeight: (isLate || isAlpha) ? 600 : 400 }}>
                    {log.notes}
                  </span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>
                    {language === 'id' ? `Durasi: ${log.workDuration}` : `Duration: ${log.workDuration}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Month & Year Picker Bottom Sheet Modal (In-Frame) */}
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
              backgroundColor: 'rgba(11, 17, 32, 0.65)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              overflow: 'hidden',
            }}
            onClick={() => setIsPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
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

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', margin: 0 }}>
                  {language === 'id' ? 'Pilih Periode Bulan' : 'Select Month Period'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
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
                  border: '1px solid #F1F5F9',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                  {pickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
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
                {(language === 'id' ? MONTH_NAMES_ID : MONTH_NAMES).map((mName, idx) => {
                  const isSelected = pickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setPickerTempMonth(idx)}
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
                      {mName.slice(0, 3)}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={handleApplyMonthPicker}
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
    </div>
  );
};

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
  User,
  Users,
  MagnifyingGlass,
  Buildings,
  Briefcase,
  SignIn,
  SignOut,
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
        shift: 'Shift Pagi (08:00 - 17:00)',
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
        shift: 'Shift Pagi (08:00 - 17:00)',
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
        shift: 'Shift Pagi (08:00 - 17:00)',
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
        shift: 'Shift Pagi (08:00 - 17:00)',
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
        shift: 'Shift Pagi (08:00 - 17:00)',
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
        shift: 'Shift Pagi (08:00 - 17:00)',
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
        shift: 'Shift Pagi (08:00 - 17:00)',
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
        shift: 'Shift Pagi (08:00 - 17:00)',
        notes: 'Shift Pagi (08:00 - 17:00)',
      });
    }
  }

  return logs;
};

// Department Breakdown Data for BM
const DEPARTMENTS_DATA = [
  {
    id: 'engineering',
    name: 'Engineering',
    present: 39,
    late: 6,
    leave: 11,
    absent: 18,
    totalAssigned: 68,
    percentage: 57,
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    present: 26,
    late: 5,
    leave: 19,
    absent: 29,
    totalAssigned: 74,
    percentage: 35,
  },
  {
    id: 'security',
    name: 'Security',
    present: 23,
    late: 4,
    leave: 8,
    absent: 15,
    totalAssigned: 46,
    percentage: 50,
  },
  {
    id: 'management',
    name: 'Management',
    present: 13,
    late: 2,
    leave: 6,
    absent: 11,
    totalAssigned: 30,
    percentage: 43,
  },
];

// Mock Real-time Employees Attendance for BM
const MOCK_EMPLOYEES_LIST = [
  { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:55 WIB', clockOut: '17:02 WIB', duration: '9h 07m', status: 'ONTIME', avatarBg: '#2563EB', initials: 'BS' },
  { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:05 WIB', duration: '9h 15m', status: 'ONTIME', avatarBg: '#059669', initials: 'SR' },
  { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '08:18 WIB', clockOut: '20:05 WIB', duration: '11h 47m', lateMinutes: 18, status: 'LATE', avatarBg: '#D97706', initials: 'AS' },
  { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', status: 'LEAVE', avatarBg: '#0891B2', initials: 'DL' },
  { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:10 WIB', duration: '12h 25m', status: 'ONTIME', avatarBg: '#4F46E5', initials: 'RH' },
  { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', status: 'ALPHA', avatarBg: '#DC2626', initials: 'SW' },
  { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:35 WIB', duration: '9h 10m', status: 'ONTIME', avatarBg: '#0D9488', initials: 'HG' },
  { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:42 WIB', clockOut: '17:32 WIB', duration: '8h 50m', lateMinutes: 12, status: 'LATE', avatarBg: '#E11D48', initials: 'FH' },
];

/**
 * Mini Department Donut Chart Component
 */
const DepartmentDonutChart = ({ present, late, leave, absent, percentage }) => {
  const total = present + late + leave + absent || 1;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 10;

  const presentDash = (present / total) * circumference;
  const lateDash = (late / total) * circumference;
  const leaveDash = (leave / total) * circumference;
  const absentDash = (absent / total) * circumference;

  return (
    <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
      <svg
        width="76"
        height="76"
        viewBox="0 0 80 80"
        style={{
          transform: 'rotate(-90deg)',
          overflow: 'visible',
        }}
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeDasharray={`${presentDash} ${circumference}`}
          strokeDashoffset={0}
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={`${lateDash} ${circumference}`}
          strokeDashoffset={-presentDash}
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#09B2FF"
          strokeWidth={strokeWidth}
          strokeDasharray={`${leaveDash} ${circumference}`}
          strokeDashoffset={-(presentDash + lateDash)}
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#EF4444"
          strokeWidth={strokeWidth}
          strokeDasharray={`${absentDash} ${circumference}`}
          strokeDashoffset={-(presentDash + lateDash + leaveDash)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#334155' }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
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
  user,
  selectedMonth = 8,
  selectedYear = 2026,
  onMonthChange,
  isPickerOpen,
  setIsPickerOpen,
}) => {
  const { t, language } = useLanguage();
  const isBM = user?.roleCode === 'BM';

  // For BM: Tab switcher between 'MY_ATTENDANCE' and 'EMPLOYEES'
  const [activeMainTab, setActiveMainTab] = useState('MY_ATTENDANCE');

  // Employee tab filters (BM)
  const [employeeDeptFilter, setEmployeeDeptFilter] = useState('ALL');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('ALL');
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

  // Personal Attendance filters
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

  // Filtered employees for BM tab
  const filteredEmployees = MOCK_EMPLOYEES_LIST.filter((emp) => {
    if (employeeDeptFilter !== 'ALL' && emp.dept.toLowerCase() !== employeeDeptFilter.toLowerCase()) {
      return false;
    }
    if (employeeStatusFilter !== 'ALL' && emp.status !== employeeStatusFilter) {
      return false;
    }
    if (employeeSearchQuery.trim()) {
      const q = employeeSearchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.dept.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q)
      );
    }
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

  const renderEmployeeBadges = (emp) => {
    if (emp.status === 'LEAVE') {
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
    if (emp.status === 'ALPHA') {
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
    if (emp.status === 'LATE') {
      return (
        <span
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {emp.lateMinutes
            ? language === 'id'
              ? `Terlambat (${emp.lateMinutes}m)`
              : `Late (${emp.lateMinutes}m)`
            : language === 'id'
            ? 'Terlambat'
            : 'Late'}
        </span>
      );
    }
    // ONTIME / Default
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
      {/* BM Role: Segmented Tab Switcher (Absensi Saya vs Karyawan Lain) */}
      {isBM && (
        <div
          style={{
            display: 'flex',
            backgroundColor: '#E2E8F0',
            borderRadius: '12px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMainTab('MY_ATTENDANCE')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeMainTab === 'MY_ATTENDANCE' ? '#FFFFFF' : 'transparent',
              color: activeMainTab === 'MY_ATTENDANCE' ? '#02388A' : '#64748B',
              fontSize: '0.8125rem',
              fontWeight: activeMainTab === 'MY_ATTENDANCE' ? 700 : 600,
              boxShadow: activeMainTab === 'MY_ATTENDANCE' ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={16} weight={activeMainTab === 'MY_ATTENDANCE' ? 'bold' : 'regular'} />
            <span>{language === 'id' ? 'Absensi Saya' : 'My Attendance'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('EMPLOYEES')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeMainTab === 'EMPLOYEES' ? '#FFFFFF' : 'transparent',
              color: activeMainTab === 'EMPLOYEES' ? '#02388A' : '#64748B',
              fontSize: '0.8125rem',
              fontWeight: activeMainTab === 'EMPLOYEES' ? 700 : 600,
              boxShadow: activeMainTab === 'EMPLOYEES' ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Users size={16} weight={activeMainTab === 'EMPLOYEES' ? 'bold' : 'regular'} />
            <span>{language === 'id' ? 'Karyawan Lain' : 'All Employees'}</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: PERSONAL ATTENDANCE (MY ATTENDANCE)
          ========================================================================= */}
      {(!isBM || activeMainTab === 'MY_ATTENDANCE') && (
        <>
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

                {/* Footer Shift & Duration */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                    {log.shift || 'Shift Pagi (08:00 - 17:00)'}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#334155', flexShrink: 0 }}>
                    {language === 'id' ? `Durasi: ${log.workDuration}` : `Duration: ${log.workDuration}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  )}

  {/* =========================================================================
      VIEW 2: ALL EMPLOYEES ATTENDANCE (BM ONLY)
      ========================================================================= */}
  {isBM && activeMainTab === 'EMPLOYEES' && (
    <>
      {/* 1. Overall Employees KPI Summary Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: 0 }}>
            {language === 'id' ? 'Presensi Seluruh Karyawan' : 'All Employee Attendance'}
          </h2>

          <div
            style={{
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
              border: '1px solid #DBEAFE',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            218 {language === 'id' ? 'Karyawan' : 'Employees'}
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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1 }}>101</span>
            <span style={{ fontSize: '0.6875rem', color: '#15803D', fontWeight: 600 }}>{language === 'id' ? 'Hadir' : 'Present'}</span>
          </div>

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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>17</span>
            <span style={{ fontSize: '0.6875rem', color: '#B45309', fontWeight: 600 }}>{language === 'id' ? 'Terlambat' : 'Late'}</span>
          </div>

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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#475569', lineHeight: 1.1 }}>44</span>
            <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>{language === 'id' ? 'Izin' : 'Leave'}</span>
          </div>

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
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>56</span>
            <span style={{ fontSize: '0.6875rem', color: '#991B1B', fontWeight: 600 }}>Alpha</span>
          </div>
        </div>
      </div>

      {/* 2. Department Breakdown Progress Accordion Card */}
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
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: 0 }}>
            {language === 'id' ? 'Kehadiran Bulanan Per Departemen' : 'Monthly Attendance by Department'}
          </h3>
          <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
            {language === 'id'
              ? 'Rata-rata tingkat kehadiran & pemenuhan shift bulanan'
              : 'Monthly average attendance rate & shift fulfillment'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {DEPARTMENTS_DATA.map((dept) => {
            const ratioPercent = Math.round((dept.present / dept.totalAssigned) * 100);
            return (
              <div key={dept.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                    {dept.name}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                    {dept.present}/{dept.totalAssigned} ({ratioPercent}%)
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '7px',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${ratioPercent}%`,
                      height: '100%',
                      backgroundColor: '#02388A',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease-out',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Employee List Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: filteredEmployees.length === 0 ? 1 : 'initial' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: '4px 0 0 0' }}>
          {language === 'id' ? 'Daftar Presensi Karyawan' : 'Employee Attendance List'}
        </h3>

        {/* Search Input Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '8px 12px',
            gap: '8px',
          }}
        >
          <MagnifyingGlass size={18} color="#64748B" />
          <input
            type="text"
            value={employeeSearchQuery}
            onChange={(e) => setEmployeeSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari nama karyawan atau divisi...' : 'Search employee name or dept...'}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.8125rem',
              color: '#334155',
              width: '100%',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {employeeSearchQuery && (
            <button
              type="button"
              onClick={() => setEmployeeSearchQuery('')}
              style={{
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* Department Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'ALL', label: language === 'id' ? 'Semua Dept' : 'All Depts' },
            { id: 'Engineering', label: 'Engineering' },
            { id: 'Housekeeping', label: 'Housekeeping' },
            { id: 'Security', label: 'Security' },
            { id: 'Management', label: 'Management' },
          ].map((tab) => {
            const isActive = employeeDeptFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEmployeeDeptFilter(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #02388A' : '1px solid #E2E8F0',
                  backgroundColor: isActive ? '#02388A' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'ALL', label: language === 'id' ? 'Semua Status' : 'All Status' },
            { id: 'ONTIME', label: language === 'id' ? 'Tepat' : 'On Time' },
            { id: 'LATE', label: language === 'id' ? 'Terlambat' : 'Late' },
            { id: 'LEAVE', label: language === 'id' ? 'Izin' : 'Leave' },
            { id: 'ALPHA', label: 'Alpha' },
          ].map((tab) => {
            const isActive = employeeStatusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEmployeeStatusFilter(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #475569' : '1px solid #E2E8F0',
                  backgroundColor: isActive ? '#334155' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Employee Cards List */}
        {filteredEmployees.length === 0 ? (
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
              {language === 'id' ? 'Tidak Ada Karyawan Ditemukan' : 'No Employees Found'}
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
              {language === 'id'
                ? 'Tidak ada data presensi karyawan yang cocok dengan filter atau pencarian Anda.'
                : 'There are no employee attendance records matching your search or filter.'}
            </p>
          </div>
        ) : (
          filteredEmployees.map((emp) => {
            const isLate = emp.status === 'LATE';
            const isAlpha = emp.status === 'ALPHA';
            const isLeave = emp.status === 'LEAVE';
            const isOntime = emp.status === 'ONTIME';

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
            } else if (isLeave) {
              cardBg = '#F1F5F9';
              cardBorder = '1px solid #E2E8F0';
              tileBg = '#FFFFFF';
              tileBorder = '1px solid #E2E8F0';
            }

            return (
              <div
                key={emp.id}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: '14px',
                  border: cardBorder,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {/* Top: Avatar, Name, Dept & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: emp.avatarBg,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {emp.initials}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                        {emp.name}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                        {emp.dept} • {emp.role}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {renderEmployeeBadges(emp)}
                </div>

                {/* Clock In & Out Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    backgroundColor: tileBg,
                    border: tileBorder,
                    borderRadius: '10px',
                    padding: '8px 12px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                      {language === 'id' ? 'Masuk' : 'Clock In'}
                    </span>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                      {emp.clockIn || '-- : --'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                      {language === 'id' ? 'Keluar' : 'Clock Out'}
                    </span>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                      {emp.clockOut || '-- : --'}
                    </div>
                  </div>
                </div>

                {/* Footer Shift & Duration */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                    {emp.shift}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#334155', flexShrink: 0 }}>
                    {language === 'id' ? `Durasi: ${emp.duration || '--'}` : `Duration: ${emp.duration || '--'}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  )}

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

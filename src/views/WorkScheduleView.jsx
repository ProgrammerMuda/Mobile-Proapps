import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CaretDown,
  CalendarBlank,
  CalendarCheck,
  CalendarDots,
  Clock,
  MapPin,
  Briefcase,
  ArrowsLeftRight,
  UserSwitch,
  Funnel,
  MagnifyingGlass,
  CheckCircle,
  Buildings,
  Info,
  Sun,
  Moon,
  CloudSun,
  Coffee,
  X,
  Calendar,
  ListBullets,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

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

// Helper to generate schedules for any given month & year
const generateMonthSchedules = (year, monthIndex, includePast = false) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const schedules = [];

  const shiftTemplates = [
    {
      shiftType: 'MORNING',
      shiftNameId: 'Shift Pagi',
      shiftNameEn: 'Morning Shift',
      hours: '08:00 - 17:00 WIB',
      locationId: 'Gedung Utama • Ruang MEP',
      locationEn: 'Main Building • MEP Room',
      roleId: 'Engineering On-Duty • Preventive Daily',
      roleEn: 'Engineering On-Duty • Daily Preventive',
      notesId: 'Pemeriksaan rutin panel listrik utama dan chiller lantai dasar.',
      notesEn: 'Routine inspection of main electrical panel and ground floor chiller.',
    },
    {
      shiftType: 'AFTERNOON',
      shiftNameId: 'Shift Siang',
      shiftNameEn: 'Afternoon Shift',
      hours: '13:00 - 21:00 WIB',
      locationId: 'Tower A & Basement 1',
      locationEn: 'Tower A & Basement 1',
      roleId: 'MEP Standby & Genset Check',
      roleEn: 'MEP Standby & Genset Check',
      notesId: 'Standby operasional genset & pemeriksaan pompa transfer air.',
      notesEn: 'Genset operational standby & water transfer pump inspection.',
    },
    {
      shiftType: 'MORNING',
      shiftNameId: 'Shift Pagi',
      shiftNameEn: 'Morning Shift',
      hours: '08:00 - 17:00 WIB',
      locationId: 'Tower B • Lantai 1 - 15',
      locationEn: 'Tower B • Floors 1 - 15',
      roleId: 'Lift & Elevator Maintenance',
      roleEn: 'Lift & Elevator Maintenance',
      notesId: 'Maintenance berkala elevator penumpang nomor 3 dan 4 bersama vendor.',
      notesEn: 'Periodic maintenance of passenger elevators #3 & #4 with vendor.',
    },
    {
      shiftType: 'NIGHT',
      shiftNameId: 'Shift Malam',
      shiftNameEn: 'Night Shift',
      hours: '20:00 - 05:00 WIB',
      locationId: 'Pos Kontrol MEP & STP',
      locationEn: 'MEP Control & STP Area',
      roleId: 'Night Security & System Watch',
      roleEn: 'Night Security & System Watch',
      notesId: 'Patroli berkala sistem mekanikal malam hari dan monitoring aerasi STP.',
      notesEn: 'Periodic night mechanical patrol and STP aeration monitoring.',
    },
    {
      shiftType: 'AFTERNOON',
      shiftNameId: 'Shift Siang',
      shiftNameEn: 'Afternoon Shift',
      hours: '13:00 - 21:00 WIB',
      locationId: 'Gardu Trafo & Area Luar',
      locationEn: 'Transformer Substation & Outdoor',
      roleId: 'Trafo Temperature & Load Audit',
      roleEn: 'Transformer Temperature & Load Audit',
      notesId: 'Audit termal suhu busbar trafo dan pengujian otomatis PJU kawasan.',
      notesEn: 'Busbar thermal audit and perimeter lighting auto-switching test.',
    },
  ];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, monthIndex, d);
    const dayOfWeek = dateObj.getDay();
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayNameId = DAY_NAMES_ID[dayOfWeek];
    const dayNameEn = DAY_NAMES[dayOfWeek];
    const formattedDateId = `${String(d).padStart(2, '0')} ${MONTH_SHORT_ID[monthIndex]} ${year}`;
    const formattedDateEn = `${String(d).padStart(2, '0')} ${MONTH_SHORT[monthIndex]} ${year}`;

    // For current month (October 2026), show only upcoming schedules starting today
    let badge = 'UPCOMING';
    if (year === 2026 && monthIndex === 9) {
      if (d < 7) {
        if (!includePast) continue;
        badge = 'PAST';
      } else if (d === 7) {
        badge = 'TODAY';
      } else if (d === 8) {
        badge = 'TOMORROW';
      }
    }

    // Weekends (Saturday=6, Sunday=0) are Day Off in standard rotation
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      schedules.push({
        id: `SCH-${dateStr}`,
        date: dateStr,
        dayNameId,
        dayNameEn,
        formattedDateId,
        formattedDateEn,
        shiftType: 'DAY_OFF',
        shiftNameId: 'Tidak Ada Jadwal',
        shiftNameEn: 'No Schedule',
        hours: '-',
        locationId: '-',
        locationEn: '-',
        roleId: 'Off Duty (Istirahat)',
        roleEn: 'Off Duty (Rest)',
        badge: 'DAY_OFF',
        notesId: 'Tidak ada jadwal kerja.',
        notesEn: 'No scheduled shift.',
      });
    } else {
      const template = shiftTemplates[(d + monthIndex) % shiftTemplates.length];
      schedules.push({
        id: `SCH-${dateStr}`,
        date: dateStr,
        dayNameId,
        dayNameEn,
        formattedDateId,
        formattedDateEn,
        ...template,
        badge,
      });
    }
  }

  return schedules;
};

export const WorkScheduleView = ({ onBack, user, onNavigateChangeShift }) => {
  const { language } = useLanguage();
  const isId = language === 'id';

  // View mode: 'LIST' or 'CALENDAR'
  const [viewMode, setViewMode] = useState('LIST');

  // Month & Year state (default to October 2026, monthIndex = 9)
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);

  const monthLabel = isId ? MONTH_NAMES_ID[selectedMonth] : MONTH_NAMES[selectedMonth];

  // Selected date in Calendar view (defaults to Today: 2026-10-07)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-10-07');

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'WORK' | 'DAY_OFF'
  const [searchQuery, setSearchQuery] = useState('');

  // Sync picker year when modal opens
  useEffect(() => {
    if (isMonthPickerOpen) {
      setPickerYear(selectedYear);
    }
  }, [isMonthPickerOpen, selectedYear]);

  // Navigate prev/next month
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  // Full monthly schedules (including past dates for calendar matrix)
  const fullMonthSchedules = useMemo(() => {
    return generateMonthSchedules(selectedYear, selectedMonth, true);
  }, [selectedYear, selectedMonth]);

  // List view monthly schedules
  const monthlySchedules = useMemo(() => {
    return generateMonthSchedules(selectedYear, selectedMonth, false);
  }, [selectedYear, selectedMonth]);

  // Selected schedule item in Calendar view
  const selectedScheduleItem = useMemo(() => {
    return (
      fullMonthSchedules.find((s) => s.date === selectedCalendarDate) ||
      fullMonthSchedules[0] ||
      null
    );
  }, [fullMonthSchedules, selectedCalendarDate]);

  // First day of month index for calendar grid padding
  const firstDayOfMonthIndex = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 1).getDay();
  }, [selectedYear, selectedMonth]);

  // Helper to test if a schedule item matches user search query (date or shift)
  const checkItemMatchesQuery = (item, query) => {
    if (!query || !query.trim()) return true;
    const q = query.toLowerCase().trim();
    const dNum = parseInt(item.date.split('-')[2], 10).toString();
    const dNumPadded = item.date.split('-')[2];
    const title = (isId ? item.shiftNameId : item.shiftNameEn).toLowerCase();
    const dateStr = (isId ? item.formattedDateId : item.formattedDateEn).toLowerCase();
    const dayName = (isId ? item.dayNameId : item.dayNameEn).toLowerCase();
    const role = (isId ? item.roleId : item.roleEn).toLowerCase();
    const loc = (isId ? item.locationId : item.locationEn).toLowerCase();
    const shiftType = (item.shiftType || '').toLowerCase();

    // Check direct day number match (e.g. "7", "07", "15", "tgl 15", "tanggal 15")
    const isDirectDayMatch =
      q === dNum ||
      q === dNumPadded ||
      q === `tgl ${dNum}` ||
      q === `tgl ${dNumPadded}` ||
      q === `tanggal ${dNum}` ||
      q === `tanggal ${dNumPadded}` ||
      dateStr.startsWith(q) ||
      dateStr.includes(q);

    // Check shift keywords in Indonesian and English
    const isMorning =
      (q.includes('pagi') || q.includes('morn') || q.includes('morning')) &&
      item.shiftType === 'MORNING';

    const isAfternoon =
      (q.includes('siang') || q.includes('noon') || q.includes('afternoon')) &&
      item.shiftType === 'AFTERNOON';

    const isNight =
      (q.includes('malam') || q.includes('night')) &&
      item.shiftType === 'NIGHT';

    const isOffDay =
      (q.includes('off') || q.includes('libur') || q.includes('rest') || q.includes('tidak ada') || q.includes('no schedule')) &&
      item.shiftType === 'DAY_OFF';

    return (
      isDirectDayMatch ||
      isMorning ||
      isAfternoon ||
      isNight ||
      isOffDay ||
      title.includes(q) ||
      dayName.includes(q) ||
      role.includes(q) ||
      loc.includes(q) ||
      shiftType.includes(q)
    );
  };

  // Auto-focus and select first matching date when searching in Calendar View
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) return;

    const matchingItems = fullMonthSchedules.filter((item) => checkItemMatchesQuery(item, q));
    if (matchingItems.length > 0) {
      const isAlreadySelected = matchingItems.some((item) => item.date === selectedCalendarDate);
      if (!isAlreadySelected) {
        setSelectedCalendarDate(matchingItems[0].date);
      }
    }
  }, [searchQuery, fullMonthSchedules]);

  const filteredSchedules = useMemo(() => {
    return monthlySchedules.filter((item) => {
      const matchFilter =
        activeFilter === 'ALL'
          ? true
          : activeFilter === 'WORK'
          ? item.shiftType !== 'DAY_OFF'
          : item.shiftType === 'DAY_OFF';

      const matchQuery = checkItemMatchesQuery(item, searchQuery);
      return matchFilter && matchQuery;
    });
  }, [monthlySchedules, activeFilter, searchQuery, isId]);

  const workShiftCount = monthlySchedules.filter((s) => s.shiftType !== 'DAY_OFF').length;
  const dayOffCount = monthlySchedules.filter((s) => s.shiftType === 'DAY_OFF').length;

  const getShiftIcon = (type) => {
    switch (type) {
      case 'MORNING':
        return <Sun size={20} weight="fill" color="#D97706" />;
      case 'AFTERNOON':
        return <CloudSun size={20} weight="fill" color="#EA580C" />;
      case 'NIGHT':
        return <Moon size={20} weight="fill" color="#4F46E5" />;
      case 'DAY_OFF':
        return <Coffee size={20} weight="fill" color="#64748B" />;
      default:
        return <Clock size={20} weight="bold" color="#09B2FF" />;
    }
  };

  const getShiftTheme = (type) => {
    switch (type) {
      case 'MORNING':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          pillBg: '#FEF3C7',
          pillText: '#B45309',
        };
      case 'AFTERNOON':
        return {
          bg: '#FFF7ED',
          border: '#FED7AA',
          pillBg: '#FFEDD5',
          pillText: '#C2410C',
        };
      case 'NIGHT':
        return {
          bg: '#EEF2FF',
          border: '#C7D2FE',
          pillBg: '#E0E7FF',
          pillText: '#4338CA',
        };
      case 'DAY_OFF':
        return {
          bg: '#F8FAFC',
          border: '#E2E8F0',
          pillBg: '#F1F5F9',
          pillText: '#475569',
        };
      default:
        return {
          bg: '#F8FAFC',
          border: '#E2E8F0',
          pillBg: '#E2E8F0',
          pillText: '#334155',
        };
    }
  };

  const getBadgePill = (badge, shiftType) => {
    if (badge === 'TODAY') {
      return (
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 800,
            padding: '1.5px 7px',
            borderRadius: '999px',
            backgroundColor: '#02388A',
            color: '#FFFFFF',
            border: '1px solid #02388A',
            display: 'inline-flex',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(2, 56, 138, 0.2)',
          }}
        >
          Today
        </span>
      );
    }
    if (shiftType === 'DAY_OFF') {
      return (
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            padding: '1.5px 6.5px',
            borderRadius: '999px',
            backgroundColor: '#F1F5F9',
            color: '#64748B',
            border: '1px solid #E2E8F0',
          }}
        >
          Off Day
        </span>
      );
    }
    return (
      <span
        style={{
          fontSize: '9.5px',
          fontWeight: 700,
          padding: '1.5px 6.5px',
          borderRadius: '999px',
          backgroundColor: '#FFF7ED',
          color: '#EA580C',
          border: '1px solid #FFEDD5',
        }}
      >
        Upcoming
      </span>
    );
  };

  const renderScheduleCard = (item) => {
    if (!item) return null;
    const theme = getShiftTheme(item.shiftType);
    const isToday = item.badge === 'TODAY';
    const isDayOff = item.shiftType === 'DAY_OFF';
    const dayAbbr = (isId ? item.dayNameId : item.dayNameEn).substring(0, 3).toUpperCase();
    const dayNum = item.date.split('-')[2];
    const monthAbbr = isId ? MONTH_SHORT_ID[selectedMonth] : MONTH_SHORT[selectedMonth];

    return (
      <div
        key={item.id}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: isToday ? '1.5px solid #02388A' : '1px solid #E2E8F0',
          padding: '11px 13px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: isToday ? '0 3px 12px rgba(2, 56, 138, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
          transition: 'all 0.15s ease',
        }}
      >
        {/* Left: Modern Calendar Date Ticket */}
        <div
          style={{
            width: '52px',
            borderRadius: '10px',
            backgroundColor: isToday ? '#EFF6FF' : isDayOff ? '#F8FAFC' : '#FFFFFF',
            border: isToday ? '1.5px solid #02388A' : isDayOff ? '1px solid #F1F5F9' : '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Day Tag Banner */}
          <div
            style={{
              width: '100%',
              padding: '4px 0',
              textAlign: 'center',
              backgroundColor: isToday ? '#02388A' : isDayOff ? '#F1F5F9' : '#EAF7FF',
              color: isToday ? '#FFFFFF' : isDayOff ? '#94A3B8' : '#02388A',
              fontSize: '9.5px',
              fontWeight: 800,
              letterSpacing: '0.4px',
              lineHeight: 1,
            }}
          >
            {dayAbbr}
          </div>

          {/* Date Number & Month */}
          <div
            style={{
              padding: '6px 0 7px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: 900,
                color: isToday ? '#02388A' : isDayOff ? '#94A3B8' : '#0F172A',
                lineHeight: 1.1,
              }}
            >
              {dayNum}
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: isToday ? '#02388A' : isDayOff ? '#CBD5E1' : '#64748B',
                lineHeight: 1,
              }}
            >
              {monthAbbr}
            </span>
          </div>
        </div>

        {/* Right: Shift Info Container */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          {/* Left Column: Status Badge (Top) -> Shift Name (Middle) -> Hours (Bottom) */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3.5px' }}>
            {/* Top: Status Badge */}
            <div>
              {getBadgePill(item.badge, item.shiftType)}
            </div>

            {/* Middle: Shift Name */}
            <span
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#1E293B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.25,
              }}
            >
              {isId ? item.shiftNameId : item.shiftNameEn}
            </span>

            {/* Bottom: Working Hours or Day Off Description */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {!isDayOff ? (
                <>
                  <Clock size={14} weight="bold" color="#09B2FF" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                    {item.hours}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#94A3B8' }}>
                  {isId ? 'Libur berkala mingguan' : 'Weekly scheduled rest'}
                </span>
              )}
            </div>
          </div>

          {/* Right: Enlarged Shift Icon Badge Vertically Centered */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: theme.bg,
              border: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getShiftIcon(item.shiftType)}
          </div>
        </div>
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
        fontFamily: 'inherit',
      }}
    >
      {/* Header matching Report Attendance */}
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
          position: 'sticky',
          top: 0,
        }}
      >
        {/* 1. Title Row (Centered Title with CTA View Toggle) */}
        <div
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '52px',
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
            {isId ? 'Work Schedule' : 'Work Schedule'}
          </h1>

          <div style={{ width: '32px' }} />
        </div>

        {/* 2. Date/Period Navigator Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '2px 16px 14px 16px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            type="button"
            onClick={handlePrevMonth}
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
            onClick={() => setIsMonthPickerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              flex: 1,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <CalendarBlank size={18} weight="fill" color="#053079" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {monthLabel} {selectedYear}
            </span>
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
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

      {/* 3. Main Scroll Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Top Summary Widget */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#EAF7FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#09B2FF',
                }}
              >
                <Briefcase size={18} weight="fill" />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.2px' }}>
                  {isId ? 'Ringkasan Roster Shift' : 'Shift Roster Summary'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                  {monthLabel} {selectedYear} • {monthlySchedules.length} {isId ? 'Hari Roster' : 'Days Total'}
                </div>
              </div>
            </div>
          </div>

          {/* 2 Duotone Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {/* Card 1: Working Days */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                padding: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <CalendarCheck size={20} weight="fill" color="#02388A" />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#02388A',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >
                  {Math.round((workShiftCount / (monthlySchedules.length || 1)) * 100)}%
                </span>
              </div>

              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>
                  {workShiftCount} <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Hari</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>
                  {isId ? 'Hari Kerja' : 'Working Days'}
                </div>
              </div>
            </div>

            {/* Card 2: Off Days */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                padding: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Coffee size={20} weight="fill" color="#64748B" />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#64748B',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >
                  {Math.round((dayOffCount / (monthlySchedules.length || 1)) * 100)}%
                </span>
              </div>

              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>
                  {dayOffCount} <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Hari</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>
                  {isId ? 'Hari Libur' : 'Off Days'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & View Mode Toggle CTA Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search Box */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '0 12px',
              gap: '8px',
              height: '42px',
              boxSizing: 'border-box',
            }}
          >
            <MagnifyingGlass size={18} color="#64748B" weight="bold" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isId ? 'Cari tanggal atau shift...' : 'Search date or shift...'}
              style={{
                border: 'none',
                outline: 'none',
                padding: '0 2px',
                margin: 0,
                boxShadow: 'none',
                flex: 1,
                minWidth: 0,
                height: '100%',
                fontSize: '13px',
                color: '#1E293B',
                backgroundColor: 'transparent',
                fontFamily: 'inherit',
                lineHeight: 'normal',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#94A3B8',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>

          {/* CTA Toggle: Calendar View vs Card List View */}
          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === 'LIST' ? 'CALENDAR' : 'LIST'))}
            aria-label={viewMode === 'LIST' ? 'Switch to Calendar View' : 'Switch to List View'}
            title={viewMode === 'LIST' ? (isId ? 'Lihat Tampilan Kalender' : 'Switch to Calendar View') : (isId ? 'Lihat Tampilan Daftar' : 'Switch to List View')}
            style={{
              height: '42px',
              padding: '0 14px',
              borderRadius: '12px',
              backgroundColor: '#02388A',
              border: '1px solid #02388A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 6px rgba(2, 56, 138, 0.22)',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            {viewMode === 'LIST' ? (
              <>
                <CalendarDots size={19} weight="bold" color="#FFFFFF" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
                  {isId ? 'Kalender' : 'Calendar'}
                </span>
              </>
            ) : (
              <>
                <ListBullets size={19} weight="bold" color="#FFFFFF" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
                  {isId ? 'Daftar' : 'List'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* VIEW MODE 1: LIST VIEW */}
        {viewMode === 'LIST' && (
          <>
            {/* Quick Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                {[
                  { id: 'ALL', labelId: 'Semua Jadwal', labelEn: 'All Schedules', count: monthlySchedules.length },
                  { id: 'WORK', labelId: 'Shift Kerja', labelEn: 'Working Shifts', count: workShiftCount },
                  { id: 'DAY_OFF', labelId: 'Off Days', labelEn: 'Off Days', count: dayOffCount },
                ].map((f) => {
                  const active = activeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFilter(f.id)}
                      style={{
                        backgroundColor: active ? '#02388A' : '#FFFFFF',
                        color: active ? '#FFFFFF' : '#475569',
                        border: `1px solid ${active ? '#02388A' : '#E2E8F0'}`,
                        borderRadius: '999px',
                        padding: '6px 12px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{isId ? f.labelId : f.labelEn}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                          color: active ? '#FFFFFF' : '#64748B',
                          fontWeight: 800,
                        }}
                      >
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>

            {/* Schedule List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredSchedules.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#94A3B8',
                    }}
                  >
                    <CalendarBlank size={24} weight="bold" />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    {isId ? 'Tidak ada jadwal ditemukan' : 'No schedules found'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', maxWidth: '240px' }}>
                    {isId ? 'Coba ubah kata kunci pencarian atau filter Anda.' : 'Try changing your search keyword or active filter.'}
                  </div>
                </div>
              ) : (
                filteredSchedules.map((item) => renderScheduleCard(item))
              )}
            </div>
          </>
        )}

        {/* VIEW MODE 2: CALENDAR VIEW */}
        {viewMode === 'CALENDAR' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Calendar Grid Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Day of Week Headers */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  borderBottom: '1px solid #F1F5F9',
                  paddingBottom: '8px',
                }}
              >
                {(isId ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map((d, i) => (
                  <span
                    key={d}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: i === 0 || i === 6 ? '#EF4444' : '#64748B',
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Monthly Matrix Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '4px',
                  rowGap: '6px',
                }}
              >
                {/* Empty cells before 1st day of month */}
                {Array.from({ length: firstDayOfMonthIndex }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ height: '44px' }} />
                ))}

                {/* Day cells 1..daysInMonth */}
                {fullMonthSchedules.map((dayItem) => {
                  const dNum = parseInt(dayItem.date.split('-')[2], 10);
                  const isSelected = selectedCalendarDate === dayItem.date;
                  const isToday = dayItem.date === '2026-10-07';
                  const isDayOff = dayItem.shiftType === 'DAY_OFF';

                  const hasQuery = searchQuery.trim().length > 0;
                  const isMatched = checkItemMatchesQuery(dayItem, searchQuery);

                  let dotColor = '#EAB308'; // Morning (Kuning)
                  if (dayItem.shiftType === 'AFTERNOON') dotColor = '#EA580C';
                  else if (dayItem.shiftType === 'NIGHT') dotColor = '#4F46E5';
                  else if (dayItem.shiftType === 'DAY_OFF') dotColor = '#94A3B8';

                  // Only show dot if no search query, OR if this day matches the searched shift/query
                  const showDot = hasQuery ? isMatched : true;

                  return (
                    <button
                      key={dayItem.date}
                      type="button"
                      onClick={() => setSelectedCalendarDate(dayItem.date)}
                      style={{
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: isSelected
                          ? '#02388A'
                          : isToday
                          ? '#EFF6FF'
                          : hasQuery && isMatched
                          ? '#F0FDF4'
                          : '#F8FAFC',
                        border: isSelected
                          ? '1.5px solid #02388A'
                          : isToday
                          ? '1.5px solid #02388A'
                          : hasQuery && isMatched
                          ? '1.5px solid #16A34A'
                          : '1px solid #F1F5F9',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: '2px 0',
                        gap: '3px',
                        outline: 'none',
                        opacity: hasQuery && !isMatched ? 0.28 : 1,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: isSelected || isToday || (hasQuery && isMatched) ? 800 : 600,
                          color: isSelected
                            ? '#FFFFFF'
                            : isToday
                            ? '#02388A'
                            : hasQuery && isMatched
                            ? '#15803D'
                            : isDayOff
                            ? '#94A3B8'
                            : '#1E293B',
                          lineHeight: 1,
                        }}
                      >
                        {dNum}
                      </span>

                      {/* Shift indicator dot - only shown for searched shift / matching days */}
                      <div
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? '#FFFFFF' : dotColor,
                          visibility: showDot ? 'visible' : 'hidden',
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Legend Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingTop: '8px',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                {[
                  { label: isId ? 'Pagi' : 'Morning', color: '#EAB308' },
                  { label: isId ? 'Siang' : 'Afternoon', color: '#EA580C' },
                  { label: isId ? 'Malam' : 'Night', color: '#4F46E5' },
                  { label: isId ? 'Off Day' : 'Off Day', color: '#94A3B8' },
                ].map((leg) => (
                  <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: leg.color }} />
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B' }}>
                      {leg.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Date Shift Card Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E293B' }}>
                  {isId ? 'Detail Jadwal Terpilih' : 'Selected Schedule Details'}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#02388A' }}>
                  {selectedScheduleItem ? (isId ? selectedScheduleItem.formattedDateId : selectedScheduleItem.formattedDateEn) : ''}
                </span>
              </div>

              {selectedScheduleItem ? (
                renderScheduleCard(selectedScheduleItem)
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8', fontSize: '12px' }}>
                  {isId ? 'Pilih tanggal di kalender untuk melihat jadwal' : 'Select a date on the calendar to view schedule'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Month & Year Picker Bottom Sheet Modal */}
      {isMonthPickerOpen && (() => {
        const modalTarget = typeof document !== 'undefined'
          ? document.getElementById('phone-screen-container') || document.querySelector('.android-device-screen') || document.body
          : null;

        if (!modalTarget) return null;

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
            onClick={() => setIsMonthPickerOpen(false)}
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

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', margin: 0 }}>
                  {isId ? 'Pilih Periode Bulan' : 'Select Month Period'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMonthPickerOpen(false)}
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

              {/* Year Selector */}
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
                  onClick={() => setPickerYear((y) => y - 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{pickerYear}</span>
                <button
                  type="button"
                  onClick={() => setPickerYear((y) => y + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12-Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const isSelected = selectedMonth === i && selectedYear === pickerYear;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(i);
                        setSelectedYear(pickerYear);
                        setIsMonthPickerOpen(false);
                      }}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#02388A' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isId ? MONTH_NAMES_ID[i] : MONTH_NAMES[i]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

        return createPortal(modalElement, modalTarget);
      })()}
    </div>
  );
};

export default WorkScheduleView;

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CalendarBlank,
  X,
} from '@phosphor-icons/react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

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

// Department Breakdown Data
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
    status: 'normal',
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
    status: 'normal',
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
    status: 'normal',
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
    status: 'normal',
  },
];

/**
 * Attendance Detail Header Bar with Attached Date Filter
 */
export const AttendanceDetailHeader = ({
  onBack,
  currentDate = new Date(2026, 6, 7),
  onPrevDay,
  onNextDay,
  onOpenPicker,
}) => {
  const safeDate = currentDate instanceof Date && !isNaN(currentDate) ? currentDate : new Date(2026, 6, 7);
  const formattedDateStr = `${DAY_NAMES[safeDate.getDay()]}, ${MONTH_SHORT[safeDate.getMonth()]} ${safeDate.getDate()}, ${safeDate.getFullYear()}`;

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
      {/* 1. Title Row */}
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
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
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}
        >
          Attendance Details
        </h1>
      </div>

      {/* 2. Date Navigator Filter Row (Attached to Title Bar) */}
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
          onClick={onPrevDay}
          aria-label="Previous day"
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
            color: '#1E293B',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            flex: 1,
            boxShadow: 'none',
          }}
        >
          <CalendarBlank size={18} weight="fill" color="#053079" />
          <span>{formattedDateStr}</span>
        </button>

        <button
          type="button"
          onClick={onNextDay}
          aria-label="Next day"
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
 * Mini Department Donut Chart Component
 */
const DepartmentDonutChart = ({ present, late, leave, absent, percentage }) => {
  const total = present + late + leave + absent;
  const radius = 32;
  const circumference = 2 * Math.PI * radius; // ~201.06
  const strokeWidth = 12;

  const presentDash = (present / total) * circumference;
  const lateDash = (late / total) * circumference;
  const leaveDash = (leave / total) * circumference;
  const absentDash = (absent / total) * circumference;

  return (
    <div
      style={{
        position: 'relative',
        width: '84px',
        height: '84px',
        flexShrink: 0,
      }}
    >
      <svg
        width="84"
        height="84"
        viewBox="0 0 88 88"
        style={{
          transform: 'rotate(-90deg)',
          overflow: 'visible',
          animation: 'chartFadeIn 0.35s ease-out',
        }}
      >
        {/* Present (Green #10B981) */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeDasharray={`${presentDash} ${circumference}`}
          strokeDashoffset={0}
        />
        {/* Late (Orange #F59E0B) */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={`${lateDash} ${circumference}`}
          strokeDashoffset={-presentDash}
        />
        {/* Leave (Cyan/Blue #09B2FF) */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#09B2FF"
          strokeWidth={strokeWidth}
          strokeDasharray={`${leaveDash} ${circumference}`}
          strokeDashoffset={-(presentDash + lateDash)}
        />
        {/* Absent (Red #EF4444) */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#EF4444"
          strokeWidth={strokeWidth}
          strokeDasharray={`${absentDash} ${circumference}`}
          strokeDashoffset={-(presentDash + lateDash + leaveDash)}
        />
      </svg>

      {/* Center Percentage Label */}
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
        <span
          style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: '#334155',
            letterSpacing: '-0.3px',
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
};

/**
 * Attendance Detail Main View
 */
export const AttendanceDetailView = ({
  currentDate = new Date(2026, 6, 7),
  onDateChange,
  isPickerOpen = false,
  setIsPickerOpen,
}) => {
  const safeDate = currentDate instanceof Date && !isNaN(currentDate) ? currentDate : new Date(2026, 6, 7);

  // Date picker calendar state
  const [pickerYear, setPickerYear] = useState(safeDate.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(safeDate.getMonth()); // 0 = Jan, 6 = Jul
  const [selectedDay, setSelectedDay] = useState(safeDate.getDate());

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear((y) => y - 1);
    } else {
      setPickerMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear((y) => y + 1);
    } else {
      setPickerMonth((m) => m + 1);
    }
  };

  const handleApplyDate = () => {
    const newDate = new Date(pickerYear, pickerMonth, selectedDay);
    if (onDateChange) {
      onDateChange(newDate);
    }
    if (setIsPickerOpen) {
      setIsPickerOpen(false);
    }
  };

  // Calendar Grid Calculation
  const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();
  const prevMonthDaysCount = new Date(pickerYear, pickerMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const pMonth = pickerMonth === 0 ? 11 : pickerMonth - 1;
    const pYear = pickerMonth === 0 ? pickerYear - 1 : pickerYear;
    calendarDays.push({
      day: prevMonthDaysCount - i,
      month: pMonth,
      year: pYear,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      month: pickerMonth,
      year: pickerYear,
      isCurrentMonth: true,
    });
  }

  // Next month leading days
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nMonth = pickerMonth === 11 ? 0 : pickerMonth + 1;
    const nYear = pickerMonth === 11 ? pickerYear + 1 : pickerYear;
    calendarDays.push({
      day: d,
      month: nMonth,
      year: nYear,
      isCurrentMonth: false,
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        padding: '16px 16px 36px 16px',
        gap: '20px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* 1. Top Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {/* Present */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: 'none',
          }}
        >
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>
            Present
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span
              style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                color: '#10B981',
                lineHeight: 1,
                letterSpacing: '-0.3px',
              }}
            >
              101
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#94A3B8',
              }}
            >
              /218
            </span>
          </div>
        </div>

        {/* Late */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: 'none',
          }}
        >
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>
            Late
          </span>
          <span
            style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#F59E0B',
              lineHeight: 1,
              letterSpacing: '-0.3px',
            }}
          >
            17
          </span>
        </div>

        {/* Absent */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: 'none',
          }}
        >
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>
            Absent
          </span>
          <span
            style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#EF4444',
              lineHeight: 1,
              letterSpacing: '-0.3px',
            }}
          >
            117
          </span>
        </div>
      </div>

      {/* 2. Section: Attendance by department (Overall progress card) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#1E293B',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Attendance by department
        </h2>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'none',
          }}
        >
          {DEPARTMENTS_DATA.map((dept) => {
            const ratioPercent = Math.round((dept.present / dept.totalAssigned) * 100);
            return (
              <div
                key={dept.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {/* Top: Name & Ratio */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#334155',
                    }}
                  >
                    {dept.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#64748B',
                    }}
                  >
                    {dept.present}/{dept.totalAssigned}
                  </span>
                </div>

                {/* Bottom: Progress Bar */}
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
                      width: `${ratioPercent}%`,
                      height: '100%',
                      backgroundColor: '#09B2FF',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease-out',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Detailed Department Cards */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {DEPARTMENTS_DATA.map((dept) => {
          return (
            <div
              key={dept.id}
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
              {/* Header Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#1E293B',
                    margin: 0,
                    letterSpacing: '-0.2px',
                  }}
                >
                  {dept.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#10B981',
                    }}
                  >
                    {dept.percentage}%
                  </span>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: '#94A3B8',
                    }}
                  >
                    present
                  </span>
                </div>
              </div>

              {/* Content Row: Donut Chart & 2-Column Legend */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {/* Donut Chart */}
                <DepartmentDonutChart
                  present={dept.present}
                  late={dept.late}
                  leave={dept.leave}
                  absent={dept.absent}
                  percentage={dept.percentage}
                />

                {/* 2-Column Legend Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: '16px',
                    rowGap: '10px',
                    flex: 1,
                  }}
                >
                  {/* Item 1: Present */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
                        Present
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                      {dept.present}
                    </span>
                  </div>

                  {/* Item 2: Late */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#F59E0B',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
                        Late
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                      {dept.late}
                    </span>
                  </div>

                  {/* Item 3: Leave */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#09B2FF',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
                        Leave
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                      {dept.leave}
                    </span>
                  </div>

                  {/* Item 4: Absent */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#EF4444',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
                        Absent
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                      {dept.absent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. Date Picker Bottomsheet Modal */}
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
              borderRadius: 0,
              margin: 0,
              padding: 0,
              boxSizing: 'border-box',
            }}
            onClick={() => setIsPickerOpen && setIsPickerOpen(false)}
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
                gap: '14px',
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
                  paddingBottom: '2px',
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

              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#334155',
                    margin: 0,
                    letterSpacing: '-0.2px',
                  }}
                >
                  Select Date
                </h3>

                <button
                  type="button"
                  onClick={() => setIsPickerOpen && setIsPickerOpen(false)}
                  aria-label="Close date picker"
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
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Month & Year Navigation Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              >
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
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
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#334155',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {MONTH_NAMES[pickerMonth]} {pickerYear}
                </span>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
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

              {/* Calendar Grid Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Weekday Names */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    textAlign: 'center',
                  }}
                >
                  {WEEKDAYS.map((wd) => (
                    <span
                      key={wd}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#94A3B8',
                        padding: '4px 0',
                      }}
                    >
                      {wd}
                    </span>
                  ))}
                </div>

                {/* Day Numbers Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    rowGap: '6px',
                  }}
                >
                  {calendarDays.map((cell, idx) => {
                    const isSelected =
                      cell.isCurrentMonth &&
                      cell.day === selectedDay;

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (cell.isCurrentMonth) {
                              setSelectedDay(cell.day);
                            } else {
                              setPickerMonth(cell.month);
                              setPickerYear(cell.year);
                              setSelectedDay(cell.day);
                            }
                          }}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8125rem',
                            fontWeight: isSelected ? 700 : cell.isCurrentMonth ? 600 : 400,
                            backgroundColor: isSelected ? '#053079' : 'transparent',
                            color: isSelected
                              ? '#FFFFFF'
                              : cell.isCurrentMonth
                              ? '#334155'
                              : '#CBD5E1',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            outline: 'none',
                            padding: 0,
                            boxShadow: isSelected ? '0 2px 6px rgba(5, 48, 121, 0.25)' : 'none',
                          }}
                        >
                          {cell.day}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Indicator Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '8px',
                  border: '1px solid #DBEAFE',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                  Selected date:
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#053079', fontWeight: 700 }}>
                  {selectedDay} {MONTH_NAMES[pickerMonth]} {pickerYear}
                </span>
              </div>

              {/* Action Buttons Footer */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsPickerOpen && setIsPickerOpen(false)}
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
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApplyDate}
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
                  Apply
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

export default AttendanceDetailView;

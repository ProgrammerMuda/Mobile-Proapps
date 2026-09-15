import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CaretDown,
  X,
  CheckSquare,
  CalendarBlank,
  ArrowLeft,
  Wrench,
  ArrowsLeftRight,
  HardHat,
  FileText,
  CalendarCheck,
  House,
  Clock,
  Play,
  CheckCircle,
} from '@phosphor-icons/react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

const FILTER_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7_days', label: 'Last 7 days' },
  { id: 'this_month', label: 'This month' },
  { id: 'this_year', label: 'This year' },
  { id: 'last_year', label: 'Last year' },
];

const REQUEST_TYPES = [
  { id: 'wr', label: 'Work Request', count: 28, icon: Wrench, iconBg: '#EAF7FF', iconColor: '#09B2FF' },
  { id: 'gigo', label: 'GIGO', count: 21, icon: ArrowsLeftRight, iconBg: '#EAF7FF', iconColor: '#09B2FF' },
  { id: 'fitout', label: 'Fitout Permit', count: 14, icon: HardHat, iconBg: '#EAF7FF', iconColor: '#09B2FF' },
  { id: 'permit', label: 'Permit', count: 20, icon: FileText, iconBg: '#EAF7FF', iconColor: '#09B2FF' },
  { id: 'rsv', label: 'Reservation', count: 18, icon: CalendarCheck, iconBg: '#EAF7FF', iconColor: '#09B2FF' },
  { id: 'hs', label: 'Home Service', count: 12, icon: House, iconBg: '#EAF7FF', iconColor: '#09B2FF' },
];

/**
 * Request Detail Header Bar
 */
export const RequestDetailHeader = ({ onBack, period = 'Last 7 days', onOpenPicker }) => (
  <header
    style={{
      backgroundColor: '#FFFFFF',
      color: '#334155',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '52px',
      borderBottom: '1px solid #F1F5F9',
      flexShrink: 0,
      zIndex: 40,
      boxSizing: 'border-box',
      boxShadow: 'none',
    }}
  >
    {/* Left: Back Button & Title */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        Request Details
      </h1>
    </div>

    {/* Right: Period Filter Pill */}
    <button
      type="button"
      onClick={onOpenPicker}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        padding: '5px 12px',
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
      <span>{period}</span>
      <CaretDown size={14} weight="bold" color="#053079" />
    </button>
  </header>
);

/**
 * Status Proportion Donut Chart Component
 */
const StatusProportionDonut = ({ pending = 13, onProgress = 26, completed = 43 }) => {
  const total = pending + onProgress + completed; // 82
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeWidth = 26;

  const pendingDash = (pending / total) * circumference;
  const onProgressDash = (onProgress / total) * circumference;
  const completedDash = (completed / total) * circumference;

  return (
    <div style={{ position: 'relative', width: '156px', height: '156px', flexShrink: 0 }}>
      <svg
        width="156"
        height="156"
        viewBox="0 0 160 160"
        style={{
          transform: 'rotate(-90deg)',
          overflow: 'visible',
          animation: 'chartFadeIn 0.35s ease-out',
        }}
      >
        {/* Pending Arc (Orange #F59E0B) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={`${pendingDash} ${circumference}`}
          strokeDashoffset={0}
        />
        {/* On Progress Arc (Blue #09B2FF) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#09B2FF"
          strokeWidth={strokeWidth}
          strokeDasharray={`${onProgressDash} ${circumference}`}
          strokeDashoffset={-pendingDash}
        />
        {/* Completed Arc (Green #16A34A) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#16A34A"
          strokeWidth={strokeWidth}
          strokeDasharray={`${completedDash} ${circumference}`}
          strokeDashoffset={-(pendingDash + onProgressDash)}
        />
      </svg>

      {/* Center Label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          animation: 'chartFadeIn 0.3s ease-out',
        }}
      >
        <span
          style={{
            fontSize: '1.625rem',
            fontWeight: 800,
            color: '#334155',
            letterSpacing: '-0.4px',
            lineHeight: 1.1,
          }}
        >
          {total}
        </span>
        <span
          style={{
            fontSize: '0.6875rem',
            color: '#64748B',
            fontWeight: 500,
            marginTop: '3px',
          }}
        >
          Total requests
        </span>
      </div>
    </div>
  );
};

/**
 * Request Detail Main View
 */
export const RequestDetailView = ({
  period = 'Last 7 days',
  onPeriodChange,
  isPickerOpen,
  setIsPickerOpen,
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'custom_date'
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(6); // 0-indexed: 6 = July
  const [selectedDate, setSelectedDate] = useState({ year: 2026, month: 6, day: 14 });

  const handleSelectOption = (optLabel) => {
    if (onPeriodChange) {
      onPeriodChange(optLabel);
    }
    if (setIsPickerOpen) {
      setIsPickerOpen(false);
    }
  };

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

  const handleSelectCalendarDay = (cell) => {
    setSelectedDate({ year: cell.year, month: cell.month, day: cell.day });
    if (!cell.isCurrentMonth) {
      setPickerMonth(cell.month);
      setPickerYear(cell.year);
    }
  };

  const handleApplyCustomDate = () => {
    const formatted = `${selectedDate.day} ${MONTH_SHORT[selectedDate.month]} ${selectedDate.year}`;
    if (onPeriodChange) {
      onPeriodChange(formatted);
    }
    if (setIsPickerOpen) {
      setIsPickerOpen(false);
    }
    setViewMode('list');
  };

  const handleClose = () => {
    if (setIsPickerOpen) {
      setIsPickerOpen(false);
    }
    setViewMode('list');
  };

  // Calendar Day Grid Calculation
  const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay(); // 0: Sun ... 6: Sat
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
      {/* 1. Request by type Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Request by type
        </h2>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: 'none',
          }}
        >
          {REQUEST_TYPES.map((item, idx) => {
            const IconComp = item.icon;
            const isLast = idx === REQUEST_TYPES.length - 1;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                }}
              >
                {/* Left: Icon & Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: item.iconBg,
                      color: item.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={20} weight="fill" />
                  </div>
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#334155',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Right: Count */}
                <span
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 700,
                    color: '#334155',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Request by status Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Request by status
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {/* Card 1: Pending */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
              }}
            >
              <Clock size={18} weight="fill" />
            </div>
            <span
              style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                color: '#334155',
                lineHeight: 1.1,
                letterSpacing: '-0.4px',
              }}
            >
              13
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#64748B',
              }}
            >
              Pending
            </span>
          </div>

          {/* Card 2: On Progress */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
              }}
            >
              <Play size={16} weight="fill" />
            </div>
            <span
              style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                color: '#334155',
                lineHeight: 1.1,
                letterSpacing: '-0.4px',
              }}
            >
              26
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#64748B',
              }}
            >
              On Progress
            </span>
          </div>

          {/* Card 3: Completed */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
              }}
            >
              <CheckCircle size={18} weight="fill" />
            </div>
            <span
              style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                color: '#334155',
                lineHeight: 1.1,
                letterSpacing: '-0.4px',
              }}
            >
              43
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#64748B',
              }}
            >
              Completed
            </span>
          </div>
        </div>
      </section>

      {/* 3. Status Proportion Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Status proportion
        </h2>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '20px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: 'none',
          }}
        >
          {/* Donut Chart */}
          <StatusProportionDonut pending={13} onProgress={26} completed={43} />

          {/* Right Legend */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              paddingLeft: '6px',
            }}
          >
            {/* Pending Stat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                Pending
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#64748B',
                  marginLeft: 'auto',
                }}
              >
                13
              </span>
            </div>

            {/* On Progress Stat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#09B2FF',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                On Progress
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#64748B',
                  marginLeft: 'auto',
                }}
              >
                26
              </span>
            </div>

            {/* Completed Stat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                Completed
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#64748B',
                  marginLeft: 'auto',
                }}
              >
                43
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bottom Sheet Modal */}
      {isPickerOpen && (() => {
        const modalTarget = typeof document !== 'undefined'
          ? document.querySelector('.android-device-screen') || document.body
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
            onClick={handleClose}
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

              {viewMode === 'list' ? (
                /* Mode 1: Quick Filter Options List */
                <>
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
                        Select Period
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 400 }}>
                        Filter tenant requests
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
                      aria-label="Close filter"
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

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {FILTER_OPTIONS.map((opt) => {
                      const isSelected = period === opt.label;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(opt.label)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                            border: isSelected ? '1px solid #DBEAFE' : '1px solid transparent',
                            color: isSelected ? '#053079' : '#334155',
                            fontSize: '0.9375rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'var(--font-sans)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <CheckSquare size={20} weight="fill" color="#053079" />
                          )}
                        </button>
                      );
                    })}

                    <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 0' }} />

                    {/* Choose month... option */}
                    <button
                      type="button"
                      onClick={() => setViewMode('custom_month')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: '1px solid transparent',
                        color: '#334155',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CalendarBlank size={20} weight="bold" color="#64748B" />
                        <span>Custom date...</span>
                      </div>
                      <CaretRight size={16} weight="bold" color="#94A3B8" />
                    </button>
                  </div>
                </>
              ) : (
                /* Mode 2: Custom Date Picker (Calendar Grid) */
                <>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        aria-label="Back to options"
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
                        <ArrowLeft size={18} weight="bold" />
                      </button>
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
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
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
                          selectedDate.year === cell.year &&
                          selectedDate.month === cell.month &&
                          selectedDate.day === cell.day;

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
                              onClick={() => handleSelectCalendarDay(cell)}
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
                      {selectedDate.day} {MONTH_NAMES[selectedDate.month]} {selectedDate.year}
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
                      onClick={() => setViewMode('list')}
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
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyCustomDate}
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
                </>
              )}
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}
    </div>
  );
};

export default RequestDetailView;

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
  Clock,
  Warning,
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

const FILTER_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'this_month', label: 'This month' },
  { id: 'last_year', label: 'Last year' },
];

/**
 * Financial Detail Header Bar with Filter Pill on the right
 */
export const FinancialDetailHeader = ({ onBack, period = 'This month', onOpenPicker }) => (
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
        Financial Details
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
 * Donut Chart SVG Component for Billing Proportion
 */
const BillingDonutChart = ({ paidValue = 45.7, unpaidValue = 20.3, totalValue = 'Rp 66 M' }) => {
  const total = paidValue + unpaidValue;
  const paidRatio = paidValue / total; // ~0.6924
  const unpaidRatio = unpaidValue / total; // ~0.3076

  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeWidth = 26;

  const paidStroke = paidRatio * circumference;
  const unpaidStroke = unpaidRatio * circumference;

  return (
    <div style={{ position: 'relative', width: '156px', height: '156px', flexShrink: 0 }}>
      <svg
        width="156"
        height="156"
        viewBox="0 0 160 160"
        style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
      >
        {/* Paid Arc (Green) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeDasharray={`${paidStroke} ${circumference}`}
          strokeDashoffset={0}
        />
        {/* Unpaid Arc (Orange/Amber) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={`${unpaidStroke} ${circumference}`}
          strokeDashoffset={-paidStroke}
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
        <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500, lineHeight: 1.2 }}>
          Total
        </span>
        <span
          style={{
            fontSize: '1.1875rem',
            fontWeight: 700,
            color: '#334155',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            marginTop: '3px',
          }}
        >
          {totalValue}
        </span>
      </div>
    </div>
  );
};

/**
 * Monthly Trend Area/Line Chart Component
 */
const BillingMonthlyTrendChart = () => {
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const yLabels = ['50M', '38M', '25M', '13M', '0M'];
  const yCoords = [20, 55, 92, 129, 165];

  // Coordinates for 6 data points
  // Feb (50), Mar (103), Apr (156), May (209), Jun (262), Jul (315)
  const paidPoints = [
    { x: 50, y: 55 },
    { x: 103, y: 48 },
    { x: 156, y: 42 },
    { x: 209, y: 36 },
    { x: 262, y: 34 },
    { x: 315, y: 30 },
  ];

  const unpaidPoints = [
    { x: 50, y: 95 },
    { x: 103, y: 99 },
    { x: 156, y: 103 },
    { x: 209, y: 106 },
    { x: 262, y: 108 },
    { x: 315, y: 110 },
  ];

  const paidPathD = `M ${paidPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const paidAreaD = `M ${paidPoints[0].x},${paidPoints[0].y} L ${paidPoints.map((p) => `${p.x},${p.y}`).join(' L ')} L ${paidPoints[paidPoints.length - 1].x},165 L ${paidPoints[0].x},165 Z`;

  const unpaidPathD = `M ${unpaidPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const unpaidAreaD = `M ${unpaidPoints[0].x},${unpaidPoints[0].y} L ${unpaidPoints.map((p) => `${p.x},${p.y}`).join(' L ')} L ${unpaidPoints[unpaidPoints.length - 1].x},165 L ${unpaidPoints[0].x},165 Z`;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '20px 14px 16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* Chart SVG */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox="0 0 340 195"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            overflow: 'visible',
            animation: 'chartFadeIn 0.35s ease-out',
          }}
        >
          <defs>
            {/* Soft Green Gradient */}
            <linearGradient id="paidTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
            </linearGradient>

            {/* Soft Amber Gradient */}
            <linearGradient id="unpaidTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y labels */}
          {yLabels.map((lbl, idx) => (
            <g key={lbl}>
              <text
                x="32"
                y={yCoords[idx] + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94A3B8"
                fontFamily="var(--font-sans)"
                fontWeight="500"
              >
                {lbl}
              </text>
              <line
                x1="42"
                y1={yCoords[idx]}
                x2="328"
                y2={yCoords[idx]}
                stroke="#F1F5F9"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            </g>
          ))}

          {/* Paid Area & Line */}
          <path
            d={paidAreaD}
            fill="url(#paidTrendGrad)"
            style={{ animation: 'areaFadeIn 0.4s ease-out' }}
          />
          <path
            d={paidPathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Unpaid Area & Line */}
          <path
            d={unpaidAreaD}
            fill="url(#unpaidTrendGrad)"
            style={{ animation: 'areaFadeIn 0.4s ease-out' }}
          />
          <path
            d={unpaidPathD}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Paid Data Dots */}
          {paidPoints.map((p, i) => (
            <circle
              key={`paid-dot-${i}`}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#10B981"
              strokeWidth="2.5"
              style={{
                animation: 'dotFadeIn 0.3s ease-out',
              }}
            />
          ))}

          {/* Unpaid Data Dots */}
          {unpaidPoints.map((p, i) => (
            <circle
              key={`unpaid-dot-${i}`}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#F59E0B"
              strokeWidth="2.5"
              style={{
                animation: 'dotFadeIn 0.3s ease-out',
              }}
            />
          ))}

          {/* X Axis Month Labels */}
          {months.map((m, idx) => (
            <text
              key={m}
              x={paidPoints[idx].x}
              y="186"
              textAnchor="middle"
              fontSize="11"
              fill="#64748B"
              fontFamily="var(--font-sans)"
              fontWeight="500"
            >
              {m}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          paddingTop: '2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            Paid
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#F59E0B',
            }}
          />
          <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            Unpaid
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Financial Detail View Component
 */
export const FinancialDetailView = ({
  period = 'This month',
  onPeriodChange,
  isPickerOpen,
  setIsPickerOpen,
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'custom_month'
  const [tempYear, setTempYear] = useState(2026);
  const [tempMonth, setTempMonth] = useState('Jul');

  const handleSelectOption = (optLabel) => {
    if (onPeriodChange) {
      onPeriodChange(optLabel);
    }
    if (setIsPickerOpen) {
      setIsPickerOpen(false);
    }
  };

  const handleApplyCustomMonth = () => {
    if (onPeriodChange) {
      onPeriodChange(`${tempMonth} ${tempYear}`);
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        padding: '16px 16px 32px 16px',
        gap: '16px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* 1. Billing Proportion Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Billing proportion
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
          <BillingDonutChart
            paidValue={45.7}
            unpaidValue={20.3}
            totalValue="Rp 66 M"
          />

          {/* Legend / Breakdown Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              paddingLeft: '8px',
            }}
          >
            {/* Paid Stat */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                  }}
                />
                <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
                  Paid
                </span>
              </div>
              <span
                style={{
                  fontSize: '1.1875rem',
                  fontWeight: 700,
                  color: '#334155',
                  letterSpacing: '-0.3px',
                  paddingLeft: '18px',
                }}
              >
                Rp 45,7 M
              </span>
            </div>

            {/* Unpaid Stat */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#F59E0B',
                  }}
                />
                <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
                  Unpaid
                </span>
              </div>
              <span
                style={{
                  fontSize: '1.1875rem',
                  fontWeight: 700,
                  color: '#334155',
                  letterSpacing: '-0.3px',
                  paddingLeft: '18px',
                }}
              >
                Rp 20,3 M
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Invoice Count (On Paper) Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Invoice count (On Paper)
        </h2>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'none',
          }}
        >
          {/* Paid Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '52px 1fr',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
              Paid
            </span>
            <div
              style={{
                width: '100%',
                height: '30px',
                backgroundColor: '#F1F5F9',
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '55%',
                  height: '100%',
                  backgroundColor: '#10B981',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '16px',
                  boxSizing: 'border-box',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.2px',
                  transformOrigin: 'left center',
                  animation: 'barGrowHorizontal 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                381
              </div>
            </div>
          </div>

          {/* Unpaid Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '52px 1fr',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
              Unpaid
            </span>
            <div
              style={{
                width: '100%',
                height: '30px',
                backgroundColor: '#F1F5F9',
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F59E0B',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '16px',
                  boxSizing: 'border-box',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.2px',
                  transformOrigin: 'left center',
                  animation: 'barGrowHorizontal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                698
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Summary Cards (Outstanding & Fine) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}
      >
        {/* Outstanding Card (Warm Yellow/Amber) */}
        <div
          style={{
            backgroundColor: '#FEF9C3',
            border: '1px solid #FCD34D',
            borderRadius: '16px',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '84px',
            boxSizing: 'border-box',
            boxShadow: 'none',
          }}
        >
          {/* Subtle Watermark Icon */}
          <div
            style={{
              position: 'absolute',
              right: '-10px',
              bottom: '-12px',
              opacity: 0.15,
              color: '#CA8A04',
              pointerEvents: 'none',
            }}
          >
            <Clock size={80} weight="fill" />
          </div>

          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#854D0E',
              letterSpacing: '-0.2px',
            }}
          >
            Outstanding
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#D97706',
              letterSpacing: '-0.4px',
              marginTop: '6px',
            }}
          >
            Rp 8,6 M
          </span>
        </div>

        {/* Fine Card (Soft Red/Rose) */}
        <div
          style={{
            backgroundColor: '#FFE4E6',
            border: '1px solid #FDA4AF',
            borderRadius: '16px',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '84px',
            boxSizing: 'border-box',
            boxShadow: 'none',
          }}
        >
          {/* Subtle Watermark Icon */}
          <div
            style={{
              position: 'absolute',
              right: '-8px',
              bottom: '-10px',
              opacity: 0.15,
              color: '#E11D48',
              pointerEvents: 'none',
            }}
          >
            <Warning size={78} weight="fill" />
          </div>

          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#9F1239',
              letterSpacing: '-0.2px',
            }}
          >
            Fine
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#E11D48',
              letterSpacing: '-0.4px',
              marginTop: '6px',
            }}
          >
            Rp 1,3 M
          </span>
        </div>
      </div>

      {/* 4. Billing Statistics (Monthly Trend) Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Billing Statistics (Monthly Trend)
        </h2>

        <BillingMonthlyTrendChart />
      </section>

      {/* Filter Bottom Sheet Modal inside Phone Frame Portal */}
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
                        Filter financial statistics & transactions
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
                        <span>Choose month...</span>
                      </div>
                      <CaretRight size={16} weight="bold" color="#94A3B8" />
                    </button>
                  </div>
                </>
              ) : (
                /* Mode 2: Custom Month & Year Picker */
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
                        Choose Month
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
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
                      onClick={handleApplyCustomMonth}
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

export default FinancialDetailView;

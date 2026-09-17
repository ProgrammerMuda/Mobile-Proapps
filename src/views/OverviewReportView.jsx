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

  // If user is Engineering, Housekeeping, or Security, render empty overview container
  if (isEngineering || isHousekeeping || isSecurity) {
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
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
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
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
      </div>

      {/* =========================================================================
          MONTH PICKER BOTTOM SHEET MODAL (Portal to Android Device Frame)
          ========================================================================= */}
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

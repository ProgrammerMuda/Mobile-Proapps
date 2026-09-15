import React from 'react';
import { CaretLeft, Buildings } from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Building Summary Header Bar (Fixed at top below white status bar)
 */
export const BuildingSummaryHeader = ({ onBack }) => {
  const { t } = useLanguage();
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: '#334155',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        height: '52px',
        borderBottom: '1px solid #F1F5F9',
        flexShrink: 0,
        zIndex: 40,
        gap: '12px',
        boxSizing: 'border-box',
        boxShadow: 'none',
      }}
    >
      {/* Left: Back Button */}
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

      {/* Title */}
      <h1
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#334155',
          margin: 0,
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}
      >
        {t('overview.buildingSummary')}
      </h1>
    </header>
  );
};

/**
 * Building Summary View
 * Sections:
 * 1. Tenant (Donut Chart 35% Owner vs 65% Renter)
 * 2. Units per tower (Summary Stats + 7-Column Bar Chart)
 * 3. Tower details (List of Tower A-G cards with unit & tenant breakdown)
 */
export const BuildingSummaryView = () => {
  const { t } = useLanguage();
  const towerData = [
    { name: 'Tower A', units: 168, tenants: 158 },
    { name: 'Tower B', units: 155, tenants: 146 },
    { name: 'Tower C', units: 162, tenants: 152 },
    { name: 'Tower D', units: 148, tenants: 140 },
    { name: 'Tower E', units: 158, tenants: 149 },
    { name: 'Tower F', units: 145, tenants: 121 },
    { name: 'Tower G', units: 146, tenants: 116 },
  ];

  // Donut chart calculations (r=56, circumference ~ 351.86 for spacious center)
  const radius = 56;
  const circumference = 2 * Math.PI * radius; // 351.858
  const ownerPercent = 35;
  const renterPercent = 65;
  const ownerDash = (ownerPercent / 100) * circumference;
  const renterDash = (renterPercent / 100) * circumference;

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
          SECTION 1: Tenant (Donut Chart)
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
          {t('overview.owner')}/{t('overview.renter')}
        </h2>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '18px 16px',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Donut Chart with Spacious Center */}
          <div style={{ position: 'relative', width: '148px', height: '148px', flexShrink: 0 }}>
            <svg
              viewBox="0 0 148 148"
              style={{
                width: '100%',
                height: '100%',
                transform: 'rotate(-90deg)',
                overflow: 'visible',
              }}
            >
              {/* Owner Segment (35% - Primary #053079) */}
              <circle
                cx="74"
                cy="74"
                r={radius}
                fill="none"
                stroke="#053079"
                strokeWidth="16"
                strokeDasharray={`${ownerDash} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="butt"
              />
              {/* Renter Segment (65% - Secondary #09B2FF) */}
              <circle
                cx="74"
                cy="74"
                r={radius}
                fill="none"
                stroke="#09B2FF"
                strokeWidth="16"
                strokeDasharray={`${renterDash} ${circumference}`}
                strokeDashoffset={-ownerDash}
                strokeLinecap="butt"
              />
            </svg>

            {/* Centered Donut Label with comfortable margins */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                animation: 'chartFadeIn 0.3s ease-out',
              }}
            >
              <span
                style={{
                  fontSize: '1.625rem',
                  fontWeight: 800,
                  color: '#334155',
                  lineHeight: 1.1,
                  letterSpacing: '-0.4px',
                }}
              >
                982
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: '#64748B',
                  marginTop: '3px',
                }}
              >
                {t('overview.totalTenants')}
              </span>
            </div>
          </div>

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
            {/* Owner Legend (Primary #053079) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#053079',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                {t('overview.owner')}
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#64748B',
                  marginLeft: 'auto',
                }}
              >
                340 (35%)
              </span>
            </div>

            {/* Renter Legend (Secondary #09B2FF) */}
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
                {t('overview.renter')}
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#64748B',
                  marginLeft: 'auto',
                }}
              >
                642 (65%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: Units per tower (Bar Chart)
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
          {t('overview.units', { count: '' }).trim()} per {t('overview.towers')}
        </h2>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'none',
          }}
        >
          {/* Top Stat Summary Header (Divided into 2 columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1px 1fr',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '16px',
            }}
          >
            {/* Left: Total Towers (Slate 700 #334155) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '1.625rem',
                  fontWeight: 800,
                  color: '#334155',
                  lineHeight: 1.1,
                  letterSpacing: '-0.3px',
                }}
              >
                7
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#64748B',
                  marginTop: '2px',
                }}
              >
                {t('overview.towers')}
              </span>
            </div>

            {/* Vertical Divider */}
            <div style={{ height: '36px', backgroundColor: '#E2E8F0' }} />

            {/* Right: Total Units (Primary Brand Color #053079) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '1.625rem',
                  fontWeight: 800,
                  color: '#053079',
                  lineHeight: 1.1,
                  letterSpacing: '-0.3px',
                }}
              >
                1.082
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#64748B',
                  marginTop: '2px',
                }}
              >
                {t('overview.totalUnits')}
              </span>
            </div>
          </div>

          {/* SVG Bar Chart for 7 Towers */}
          <div style={{ width: '100%', position: 'relative', marginTop: '4px' }}>
            <svg
              viewBox="0 0 340 170"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                overflow: 'visible',
                animation: 'chartFadeIn 0.35s ease-out',
              }}
            >
              {/* Y-Axis Gridlines & Values (200, 150, 100, 50, 0) */}
              {[
                { val: '200', y: 15 },
                { val: '150', y: 45 },
                { val: '100', y: 75 },
                { val: '50', y: 105 },
                { val: '0', y: 135 },
              ].map((grid) => (
                <g key={grid.val}>
                  <text
                    x="22"
                    y={grid.y + 4}
                    fontSize="10"
                    fontWeight="500"
                    fill="#94A3B8"
                    textAnchor="end"
                  >
                    {grid.val}
                  </text>
                  <line
                    x1="30"
                    y1={grid.y}
                    x2="330"
                    y2={grid.y}
                    stroke="#F1F5F9"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* 7 Bars (Towers A to G) */}
              {[
                { label: 'A', units: 168, x: 42, h: 96, y: 39 },
                { label: 'B', units: 155, x: 84, h: 88, y: 47 },
                { label: 'C', units: 162, x: 126, h: 92, y: 43 },
                { label: 'D', units: 148, x: 168, h: 84, y: 51 },
                { label: 'E', units: 158, x: 210, h: 90, y: 45 },
                { label: 'F', units: 145, x: 252, h: 82, y: 53 },
                { label: 'G', units: 146, x: 294, h: 83, y: 52 },
              ].map((bar) => (
                <g key={bar.label}>
                  {/* Top Unit Value */}
                  <text
                    x={bar.x + 14}
                    y={bar.y - 6}
                    fontSize="10"
                    fontWeight="700"
                    fill="#334155"
                    textAnchor="middle"
                  >
                    {bar.units}
                  </text>

                  {/* Rounded Bar (Secondary Brand Color #09B2FF) */}
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width="28"
                    height={bar.h}
                    rx="6"
                    ry="6"
                    fill="#09B2FF"
                    style={{
                      transformOrigin: `${bar.x + 14}px 135px`,
                      animation: 'barGrowVertical 0.35s ease-out',
                    }}
                  />

                  {/* Bottom X-Axis Label */}
                  <text
                    x={bar.x + 14}
                    y="152"
                    fontSize="11"
                    fontWeight="600"
                    fill="#64748B"
                    textAnchor="middle"
                  >
                    {bar.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: Tower details (Cards List)
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
          {t('overview.towerDetails')}
        </h2>

        {/* Stack of Tower Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {towerData.map((tower) => (
            <div
              key={tower.name}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'none',
              }}
            >
              {/* Left: Icon & Tower Name (Secondary Brand Color #09B2FF on #EAF7FF) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#EAF7FF',
                    color: '#09B2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Buildings size={20} weight="fill" />
                </div>

                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#334155',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {tower.name}
                </span>
              </div>

              {/* Right: Units & Tenants Breakdown */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '2px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#053079',
                    lineHeight: 1.2,
                  }}
                >
                  {t('overview.units', { count: tower.units })}
                </span>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#94A3B8',
                    lineHeight: 1.2,
                  }}
                >
                  {tower.tenants} {t('overview.renter')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingSummaryView;

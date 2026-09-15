import React from 'react';
import { CaretLeft, CaretRight, Buildings } from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Tenant Unit Header Bar (Fixed at top with centered title and back button)
 */
export const TenantUnitHeader = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--color-text-primary)',
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
      {/* Left: Back Button */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to Dashboard"
        style={{
          width: '36px',
          height: '36px',
          background: 'none',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          transition: 'transform 0.15s ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <CaretLeft size={22} weight="bold" />
      </button>

      {/* Centered Title */}
      <h1
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: 0,
          letterSpacing: '-0.2px',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        {t('tenantUnit.title')}
      </h1>

      {/* Right: Symmetrical Placeholder for Perfect Center Alignment */}
      <div style={{ width: '36px', height: '36px' }} />
    </header>
  );
};

/**
 * Tenant Unit Main View (BM Exclusive)
 * Renders Site summary card and Tower Cards matching the exact specification.
 */
export const TenantUnitView = ({ onSelectTower }) => {
  const { t } = useLanguage();

  const towersData = [
    {
      id: 'tower-a',
      name: 'Tower A',
      totalUnits: 180,
      occupiedUnits: 143,
      occupiedPct: 79,
      ownerUnits: 80,
      renterUnits: 63,
      vacantUnits: 37,
    },
    {
      id: 'tower-b',
      name: 'Tower B',
      totalUnits: 120,
      occupiedUnits: 95,
      occupiedPct: 79,
      ownerUnits: 54,
      renterUnits: 41,
      vacantUnits: 25,
    },
    {
      id: 'tower-c',
      name: 'Tower C',
      totalUnits: 110,
      occupiedUnits: 88,
      occupiedPct: 80,
      ownerUnits: 50,
      renterUnits: 38,
      vacantUnits: 22,
    },
    {
      id: 'tower-d',
      name: 'Tower D',
      totalUnits: 96,
      occupiedUnits: 78,
      occupiedPct: 81,
      ownerUnits: 46,
      renterUnits: 32,
      vacantUnits: 18,
    },
    {
      id: 'tower-e',
      name: 'Tower E',
      totalUnits: 90,
      occupiedUnits: 73,
      occupiedPct: 81,
      ownerUnits: 42,
      renterUnits: 31,
      vacantUnits: 17,
    },
  ];

  // Aggregated Site Totals
  const siteTotalUnits = 596;
  const siteOccupiedUnits = 477;
  const siteVacantUnits = 119;
  const siteOccupiedPct = 80;

  const handleTowerClick = (tower) => {
    if (onSelectTower) {
      onSelectTower(tower);
    } else {
      alert(t('tenantUnit.viewingUnitsAlert', { tower: tower.name }));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        padding: '16px 16px 36px 16px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* 1. Top Hero Card: Apartemen Paladian Park Site Summary */}
      <div
        style={{
          background: 'linear-gradient(135deg, #053079 0%, #0344A8 55%, #0284C7 100%)',
          borderRadius: 'var(--radius-md)', /* 16px */
          padding: '16px',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Site Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.3px',
                  color: '#FFFFFF',
                }}
              >
                <Buildings size={12} weight="fill" />
                <span>{t('tenantUnit.site')}</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.3px',
                  color: '#FFFFFF',
                }}
              >
                <span>{t('tenantUnit.towersCount', { count: towersData.length })}</span>
              </div>
            </div>
            <h2
              style={{
                fontSize: '1.1875rem',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.3px',
                lineHeight: 1.2,
              }}
            >
              {t('tenantUnit.siteName')}
            </h2>
          </div>

          {/* Occupied Badge Pill (White with Emerald Dot) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#FFFFFF',
              color: '#053079',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                flexShrink: 0,
              }}
            />
            <span>{t('tenantUnit.occupiedPct', { pct: siteOccupiedPct })}</span>
          </div>
        </div>

        {/* Site Occupancy Distribution Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
            }}
          >
            <span>{t('tenantUnit.occupancyRate')}</span>
            <span style={{ fontWeight: 700 }}>
              {siteOccupiedUnits} / {siteTotalUnits} {t('tenantUnit.unitsLabel')}
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            {/* Owner Segment (Green) - 272/596 -> 45.6% */}
            <div
              style={{
                width: '45.6%',
                height: '100%',
                backgroundColor: '#10B981',
              }}
            />
            {/* Renter Segment (Cyan) - 205/596 -> 34.4% */}
            <div
              style={{
                width: '34.4%',
                height: '100%',
                backgroundColor: '#38BDF8',
              }}
            />
          </div>
        </div>

        {/* 3 Frosted Glass Metric Sub-Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* 1. Total Units */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: 'var(--radius-sm)', /* 8px */
              padding: '10px 8px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
              }}
            >
              {siteTotalUnits}
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 600,
                marginTop: '3px',
              }}
            >
              {t('tenantUnit.totalUnits')}
            </div>
          </div>

          {/* 2. Occupied Units */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(110, 231, 183, 0.45)',
              borderRadius: 'var(--radius-sm)', /* 8px */
              padding: '10px 8px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#6EE7B7', /* Bright Emerald */
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
              }}
            >
              {siteOccupiedUnits}
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                marginTop: '3px',
              }}
            >
              {t('tenantUnit.occupied')}
            </div>
          </div>

          {/* 3. Vacant Units */}
          <div
            style={{
              backgroundColor: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid rgba(253, 186, 116, 0.45)',
              borderRadius: 'var(--radius-sm)', /* 8px */
              padding: '10px 8px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#FDBA74', /* Bright Orange/Amber */
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
              }}
            >
              {siteVacantUnits}
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                marginTop: '3px',
              }}
            >
              {t('tenantUnit.vacant')}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section Title: Tower List (Exact 16px below header card, 8px above Card Tower A) */}
      <div style={{ margin: '16px 0 8px 0' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.2px',
            margin: 0,
          }}
        >
          {t('tenantUnit.towerList')}
        </h2>
      </div>

      {/* 3. Tower Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {towersData.map((tower) => {
          const ownerPct = (tower.ownerUnits / tower.totalUnits) * 100;
          const renterPct = (tower.renterUnits / tower.totalUnits) * 100;

          return (
            <div
              key={tower.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)', /* 16px */
                border: '1px solid #E2E8F0',
                padding: '16px',
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Tower Header Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Left: Secondary Icon Box + Tower Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-sm)', /* 8px */
                      backgroundColor: 'var(--color-selected-background)', /* #EAF7FF */
                      border: '1px solid #BAE6FD',
                      color: 'var(--color-secondary)', /* Secondary Brand Blue #09B2FF */
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Buildings size={24} weight="fill" color="var(--color-secondary)" />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: '1.0625rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        margin: '0 0 2px 0',
                        letterSpacing: '-0.2px',
                        lineHeight: 1.2,
                      }}
                    >
                      {tower.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#64748B',
                        fontWeight: 400,
                      }}
                    >
                      {t('tenantUnit.totalUnitsSubtitle', { count: tower.totalUnits })}
                    </span>
                  </div>
                </div>

                {/* Right: Occupied Badge (Primary Brand) */}
                <div
                  style={{
                    backgroundColor: 'var(--color-selected-background)', /* #EAF7FF */
                    color: 'var(--color-primary)', /* #053079 */
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #BAE6FD',
                  }}
                >
                  {t('tenantUnit.occupiedPct', { pct: tower.occupiedPct })}
                </div>
              </div>

              {/* Occupancy Rate Row & Progress Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8125rem',
                  }}
                >
                  <span style={{ color: '#64748B', fontWeight: 500 }}>
                    {t('tenantUnit.occupancyRate')}
                  </span>
                  <div>
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      {tower.occupiedUnits}
                    </span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                      {' '}{t('tenantUnit.unitsOccupied', { total: tower.totalUnits })}
                    </span>
                  </div>
                </div>

                {/* Segmented Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#E2E8F0',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  {/* Owner Segment (Green) */}
                  <div
                    style={{
                      width: `${ownerPct}%`,
                      height: '100%',
                      backgroundColor: '#059669',
                      transition: 'width 0.4s ease',
                    }}
                  />
                  {/* Renter Segment (Blue) */}
                  <div
                    style={{
                      width: `${renterPct}%`,
                      height: '100%',
                      backgroundColor: '#2563EB',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* 3 Mini Sub-Cards Grid (Owner, Renter, Vacant) with Vivid Matching Outlines */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginTop: '2px',
                }}
              >
                {/* 1. Owner (Green Outline) */}
                <div
                  style={{
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #86EFAC', /* Green 300 - clear & vivid */
                    borderRadius: 'var(--radius-sm)', /* 8px */
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#166534',
                      }}
                    >
                      {t('tenantUnit.owner')}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {tower.ownerUnits}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        marginLeft: '3px',
                        fontWeight: 500,
                      }}
                    >
                      {t('tenantUnit.unitsLabel')}
                    </span>
                  </div>
                </div>

                {/* 2. Renter (Blue Outline) */}
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #93C5FD', /* Blue 300 - clear & vivid */
                    borderRadius: 'var(--radius-sm)', /* 8px */
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#3B82F6',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#1E40AF',
                      }}
                    >
                      {t('tenantUnit.renter')}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {tower.renterUnits}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        marginLeft: '3px',
                        fontWeight: 500,
                      }}
                    >
                      {t('tenantUnit.unitsLabel')}
                    </span>
                  </div>
                </div>

                {/* 3. Vacant (Orange/Peach Outline) */}
                <div
                  style={{
                    backgroundColor: '#FFF7ED',
                    border: '1px solid #FDBA74', /* Orange 300 - clear & vivid */
                    borderRadius: 'var(--radius-sm)', /* 8px */
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#F97316',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#9A3412',
                      }}
                    >
                      {t('tenantUnit.vacant')}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {tower.vacantUnits}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        marginLeft: '3px',
                        fontWeight: 500,
                      }}
                    >
                      {t('tenantUnit.unitsLabel')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  borderTop: '1px solid #E2E8F0',
                  marginTop: '2px',
                }}
              />

              {/* Bottom Action: View Tower Units (Primary Color) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleTowerClick(tower)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)', /* Primary Brand #053079 */
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px 0',
                    fontFamily: 'var(--font-sans)',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <span>{t('tenantUnit.viewTowerUnits')}</span>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-selected-background)', /* #EAF7FF */
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CaretRight size={13} weight="bold" color="var(--color-primary)" />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TenantUnitView;

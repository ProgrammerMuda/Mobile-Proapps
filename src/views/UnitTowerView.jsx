import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, Door, MagnifyingGlass, FunnelSimple, X, Check } from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Unit Tower Header Bar (Fixed at top with centered title, back button, search bar, and filter button)
 */
export const UnitTowerHeader = ({
  towerName = 'Tower A',
  onBack,
  searchQuery = '',
  onSearchChange,
  onClearSearch,
  onToggleFilter,
  hasActiveFilter = false,
}) => {
  const { t } = useLanguage();

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: 'none',
        flexShrink: 0,
        zIndex: 40,
        boxSizing: 'border-box',
        boxShadow: 'none',
      }}
    >
      {/* 1. Top Title Bar */}
      <div
        style={{
          height: '52px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Back Button */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Tower List"
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

        {/* Centered Title: e.g. Unit Tower A */}
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
          {t('unitTower.title', { tower: towerName })}
        </h1>

        {/* Right: Symmetrical Placeholder for Center Alignment */}
        <div style={{ width: '36px', height: '36px' }} />
      </div>

      {/* 2. Search + Filter Bar (Merged into Title Bar Header) */}
      <div
        style={{
          padding: '0 16px 12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Search Input Box (No outline/border, clean light background) */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: '42px',
            backgroundColor: '#F1F5F9',
            borderRadius: 'var(--radius-sm)', /* 8px */
            border: 'none',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
            boxShadow: 'none',
          }}
        >
          <MagnifyingGlass size={18} weight="bold" color="#94A3B8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={t('unitTower.searchPlaceholder', { tower: towerName || 'Tower A' })}
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              fontSize: '0.8125rem',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)',
              backgroundColor: 'transparent',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>

        {/* Filter Button (Background White, Clean Style) */}
        <button
          type="button"
          onClick={onToggleFilter}
          aria-label="Filter units"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)', /* 8px */
            backgroundColor: hasActiveFilter ? 'var(--color-primary)' : '#FFFFFF',
            border: hasActiveFilter ? '1px solid var(--color-primary)' : '1px solid #E2E8F0',
            color: hasActiveFilter ? '#FFFFFF' : '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            outline: 'none',
            transition: 'all 0.15s ease',
            boxShadow: 'none',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <FunnelSimple size={20} weight={hasActiveFilter ? 'fill' : 'bold'} />
        </button>
      </div>
    </header>
  );
};

/**
 * Mock data generator for Tower Units (Floors 1 to 20)
 */
export const getTowerUnitsData = (towerCode = 'A') => {
  const code = (towerCode || 'A').toUpperCase().replace('TOWER ', '').trim() || 'A';
  
  const residentNames = [
    'Cindy Claudia', 'Eko Prasetyo', 'Indah Permata', 'Bayu Pratama', 'Budi Santoso',
    'Farhan Maulana', 'Siti Nurhaliza', 'Agus Haryanto', 'Dewi Lestari', 'Rian Hidayat',
    'Hendra Wijaya', 'Maya Putri', 'Doni Firmansyah', 'Lina Marlina', 'Fajar Nugraha',
    'Kevin Sanjaya', 'Gita Savitri', 'Reza Rahadian', 'Anisa Rahma', 'Dimas Anggara'
  ];

  const list = [];
  for (let f = 1; f <= 20; f++) {
    const floorStr = String(f);
    const floorPad = String(f).padStart(2, '0');
    // 3 units per floor
    for (let u = 1; u <= 3; u++) {
      const unitPad = String(u).padStart(2, '0');
      const unitNo = `${code}${floorPad}${unitPad}`;
      const nameIndex = (f * 3 + u) % residentNames.length;
      
      // Case 1 (u=1): Renter (e.g. A0101)
      // Case 2 (u=2): Tenant Member (e.g. A0102)
      // Case 3 (u=3): Vacant (e.g. A0103)
      const isVacant = u === 3;
      const isTenantMember = u === 2;

      list.push({
        unitNo,
        floor: floorStr,
        ownerName: residentNames[nameIndex],
        ownerPhone: `+62 812-${String(1000 + f * 10 + u)}-${String(2000 + f * 10 + u)}`,
        occupantRole: isVacant ? null : (isTenantMember ? 'Tenant Member' : 'Renter'),
        residentType: isVacant ? 'Vacant' : (isTenantMember ? 'Tenant Member' : 'Renter'),
        residentName: isVacant ? '-' : (isTenantMember ? 'Rina Haryanto' : 'Agus Haryanto'),
        status: isVacant ? 'Vacant' : 'Occupied',
      });
    }
  }

  return list;
};

/**
 * Unit Tower Main View Screen (BM Exclusive)
 * Displays filtered units list with Secondary Colored Door Icons and Filter Modal.
 */
export const UnitTowerView = ({
  tower = { name: 'Tower A', id: 'tower-a' },
  tenantUnits = null,
  searchQuery: controlledSearchQuery,
  statusFilter: controlledStatusFilter,
  setStatusFilter: controlledSetStatusFilter,
  floorFilter: controlledFloorFilter,
  setFloorFilter: controlledSetFloorFilter,
  isFilterModalOpen: controlledIsFilterModalOpen,
  setIsFilterModalOpen: controlledSetIsFilterModalOpen,
  onSelectUnit,
}) => {
  const { t } = useLanguage();
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [internalStatusFilter, setInternalStatusFilter] = useState('ALL');
  const [internalFloorFilter, setInternalFloorFilter] = useState('ALL');
  const [internalIsFilterModalOpen, setInternalIsFilterModalOpen] = useState(false);

  const searchQuery = controlledSearchQuery !== undefined ? controlledSearchQuery : internalSearchQuery;
  const statusFilter = controlledStatusFilter !== undefined ? controlledStatusFilter : internalStatusFilter;
  const setStatusFilter = controlledSetStatusFilter || setInternalStatusFilter;
  const floorFilter = controlledFloorFilter !== undefined ? controlledFloorFilter : internalFloorFilter;
  const setFloorFilter = controlledSetFloorFilter || setInternalFloorFilter;
  const isFilterModalOpen = controlledIsFilterModalOpen !== undefined ? controlledIsFilterModalOpen : internalIsFilterModalOpen;
  const setIsFilterModalOpen = controlledSetIsFilterModalOpen || setInternalIsFilterModalOpen;

  const towerUnits = useMemo(() => {
    // If tenantUnits provided (tenant role), use those directly
    if (tenantUnits && tenantUnits.length > 0) return tenantUnits;
    const code = tower?.name ? tower.name.replace('Tower', '').trim() : 'A';
    return getTowerUnitsData(code);
  }, [tower, tenantUnits]);

  // Distinct floors list (1 to 20)
  const availableFloors = useMemo(() => {
    const set = new Set(towerUnits.map((u) => u.floor));
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [towerUnits]);

  // Filtered units
  const filteredUnits = useMemo(() => {
    return towerUnits.filter((unit) => {
      // Search matching
      const q = (searchQuery || '').toLowerCase().trim();
      const matchSearch =
        !q ||
        unit.unitNo.toLowerCase().includes(q) ||
        (unit.ownerName && unit.ownerName.toLowerCase().includes(q)) ||
        (unit.residentName && unit.residentName.toLowerCase().includes(q)) ||
        `lt. ${unit.floor}`.includes(q) ||
        `floor ${unit.floor}`.includes(q) ||
        unit.status.toLowerCase().includes(q);

      // Status filter
      const matchStatus = statusFilter === 'ALL' || unit.status === statusFilter;

      // Floor filter
      const matchFloor = floorFilter === 'ALL' || unit.floor === floorFilter;

      return matchSearch && matchStatus && matchFloor;
    });
  }, [towerUnits, searchQuery, statusFilter, floorFilter]);

  const hasActiveFilter = statusFilter !== 'ALL' || floorFilter !== 'ALL';

  const handleUnitClick = (unit) => {
    if (onSelectUnit) {
      onSelectUnit(unit);
    } else {
      alert(t('unitTower.unitDetailsAlert', { unit: unit.unitNo }));
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
        gap: '12px',
      }}
    >
      {/* Active Filter Chips (if any) */}
      {hasActiveFilter && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {statusFilter !== 'ALL' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'var(--color-selected-background)',
                border: '1px solid #BAE6FD',
                borderRadius: 'var(--radius-full)',
                padding: '2px 8px',
                fontSize: '0.75rem',
                color: 'var(--color-primary)',
                fontWeight: 600,
              }}
            >
              <span>{statusFilter === 'Occupied' ? t('unitTower.occupied') : t('unitTower.vacant')}</span>
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-primary)', display: 'flex' }}
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          )}

          {floorFilter !== 'ALL' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'var(--color-selected-background)',
                border: '1px solid #BAE6FD',
                borderRadius: 'var(--radius-full)',
                padding: '2px 8px',
                fontSize: '0.75rem',
                color: 'var(--color-primary)',
                fontWeight: 600,
              }}
            >
              <span>{t('unitTower.floorItem', { floor: floorFilter })}</span>
              <button
                type="button"
                onClick={() => setFloorFilter('ALL')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-primary)', display: 'flex' }}
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setStatusFilter('ALL');
              setFloorFilter('ALL');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '2px 4px',
              textDecoration: 'underline',
            }}
          >
            {t('unitTower.resetFilter')}
          </button>
        </div>
      )}

      {/* 2. Units List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredUnits.length > 0 ? (
          filteredUnits.map((unit) => {
            const isOccupied = unit.status === 'Occupied';

            return (
              <div
                key={unit.unitNo}
                onClick={() => handleUnitClick(unit)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)', /* 16px */
                  border: '1px solid #E2E8F0',
                  padding: '14px 16px',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                {/* Left Content: Door Icon (Secondary Color) + Unit Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Door Icon Container with Secondary Color */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-sm)', /* 8px */
                      backgroundColor: 'var(--color-selected-background)', /* #EAF7FF */
                      border: '1px solid #BAE6FD',
                      color: 'var(--color-secondary)', /* #09B2FF */
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Door size={22} weight="fill" color="var(--color-secondary)" />
                  </div>

                  {/* Unit Number, Floor Badge & Owner Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: 'var(--color-text-primary)',
                          letterSpacing: '-0.2px',
                          lineHeight: 1.2,
                        }}
                      >
                        {unit.unitNo}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: '#64748B',
                          backgroundColor: '#F1F5F9',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid #E2E8F0',
                          lineHeight: 1.3,
                        }}
                      >
                        {t('unitTower.floor', { floor: unit.floor })}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                      <span>{t('unitTower.owner')}: </span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {unit.ownerName || unit.residentName || 'Cindy Claudia'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Status Badge (Solid Fill, No Shadow, Bright Orange) */}
                <div
                  style={{
                    backgroundColor: isOccupied ? '#00C853' : '#F97316',
                    color: '#FFFFFF',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    boxShadow: 'none',
                  }}
                >
                  {isOccupied ? t('unitTower.occupied') : t('unitTower.vacant')}
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #E2E8F0',
              padding: '36px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Door size={40} weight="thin" color="#94A3B8" />
            <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {t('unitTower.noUnits')}
            </h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748B', maxWidth: '240px' }}>
              {t('unitTower.noUnitsDesc')}
            </p>
          </div>
        )}
      </div>

      {/* 3. Filter Bottom Sheet Modal (Mounted inside Phone Frame) */}
      {isFilterModalOpen && (() => {
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
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
            onClick={() => setIsFilterModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '16px 20px 28px 20px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
                maxHeight: '80%',
                overflowY: 'auto',
                boxSizing: 'border-box',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '9999px' }} />
              </div>

              {/* Header: Title + Close Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>
                  {t('unitTower.filterTitle')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  aria-label="Close Filter"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={22} weight="bold" />
                </button>
              </div>

              {/* Section 1: Status Unit (Radio Cards with Primary Brand Active Color) */}
              <div style={{ marginTop: '12px' }}>
                <span style={{ display: 'block', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                  {t('unitTower.filterStatus')}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'ALL', label: t('unitTower.allStatus') },
                    { id: 'Occupied', label: t('unitTower.occupied') },
                    { id: 'Vacant', label: t('unitTower.vacant') },
                  ].map((opt) => {
                    const isSelected = statusFilter === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStatusFilter(opt.id)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '12px',
                          backgroundColor: isSelected ? 'var(--color-selected-background)' : '#FFFFFF',
                          border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid #E2E8F0',
                          color: isSelected ? 'var(--color-primary)' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {/* Radio Circle */}
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid var(--color-primary)' : '2px solid #CBD5E1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            backgroundColor: '#FFFFFF',
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                              }}
                            />
                          )}
                        </div>

                        {/* Label Text */}
                        <span
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: isSelected ? 700 : 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Floor (Pills Grid matching user image) */}
              <div style={{ marginTop: '20px' }}>
                <span style={{ display: 'block', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                  {t('unitTower.filterFloor')}
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {/* All Floors */}
                  <button
                    type="button"
                    onClick={() => setFloorFilter('ALL')}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '10px',
                      backgroundColor: floorFilter === 'ALL' ? 'var(--color-primary)' : '#FFFFFF',
                      border: floorFilter === 'ALL' ? '1px solid var(--color-primary)' : '1px solid #E2E8F0',
                      color: floorFilter === 'ALL' ? '#FFFFFF' : '#334155',
                      fontSize: '0.875rem',
                      fontWeight: floorFilter === 'ALL' ? 700 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t('unitTower.allFloors')}
                  </button>

                  {/* Floor 1 to 20 */}
                  {availableFloors.map((fl) => {
                    const isSelected = floorFilter === fl;
                    return (
                      <button
                        key={fl}
                        type="button"
                        onClick={() => setFloorFilter(fl)}
                        style={{
                          padding: '9px 16px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                          border: isSelected ? '1px solid var(--color-primary)' : '1px solid #E2E8F0',
                          color: isSelected ? '#FFFFFF' : '#334155',
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? 700 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {t('unitTower.floorItem', { floor: fl })}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Bottom Action Buttons (Reset & Apply Filter with Primary Color) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '28px' }}>
                {/* Reset Button */}
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setFloorFilter('ALL');
                  }}
                  style={{
                    flex: 1,
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#475569',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseUp={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  {t('unitTower.resetFilter')}
                </button>

                {/* Apply Filter Button (Primary Brand Color) */}
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  style={{
                    flex: 1,
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-primary)', /* Primary Brand #053079 */
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(5, 48, 121, 0.2)',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseUp={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {t('unitTower.applyFilter')}
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

export default UnitTowerView;

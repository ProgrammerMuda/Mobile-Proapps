import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CaretDown,
  CaretUp,
  X,
  Door,
  User,
  IdentificationCard,
  Gauge,
  Drop,
  Lightning,
  QrCode,
  Copy,
  Check,
  Car,
  Motorcycle,
  Users,
  Phone,
  ShieldCheck,
  Tag,
  Receipt,
  House,
  CalendarCheck,
  DownloadSimple,
  PencilSimple,
  EnvelopeSimple,
  FilePdf,
  Key,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import { AndroidGestureBar } from '../components/layout/AndroidGestureBar';
import qrCodeSample from '../assets/qr-code-sample.png';

/**
 * Unit Detail Header Bar
 * Integrated header containing the Back button, Unit No title, Owner & Active Occupant cards, and 3 Tab options
 */
export const UnitDetailHeader = ({
  unit = {
    unitNo: 'A0101',
    floor: '1',
    residentType: 'Owner',
    residentName: 'Cindy Claudia',
    status: 'Occupied',
  },
  unitNo = 'A0101',
  activeTab = 'unit-info',
  onTabChange,
  onBack,
}) => {
  const { t } = useLanguage();

  const unitCode = unit?.unitNo || unitNo || 'A0101';
  const isVacant = unit?.status?.toLowerCase() === 'vacant' || unit?.residentType?.toLowerCase() === 'vacant';
  const isTenantMember = unit?.occupantRole === 'Tenant Member' || unit?.residentType === 'Tenant Member';

  // Owner & occupant data
  const ownerName = unit?.ownerName || 'Cindy Claudia';
  const ownerPhone = '+62 812-1010-2010';
  const occupantName = isVacant
    ? '-'
    : (unit?.residentName || unit?.occupantName || (isTenantMember ? 'Rina Haryanto' : 'Agus Haryanto'));
  const occupantRole = isVacant
    ? t('unitDetail.noOccupant')
    : (isTenantMember ? t('unitDetail.roleTenantMember') : t('unitDetail.roleRenter'));

  const tabs = [
    { id: 'unit-info', label: t('unitDetail.tabUnitInfo'), Icon: House },
    { id: 'tenant-member', label: t('unitDetail.tabTenantMember'), Icon: Users },
    { id: 'vehicle', label: t('unitDetail.tabVehicle'), Icon: Car },
  ];

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--color-text-primary)',
        padding: '0 16px 0 16px',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #E2E8F0',
        flexShrink: 0,
        zIndex: 40,
        boxSizing: 'border-box',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Top Bar: Back Button & Centered Unit Number */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '48px',
        }}
      >
        {/* Left: Back Button */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Unit List"
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

        {/* Centered Title (Unit Number, e.g. A0101) */}
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            margin: 0,
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            textAlign: 'center',
          }}
        >
          {unitCode}
        </h1>

        {/* Right Spacer for balanced centering */}
        <div style={{ width: '36px', height: '36px' }} />
      </div>

      {/* 3 Tabs Navigation Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.Icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange && onTabChange(tab.id)}
              style={{
                background: 'none',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                padding: '12px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: isActive ? 'var(--color-primary)' : '#64748B',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
            >
              <TabIcon
                size={18}
                weight={isActive ? 'fill' : 'regular'}
                color={isActive ? 'var(--color-primary)' : '#64748B'}
              />
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

/**
 * Unit Detail Static Footer Bar (for Tab 1: Unit Information)
 * Sticks to the bottom with pure white background and full width across the device frame.
 */
export const UnitDetailFooter = ({
  unitCode = 'A0101',
  onEdit,
}) => {
  const { t } = useLanguage();
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '16px 16px 6px 16px',
        boxSizing: 'border-box',
        width: '100%',
        flexShrink: 0,
        zIndex: 40,
        boxShadow: '0 -4px 14px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <button
        type="button"
        onClick={onEdit || (() => alert('Edit Unit Information: ' + unitCode))}
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #94A3B8', /* Crisp, thicker neutral border */
          borderRadius: 'var(--radius-sm)', /* 8px */
          color: 'var(--color-primary)', /* #053079 */
          padding: '13px 16px',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          boxShadow: 'none',
          transition: 'all 0.15s ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <PencilSimple size={18} weight="bold" color="var(--color-primary)" />
        <span>{t('unitDetail.editUnitInfo')}</span>
      </button>

      {/* Android Gesture Bar */}
      <AndroidGestureBar theme="light" />
    </footer>
  );
};

/**
 * Unit Detail Main View
 */
export const UnitDetailView = ({
  unit = {
    unitNo: 'A0101',
    floor: '1',
    residentType: 'Owner',
    residentName: 'Cindy Claudia',
    status: 'Occupied',
  },
  tower = { name: 'Tower A' },
  activeTab = 'unit-info',
}) => {
  const { t } = useLanguage();
  const [activeQrModal, setActiveQrModal] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQr = (meterNo) => {
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = qrCodeSample;
      link.download = `${meterNo || 'meter'}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download QR code', err);
    }
    setTimeout(() => setIsDownloading(false), 2000);
  };

  // Derived mock data
  const unitCode = unit?.unitNo || 'A0101';
  const towerName = tower?.name || `Tower ${unitCode.charAt(0)}`;
  const floorNumber = unit?.floor || '1';

  // Specific unit specs
  const unitArea = '148';
  const bedrooms = '3BR';
  const occupancyType = t('unitDetail.residential');
  const waterMeterNo = `WTR-${unitCode}`;
  const waterInitial = '41808.000';
  const electricMeterNo = `PLN-${unitCode}`;
  const electricCapacity = '5500';
  const electricInitial = '2484.0';

  const isVacant = unit?.status?.toLowerCase() === 'vacant' || unit?.residentType?.toLowerCase() === 'vacant';
  const isTenantMember = unit?.occupantRole === 'Tenant Member' || unit?.residentType === 'Tenant Member';

  // Owner & occupant data
  const ownerName = unit?.ownerName || 'Cindy Claudia';
  const ownerEmail = unit?.ownerEmail || 'cindy.claudia@gmail.com';
  const ownerPhone = unit?.ownerPhone || '+62 812-1010-2010';

  const occupantName = isVacant
    ? '-'
    : (unit?.residentName || unit?.occupantName || (isTenantMember ? 'Rina Haryanto' : 'Agus Haryanto'));
  const occupantEmail = isVacant
    ? '-'
    : (unit?.occupantEmail || (isTenantMember ? 'rina.haryanto@gmail.com' : 'agus.haryanto@gmail.com'));
  const occupantPhone = isVacant
    ? '-'
    : (unit?.occupantPhone || (isTenantMember ? '+62 811-9988-7766' : '+62 811-2233-4455'));
  const occupantRole = isVacant
    ? t('unitDetail.noOccupant')
    : (isTenantMember ? t('unitDetail.roleTenantMember') : t('unitDetail.roleRenter'));

  // Mock Owner Members for this unit
  const ownerMemberList = [
    {
      id: 'om1',
      name: 'Cindy Claudia',
      relation: t('unitDetail.relationHead'),
      email: 'cindy.claudia@gmail.com',
      phone: '+62 812-1010-2010',
    },
    {
      id: 'om2',
      name: 'Hendra Wijaya',
      relation: t('unitDetail.relationSpouse'),
      email: 'hendra.wijaya@gmail.com',
      phone: '+62 812-8899-7711',
    },
    {
      id: 'om3',
      name: isTenantMember ? 'Rina Haryanto' : 'Valerie Wijaya',
      relation: t('unitDetail.relationChild'),
      email: isTenantMember ? 'rina.haryanto@gmail.com' : 'valerie.wijaya@gmail.com',
      phone: isTenantMember ? '+62 811-9988-7766' : '+62 813-4455-6677',
      isOccupant: isTenantMember,
    },
  ];

  // Mock Occupant / Tenant Members for this unit (empty if vacant)
  const occupantMemberList = isVacant
    ? []
    : isTenantMember
    ? [
        {
          id: 'tm1',
          name: 'Agus Haryanto',
          relation: t('unitDetail.relationSpouse'),
          email: 'agus.haryanto@gmail.com',
          phone: '+62 811-2233-4455',
        },
        {
          id: 'tm2',
          name: 'Dimas Haryanto',
          relation: t('unitDetail.relationChild'),
          email: 'dimas.haryanto@gmail.com',
          phone: '+62 811-7788-9900',
        },
        {
          id: 'tm3',
          name: 'Siti Aminah',
          relation: t('unitDetail.relationEmployee'),
          email: 'siti.aminah@gmail.com',
          phone: '+62 813-1122-3344',
        },
      ]
    : [
        {
          id: 'tm1',
          name: 'Agus Haryanto',
          relation: t('unitDetail.relationHead'),
          email: 'agus.haryanto@gmail.com',
          phone: '+62 811-2233-4455',
          isOccupant: true,
        },
        {
          id: 'tm2',
          name: 'Rina Haryanto',
          relation: t('unitDetail.relationSpouse'),
          email: 'rina.haryanto@gmail.com',
          phone: '+62 811-9988-7766',
        },
        {
          id: 'tm3',
          name: 'Dimas Haryanto',
          relation: t('unitDetail.relationChild'),
          email: 'dimas.haryanto@gmail.com',
          phone: '+62 811-7788-9900',
        },
        {
          id: 'tm4',
          name: 'Siti Aminah',
          relation: t('unitDetail.relationEmployee'),
          email: 'siti.aminah@gmail.com',
          phone: '+62 813-1122-3344',
        },
      ];

  // Mock Registered Vehicles for this unit
  const vehicleList = [
    {
      id: 'v1',
      type: 'car',
      typeLabel: t('unitDetail.car'),
      plateNo: 'B 1234 ABC',
      model: 'Honda CR-V (Black)',
      parkingSlot: 'Basement 1 • Slot B1-14',
      accessCard: 'AC-CRV-0891',
      status: 'Active',
    },
    {
      id: 'v2',
      type: 'motorcycle',
      typeLabel: t('unitDetail.motorcycle'),
      plateNo: 'B 5678 XYZ',
      model: 'Vespa Primavera (White)',
      parkingSlot: 'Basement 2 • Slot M2-08',
      accessCard: 'AC-VSP-0422',
      status: 'Active',
    },
    {
      id: 'v3',
      type: 'car',
      typeLabel: t('unitDetail.car'),
      plateNo: 'B 9921 RHH',
      model: 'Toyota Alphard (Silver)',
      parkingSlot: 'Basement 1 • Slot B1-22',
      accessCard: 'AC-APH-1103',
      status: 'Active',
    },
    {
      id: 'v4',
      type: 'motorcycle',
      typeLabel: t('unitDetail.motorcycle'),
      plateNo: 'B 4402 MKL',
      model: 'Honda PCX (Blue)',
      parkingSlot: 'Basement 2 • Slot M2-15',
      accessCard: 'AC-PCX-0774',
      status: 'Active',
    },
    {
      id: 'v5',
      type: 'car',
      typeLabel: t('unitDetail.car'),
      plateNo: 'B 7710 AGH',
      model: 'Mitsubishi Pajero (White)',
      parkingSlot: 'Basement 1 • Slot B1-33',
      accessCard: 'AC-PJR-0552',
      status: 'Active',
    },
    {
      id: 'v6',
      type: 'motorcycle',
      typeLabel: t('unitDetail.motorcycle'),
      plateNo: 'B 3301 DMS',
      model: 'Yamaha NMAX (Red)',
      parkingSlot: 'Basement 2 • Slot M2-21',
      accessCard: 'AC-NMX-0318',
      status: 'Active',
    },
  ];

  const handleCopyBarcode = (type, val) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(val);
    }
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
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
        gap: '14px',
      }}
    >
      {/* ================= TAB 1: UNIT INFORMATION ================= */}
      {activeTab === 'unit-info' && (
        <>
          {/* 1. Card: Basic Unit Information */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)', /* 16px */
              border: '1px solid #E2E8F0',
              padding: '16px',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
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
                <Door size={20} weight="fill" color="var(--color-secondary)" />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)', /* Slate 700 */
                  letterSpacing: '-0.2px',
                }}
              >
                {t('unitDetail.basicInfo')}
              </h2>
            </div>

            {/* 3-Column Info Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px 8px',
              }}
            >
              {/* Unit Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', lineHeight: 1.3 }}>
                  {t('unitDetail.unitName')}
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {unitCode}
                </span>
              </div>

              {/* Occupancy Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', lineHeight: 1.3 }}>
                  {t('unitDetail.occupancyType')}
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {occupancyType}
                </span>
              </div>

              {/* Bedrooms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', lineHeight: 1.3 }}>
                  {t('unitDetail.bedrooms')}
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {bedrooms}
                </span>
              </div>

              {/* Tower */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', lineHeight: 1.3 }}>
                  {t('unitDetail.tower')}
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {towerName}
                </span>
              </div>

              {/* Floor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', lineHeight: 1.3 }}>
                  {t('unitDetail.floor')}
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {t('unitDetail.floorLabel', { floor: floorNumber })}
                </span>
              </div>

              {/* Unit Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', lineHeight: 1.3 }}>
                  {t('unitDetail.unitArea')}
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {unitArea} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>m²</span>
                </span>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', marginBottom: '6px' }}>
                {t('unitDetail.notes')}
              </span>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                {t('unitDetail.noNotes')}
              </div>
            </div>
          </div>

          {/* 2. Card: Owner & Occupant Information */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)', /* 16px */
              border: '1px solid #E2E8F0',
              padding: '16px',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)', /* 8px */
                  backgroundColor: 'var(--color-selected-background)',
                  border: '1px solid #BAE6FD',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IdentificationCard size={20} weight="fill" color="var(--color-secondary)" />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)', /* Slate 700 */
                  letterSpacing: '-0.2px',
                }}
              >
                {t('unitDetail.ownerOccupantInfo')}
              </h2>
            </div>

            {/* Section A: Owner Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: '-0.1px',
                  }}
                >
                  {t('unitDetail.ownerInfo')}
                </span>
              </div>

              {/* Vertical Stack: Name, Email, Phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Owner Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px' }}>
                    {t('unitDetail.ownerName')}
                  </span>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}>
                    {ownerName}
                  </span>
                </div>

                {/* Owner Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px' }}>
                    {t('unitDetail.email')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <EnvelopeSimple size={14} color="var(--color-text-secondary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {ownerEmail}
                    </span>
                  </div>
                </div>

                {/* Owner Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px' }}>
                    {t('unitDetail.phone')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--color-text-secondary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {ownerPhone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* Section B: Occupant Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: 'none', justifyContent: 'space-between', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: '-0.1px',
                  }}
                >
                  {t('unitDetail.occupantInfo')}
                </span>
                <span
                  style={{
                    backgroundColor: isVacant ? '#FFF7ED' : '#F1F5F9',
                    border: isVacant ? '1px solid #FFEDD5' : '1px solid #E2E8F0',
                    color: isVacant ? '#EA580C' : '#475569',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {isVacant ? t('unitDetail.vacant') : occupantRole}
                </span>
              </div>

              {!isVacant ? (
                <>
                  {/* Vertical Stack: Name, Email, Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Occupant Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px' }}>
                        {t('unitDetail.occupantName')}
                      </span>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}>
                        {occupantName}
                      </span>
                    </div>

                    {/* Occupant Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px' }}>
                        {t('unitDetail.email')}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <EnvelopeSimple size={14} color="var(--color-text-secondary)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                          {occupantEmail}
                        </span>
                      </div>
                    </div>

                    {/* Occupant Phone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px' }}>
                        {t('unitDetail.phone')}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="var(--color-text-secondary)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                          {occupantPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bukti File Surat Kuasa Huni */}
                  <div style={{ marginTop: '2px' }}>
                    <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.2px', marginBottom: '6px' }}>
                      {t('unitDetail.authorizationDoc')}
                    </span>
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <FilePdf size={26} weight="fill" color="#EF4444" style={{ flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            Surat_Kuasa_Huni_{unitCode}.pdf
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                            PDF • 2.4 MB
                          </span>
                        </div>
                      </div>

                      {/* Download / View Action Button */}
                      <button
                        type="button"
                        onClick={() => alert(`Mengunduh Surat_Kuasa_Huni_${unitCode}.pdf`)}
                        style={{
                          background: 'none',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--color-primary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <DownloadSimple size={14} weight="bold" />
                        <span>{t('unitDetail.downloadDoc')}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed #CBD5E1',
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '0.8125rem',
                    color: '#64748B',
                    fontWeight: 500,
                  }}
                >
                  {t('unitDetail.emptyOccupantDesc')}
                </div>
              )}
            </div>
          </div>

          {/* 2. Card: Utility Info */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)', /* 16px */
              border: '1px solid #E2E8F0',
              padding: '16px',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
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
                <Gauge size={20} weight="fill" color="var(--color-secondary)" />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)', /* Slate 700 */
                  letterSpacing: '-0.2px',
                }}
              >
                {t('unitDetail.utilityInfo')}
              </h2>
            </div>

            {/* Section: Water Meter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Drop size={16} weight="fill" color="#0284C7" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0284C7' }}>
                  {t('unitDetail.waterMeter')}
                </span>
              </div>

              {/* Water Meter Stats Box */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-sm)', /* 8px */
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {t('unitDetail.meterNo')}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {waterMeterNo}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {t('unitDetail.initialMeter')}
                  </span>
                  <span style={{ fontSize: '1rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {waterInitial}
                  </span>
                </div>
              </div>

              {/* CTA View QR Code Button (Primary Brand Color & White Text/Icon) */}
              <button
                type="button"
                onClick={() =>
                  setActiveQrModal({
                    type: 'water',
                    meterName: t('unitDetail.waterMeter'),
                    meterNo: waterMeterNo,
                    initial: waterInitial,
                    unit: unitCode,
                    themeColor: '#0284C7',
                    themeBg: '#EFF6FF',
                    themeBorder: '#BFDBFE',
                    IconComponent: Drop,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  outline: 'none',
                  boxShadow: 'none',
                }}
                onMouseDown={(e) => (e.currentTarget.style.opacity = '0.92')}
                onMouseUp={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <QrCode size={17} weight="bold" color="#FFFFFF" />
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{t('unitDetail.viewQrCode')}</span>
                </div>
                <CaretRight size={14} weight="bold" color="#FFFFFF" />
              </button>
            </div>

            {/* Section: Electricity Meter (Yellow Theme) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightning size={16} weight="fill" color="#EAB308" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#CA8A04' }}>
                  {t('unitDetail.electricMeter')}
                </span>
              </div>

              {/* Electric Meter Stats Box */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-sm)', /* 8px */
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {t('unitDetail.meterNo')}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {electricMeterNo}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {t('unitDetail.capacity')}
                  </span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {electricCapacity} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>VA</span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {t('unitDetail.initialMeter')}
                  </span>
                  <span style={{ fontSize: '1rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {electricInitial}
                  </span>
                </div>
              </div>

              {/* CTA View QR Code Button (Primary Brand Color & White Text/Icon) */}
              <button
                type="button"
                onClick={() =>
                  setActiveQrModal({
                    type: 'electric',
                    meterName: t('unitDetail.electricMeter'),
                    meterNo: electricMeterNo,
                    initial: electricInitial,
                    capacity: electricCapacity,
                    unit: unitCode,
                    themeColor: '#EAB308',
                    themeBg: '#FEFCE8',
                    themeBorder: '#FEF08A',
                    IconComponent: Lightning,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  outline: 'none',
                  boxShadow: 'none',
                }}
                onMouseDown={(e) => (e.currentTarget.style.opacity = '0.92')}
                onMouseUp={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <QrCode size={17} weight="bold" color="#FFFFFF" />
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{t('unitDetail.viewQrCode')}</span>
                </div>
                <CaretRight size={14} weight="bold" color="#FFFFFF" />
              </button>
            </div>
          </div>

          {/* 3. Card: Bill Settings */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)', /* 16px */
              border: '1px solid #E2E8F0',
              padding: '16px',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)', /* 8px */
                  backgroundColor: 'var(--color-selected-background)', /* #EAF7FF */
                  border: '1px solid #BAE6FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Receipt size={20} weight="fill" color="var(--color-secondary)" />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)', /* Slate 700 */
                  letterSpacing: '-0.2px',
                }}
              >
                {t('unitDetail.billSettings')}
              </h2>
            </div>

            {/* Top Section: Active Billing Channels (3-column cards) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {/* Electricity Channel */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #F1F5F9',
                  padding: '10px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#FEFCE8',
                    border: '1px solid #FEF08A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lightning size={16} weight="fill" color="#EAB308" />
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.2,
                    minHeight: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('unitDetail.electricBill')}
                </span>
                <span
                  style={{
                    backgroundColor: '#00C853',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {t('unitDetail.activeStatus')}
                </span>
              </div>

              {/* Water Channel */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #F1F5F9',
                  padding: '10px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Drop size={16} weight="fill" color="#0284C7" />
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.2,
                    minHeight: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('unitDetail.waterBill')}
                </span>
                <span
                  style={{
                    backgroundColor: '#00C853',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {t('unitDetail.activeStatus')}
                </span>
              </div>

              {/* SC & SF Channel */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #F1F5F9',
                  padding: '10px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#FFF7ED',
                    border: '1px solid #FFEDD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <House size={16} weight="fill" color="#F97316" />
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.2,
                    minHeight: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('unitDetail.iplBill')}
                </span>
                <span
                  style={{
                    backgroundColor: '#00C853',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {t('unitDetail.activeStatus')}
                </span>
              </div>
            </div>

            {/* Middle Section: SC & SF Bill Parameters (Horizontal rows stacked vertically) */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #E2E8F0',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Target Tagihan with bottom divider outline */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
                  {t('unitDetail.iplTarget')}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {t('unitDetail.iplTargetVal')}
                </span>
              </div>

              {/* Interval Tagihan */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
                  {t('unitDetail.iplInterval')}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {t('unitDetail.iplIntervalVal')}
                </span>
              </div>
            </div>

            {/* Bottom Section: Dedicated Last Invoice Issued Card (Primary Fill) */}
            <div
              style={{
                backgroundColor: 'var(--color-primary)', /* #053079 */
                borderRadius: 'var(--radius-sm)', /* 8px */
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Receipt size={18} weight="fill" color="#FFFFFF" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.2 }}>
                    {t('unitDetail.iplLastIssued')}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    {t('unitDetail.iplLastIssuedVal')}
                  </span>
                </div>
              </div>

              {/* CTA View Invoice Text Link */}
              <button
                type="button"
                onClick={() => {
                  alert('Opening Invoice: 01 Jan 2026');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-sans)',
                  flexShrink: 0,
                }}
              >
                <span>{t('unitDetail.viewInvoice')}</span>
                <CaretRight size={14} weight="bold" color="#FFFFFF" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= TAB 2: TENANT & OWNER MEMBER ================= */}
      {activeTab === 'tenant-member' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ─── CARD 1: OWNER MEMBERS ─── */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: 'none',
                backgroundColor: 'var(--color-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Key size={16} weight="fill" color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.2px', lineHeight: 1.3 }}>
                    {t('unitDetail.ownerMembers')}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: '1px' }}>
                    <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Owner: </span>{ownerName}
                  </div>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0,
                }}
              >
                {t('unitDetail.ownerMemberCount', { count: ownerMemberList.length })}
              </span>
            </div>

            {/* Member Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ownerMemberList.map((member, index) => (
                <div
                  key={member.id}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    borderBottom: index < ownerMemberList.length - 1 ? '1px solid #E2E8F0' : 'none',
                  }}
                >
                  {/* Name + Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', letterSpacing: '-0.1px' }}>
                      {member.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      {(member.isOccupant || member.name === occupantName) && (
                        <span
                          style={{
                            backgroundColor: 'var(--color-selected-background)',
                            border: '1px solid #BAE6FD',
                            color: 'var(--color-primary)',
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-full)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t('unitDetail.occupantBadge')}
                        </span>
                      )}
                      {member.relation && (
                        <span
                          style={{
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            color: '#475569',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-full)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {member.relation}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Email + Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <EnvelopeSimple size={12} color="#94A3B8" />
                      <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{member.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={12} color="#94A3B8" />
                      <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{member.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── CARD 2: OCCUPANT MEMBERS ─── */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: 'none',
                backgroundColor: 'var(--color-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <House size={16} weight="fill" color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.2px', lineHeight: 1.3 }}>
                    {t('unitDetail.occupantMembers')}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: '1px' }}>
                    {isVacant
                      ? t('unitDetail.vacant')
                      : <><span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Occupant: </span>{occupantName}</>}
                  </div>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0,
                }}
              >
                {isVacant ? t('unitDetail.vacant') : t('unitDetail.occupantMemberCount', { count: occupantMemberList.length })}
              </span>
            </div>

            {/* Member Rows or Empty State */}
            {occupantMemberList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {occupantMemberList.map((member, index) => (
                  <div
                    key={member.id}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      borderBottom: index < occupantMemberList.length - 1 ? '1px solid #E2E8F0' : 'none',
                    }}
                  >
                    {/* Name + Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', letterSpacing: '-0.1px' }}>
                        {member.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        {(member.isOccupant || member.name === occupantName) && (
                          <span
                            style={{
                              backgroundColor: 'var(--color-selected-background)',
                              border: '1px solid #BAE6FD',
                              color: 'var(--color-primary)',
                              fontSize: '0.625rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 'var(--radius-full)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t('unitDetail.occupantBadge')}
                          </span>
                        )}
                        {member.relation && (
                          <span
                            style={{
                              backgroundColor: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              color: '#475569',
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: 'var(--radius-full)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {member.relation}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Email + Phone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <EnvelopeSimple size={12} color="#94A3B8" />
                        <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{member.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={12} color="#94A3B8" />
                        <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <House size={20} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748B' }}>
                  {t('unitDetail.emptyOccupantDesc')}
                </div>
              </div>
            )}
          </div>

        </div>
      )}



      {/* ================= TAB 3: VEHICLE ================= */}
      {activeTab === 'vehicle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Header Count Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '2px 4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Car size={18} weight="fill" color="var(--color-primary)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {t('unitDetail.vehicleCount', { count: vehicleList.length })}
              </span>
            </div>
          </div>

          {/* Vehicle Cards List */}
          {vehicleList.map((veh) => {
            const isCar = veh.type === 'car';
            return (
              <div
                key={veh.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E2E8F0',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-selected-background)',
                    border: '1px solid #BAE6FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isCar ? (
                    <Car size={22} weight="fill" color="var(--color-secondary)" />
                  ) : (
                    <Motorcycle size={22} weight="fill" color="var(--color-secondary)" />
                  )}
                </div>

                {/* Plate + Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {veh.plateNo}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                    {veh.model}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Bottom Sheet Modal (Mounted strictly inside Phone Frame) */}
      {(() => {
        if (!activeQrModal) return null;
        const modalTarget = typeof document !== 'undefined'
          ? document.getElementById('phone-screen-container') || document.querySelector('.android-device-screen') || document.body
          : null;
        const IconComponent = activeQrModal.IconComponent || QrCode;

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
            onClick={() => setActiveQrModal(null)}
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
                maxHeight: '90%',
                overflowY: 'auto',
                boxSizing: 'border-box',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Drag Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '9999px' }} />
              </div>

              {/* Header: Icon + Title + Close Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: activeQrModal.themeBg,
                      border: `1px solid ${activeQrModal.themeBorder}`,
                      color: activeQrModal.themeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={20} weight="fill" color={activeQrModal.themeColor} />
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.0625rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.2px',
                        lineHeight: 1.2,
                      }}
                    >
                      {activeQrModal.meterName} QR Code
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveQrModal(null)}
                  aria-label="Close QR Modal"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#E2E8F0')}
                  onMouseUp={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* QR Code Container Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                {/* QR Code Visual Image with White Background */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={qrCodeSample}
                    alt="Meter QR Code"
                    style={{
                      width: '180px',
                      height: '180px',
                      objectFit: 'contain',
                      display: 'block',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>

                {/* Subtitle / Hint */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  {t('unitDetail.scanHint')}
                </p>
              </div>

              {/* Stats Summary Grid: Meter No. + Initial Meter */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginTop: '14px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', marginBottom: '2px' }}>
                    {t('unitDetail.meterNo')}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {activeQrModal.meterNo}
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', marginBottom: '2px' }}>
                    {t('unitDetail.initialMeter')}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {activeQrModal.initial}
                  </span>
                </div>
              </div>

              {/* Download QR Code Action Button */}
              <button
                type="button"
                onClick={() => handleDownloadQr(activeQrModal.meterNo)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: isDownloading ? '#16A34A' : 'var(--color-primary)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'none',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isDownloading ? (
                  <>
                    <Check size={18} weight="bold" />
                    <span>{t('unitDetail.qrDownloaded')}</span>
                  </>
                ) : (
                  <>
                    <DownloadSimple size={18} weight="bold" />
                    <span>{t('unitDetail.downloadQr')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}
    </div>
  );
};

export default UnitDetailView;

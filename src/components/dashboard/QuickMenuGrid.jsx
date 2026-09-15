import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { X, MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react';

// Import 3D Icons
import billingPaymentImg from '../../assets/menu-icons/billing-payment-3d.png';
import facilityReservationImg from '../../assets/menu-icons/facility-reservation-3d.png';
import workRequestImg from '../../assets/menu-icons/work-request-3d.png';
import homeServiceImg from '../../assets/menu-icons/home-service-3d.png';
import packageImg from '../../assets/menu-icons/package-3d.png';
import visitorInformationImg from '../../assets/menu-icons/visitor-information-3d.png';
import votingsImg from '../../assets/menu-icons/votings-3d.png';
import workOrderImg from '../../assets/menu-icons/work-order-3d.png';
import inspectionImg from '../../assets/menu-icons/inspection-3d.png';
import assetImg from '../../assets/menu-icons/asset-3d.png';
import attendanceImg from '../../assets/menu-icons/attendance-3d.png';
import scanMeterImg from '../../assets/menu-icons/scan-meter-3d.png';
import inOutGoodsImg from '../../assets/menu-icons/in-out-goods-3d.png';
import fitoutPermitImg from '../../assets/menu-icons/fitout-permit-3d.png';
import workPermitImg from '../../assets/menu-icons/work-permit-3d.png';
import incidentReportImg from '../../assets/menu-icons/incident-report-3d.png';
import tenantUnitImg from '../../assets/menu-icons/tenant-unit-3d.png';
import allMenuImg from '../../assets/menu-icons/all-menu-3d.png';

export const getLocalizedTitle = (itemId, defaultTitle, t) => {
  switch (itemId) {
    case 'bill-payment': return t('menu.billingPayment');
    case 'attendance': return t('menu.attendance');
    case 'tenant-unit': return t('menu.tenantUnit');
    case 'scan-meter': return t('menu.scanMeter');
    case 'work-request': return t('menu.workRequest');
    case 'work-order': return t('menu.workOrder');
    case 'home-service': return t('menu.homeService');
    case 'facility-reservation': return t('menu.facilityReservation');
    case 'in-out-goods': return t('menu.inOutGoods');
    case 'fitout-permit': return t('menu.fitoutPermit');
    case 'work-permit': return t('menu.workPermit');
    case 'all-menu': return t('dashboard.allMenu');
    case 'package': return t('menu.package');
    case 'visitor-information': return t('menu.visitorInfo');
    case 'votings': return t('menu.votings');
    case 'incident-report': return t('menu.incidentReport');
    case 'inspection': return t('menu.inspection');
    case 'asset': return t('menu.asset');
    default: return defaultTitle;
  }
};

export const getLocalizedCategory = (secId, defaultName, t) => {
  switch (secId) {
    case 'finance-billing': return t('cat.finance');
    case 'permit-tenant-request': return t('cat.permitsRequests');
    case 'resident-security': return t('cat.security');
    case 'resident-community': return t('cat.residentCommunity');
    case 'operations-management': return t('cat.operations');
    case 'resident-property': return t('cat.property');
    case 'resident-services': return t('cat.services');
    case 'security-visitors': return t('cat.security');
    case 'permits-approvals': return t('cat.permits');
    default: return defaultName;
  }
};

// 12 Items for BM Dashboard (3 Rows x 4 Columns):
// Row 1: Bill & Payment, Work Attendance, Tenant Unit, Scan Meter
// Row 2: Work Request, Work Order, Home Service, Facility Reservation
// Row 3: In & Out Goods, Fitout Permit, Work Permit, All Menu
export const BM_DASHBOARD_MENU_ITEMS = [
  {
    id: 'bill-payment',
    title: 'Bill &\nPayment',
    icon: billingPaymentImg,
    category: 'Finance',
  },
  {
    id: 'attendance',
    title: 'Work\nAttendance',
    icon: attendanceImg,
    category: 'Operations',
  },
  {
    id: 'tenant-unit',
    title: 'Tenant\nUnit',
    icon: tenantUnitImg,
    category: 'Resident',
  },
  {
    id: 'scan-meter',
    title: 'Scan\nMeter',
    icon: scanMeterImg,
    category: 'Operations',
  },
  {
    id: 'work-request',
    title: 'Work\nRequest',
    icon: workRequestImg,
    category: 'Operations',
  },
  {
    id: 'work-order',
    title: 'Work\nOrder',
    icon: workOrderImg,
    category: 'Operations',
  },
  {
    id: 'home-service',
    title: 'Home\nService',
    icon: homeServiceImg,
    category: 'Services',
  },
  {
    id: 'facility-reservation',
    title: 'Facility\nReservation',
    icon: facilityReservationImg,
    category: 'Facilities',
  },
  {
    id: 'in-out-goods',
    title: 'In & Out\nGoods',
    icon: inOutGoodsImg,
    category: 'Logistics',
  },
  {
    id: 'fitout-permit',
    title: 'Fitout\nPermit',
    icon: fitoutPermitImg,
    category: 'Permits',
  },
  {
    id: 'work-permit',
    title: 'Work\nPermit',
    icon: workPermitImg,
    category: 'Permits',
  },
  {
    id: 'all-menu',
    title: 'All\nMenu',
    icon: allMenuImg,
    isLauncher: true,
  },
];

// 12 Items for Tenant Dashboard (3 Rows x 4 Columns - Resident/Tenant Focused)
export const TENANT_DASHBOARD_MENU_ITEMS = [
  {
    id: 'bill-payment',
    title: 'Bill &\nPayment',
    icon: billingPaymentImg,
    category: 'Finance',
  },
  {
    id: 'facility-reservation',
    title: 'Facility\nReservation',
    icon: facilityReservationImg,
    category: 'Facilities',
  },
  {
    id: 'work-request',
    title: 'Work\nRequest',
    icon: workRequestImg,
    category: 'Operations',
  },
  {
    id: 'home-service',
    title: 'Home\nService',
    icon: homeServiceImg,
    category: 'Services',
  },
  {
    id: 'in-out-goods',
    title: 'In & Out\nGoods',
    icon: inOutGoodsImg,
    category: 'Logistics',
  },
  {
    id: 'work-permit',
    title: 'Work\nPermit',
    icon: workPermitImg,
    category: 'Permits',
  },
  {
    id: 'fitout-permit',
    title: 'Fitout\nPermit',
    icon: fitoutPermitImg,
    category: 'Permits',
  },
  {
    id: 'incident-report',
    title: 'Incident\nReport',
    icon: incidentReportImg,
    category: 'Security',
  },
  {
    id: 'package',
    title: 'Package',
    icon: packageImg,
    category: 'Logistics',
  },
  {
    id: 'visitor-information',
    title: 'Visitor\nInformation',
    icon: visitorInformationImg,
    category: 'Security',
  },
  {
    id: 'votings',
    title: 'Votings',
    icon: votingsImg,
    category: 'Resident',
  },
  {
    id: 'all-menu',
    title: 'All\nMenu',
    icon: allMenuImg,
    isLauncher: true,
  },
];

export const DASHBOARD_MENU_ITEMS = BM_DASHBOARD_MENU_ITEMS;

// Categorized Full Features for BM "All Menu" Bottom Sheet
export const BM_CATEGORIZED_FEATURES = [
  {
    id: 'finance-billing',
    name: 'Finance & Billing',
    items: [
      { id: 'bill-payment', title: 'Bill & Payment', icon: billingPaymentImg, desc: 'Maintenance fees, bills, electricity & water' },
    ],
  },
  {
    id: 'permit-tenant-request',
    name: 'Permit & Tenant Request',
    items: [
      { id: 'facility-reservation', title: 'Facility\nReservation', icon: facilityReservationImg, desc: 'Facility booking & room reservations' },
      { id: 'work-request', title: 'Work\nRequest', icon: workRequestImg, desc: 'Unit maintenance & repair requests' },
      { id: 'home-service', title: 'Home\nService', icon: homeServiceImg, desc: 'Housekeeping, AC cleaning & unit services' },
      { id: 'in-out-goods', title: 'In & Out\nGoods', icon: inOutGoodsImg, desc: 'Incoming & outgoing logistics logs' },
      { id: 'work-permit', title: 'Work\nPermit', icon: workPermitImg, desc: 'Vendor & contractor clearance permits' },
      { id: 'fitout-permit', title: 'Fitout\nPermit', icon: fitoutPermitImg, desc: 'Tenant unit renovation & fitout permits' },
    ],
  },
  {
    id: 'resident-security',
    name: 'Resident & Security Services',
    items: [
      { id: 'tenant-unit', title: 'Tenant\nUnit', icon: tenantUnitImg, desc: 'Unit ownership, occupancy & resident member records' },
      { id: 'package', title: 'Package', icon: packageImg, desc: 'Courier packages & delivery tracking' },
      { id: 'visitor-information', title: 'Visitor\nInformation', icon: visitorInformationImg, desc: 'Guest logs & digital visitor pass QR' },
      { id: 'incident-report', title: 'Incident\nReport', icon: incidentReportImg, desc: 'Emergency reports & incident logging' },
    ],
  },
  {
    id: 'operations-management',
    name: 'Operations & Building Management',
    items: [
      { id: 'work-order', title: 'Work\nOrder', icon: workOrderImg, desc: 'Technician tasks & internal work orders' },
      { id: 'inspection', title: 'Inspection', icon: inspectionImg, desc: 'Routine facility & building checks' },
      { id: 'asset', title: 'Asset', icon: assetImg, desc: 'Building asset management & tagging' },
      { id: 'attendance', title: 'Work\nAttendance', icon: attendanceImg, desc: 'Staff shift clock-in & attendance tracking' },
      { id: 'scan-meter', title: 'Scan\nMeter', icon: scanMeterImg, desc: 'Utility meter barcode scanning & OCR' },
      { id: 'votings', title: 'Votings', icon: votingsImg, desc: 'Resident polling & AGM voting records' },
    ],
  },
];

// Categorized Full Features for Tenant "All Menu" Bottom Sheet
// (Strictly resident features only, Tenant Unit & Operations excluded)
export const TENANT_CATEGORIZED_FEATURES = [
  {
    id: 'finance-billing',
    name: 'Finance & Billing',
    items: [
      { id: 'bill-payment', title: 'Bill & Payment', icon: billingPaymentImg, desc: 'Maintenance fees, bills, electricity & water' },
    ],
  },
  {
    id: 'permit-tenant-request',
    name: 'Permit & Tenant Request',
    items: [
      { id: 'facility-reservation', title: 'Facility\nReservation', icon: facilityReservationImg, desc: 'Facility booking & room reservations' },
      { id: 'work-request', title: 'Work\nRequest', icon: workRequestImg, desc: 'Unit maintenance & repair requests' },
      { id: 'home-service', title: 'Home\nService', icon: homeServiceImg, desc: 'Housekeeping, AC cleaning & unit services' },
      { id: 'in-out-goods', title: 'In & Out\nGoods', icon: inOutGoodsImg, desc: 'Incoming & outgoing logistics logs' },
      { id: 'work-permit', title: 'Work\nPermit', icon: workPermitImg, desc: 'Vendor & contractor clearance permits' },
      { id: 'fitout-permit', title: 'Fitout\nPermit', icon: fitoutPermitImg, desc: 'Tenant unit renovation & fitout permits' },
    ],
  },
  {
    id: 'resident-community',
    name: 'Resident & Community Services',
    items: [
      { id: 'package', title: 'Package', icon: packageImg, desc: 'Courier packages & delivery tracking' },
      { id: 'visitor-information', title: 'Visitor\nInformation', icon: visitorInformationImg, desc: 'Guest logs & digital visitor pass QR' },
      { id: 'incident-report', title: 'Incident\nReport', icon: incidentReportImg, desc: 'Emergency reports & incident logging' },
      { id: 'votings', title: 'Votings', icon: votingsImg, desc: 'Resident polling & AGM voting records' },
    ],
  },
];

export const CATEGORIZED_FEATURES = BM_CATEGORIZED_FEATURES;

export const QuickMenuGrid = ({ onMenuItemClick, isTenant = false }) => {
  const { t } = useLanguage();
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentMenuItems = isTenant ? TENANT_DASHBOARD_MENU_ITEMS : BM_DASHBOARD_MENU_ITEMS;
  const currentCategories = isTenant ? TENANT_CATEGORIZED_FEATURES : BM_CATEGORIZED_FEATURES;

  const handleClick = (item) => {
    if (item.isLauncher) {
      setIsAllMenuOpen(true);
      return;
    }

    const localizedTitle = getLocalizedTitle(item.id, item.title, t).replace('\n', ' ');
    if (onMenuItemClick) {
      onMenuItemClick({ ...item, title: localizedTitle });
    } else {
      alert(t('dashboard.openModule', { name: localizedTitle }));
    }
  };

  // Filter categorized sections
  const filteredCategories = currentCategories.map((section) => {
    const locSecName = getLocalizedCategory(section.id, section.name, t);
    const matchedItems = section.items.filter((item) => {
      const locTitle = getLocalizedTitle(item.id, item.title, t);
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        locTitle.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        locSecName.toLowerCase().includes(q)
      );
    });

    if (matchedItems.length === 0) return null;
    return { ...section, name: locSecName, items: matchedItems };
  }).filter(Boolean);

  return (
    <>
      {/* 3-Row × 4-Column Grid on Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          width: '100%',
          boxSizing: 'border-box',
        }}
        className="quick-menu-grid"
      >
        {currentMenuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item)}
            className="quick-menu-card"
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              padding: '10px 4px 10px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '6px',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              outline: 'none',
              userSelect: 'none',
              minHeight: '102px',
              boxSizing: 'border-box',
              boxShadow: 'none',
            }}
          >
            {/* 3D Icon Graphic */}
            <div
              style={{
                width: '54px',
                height: '54px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src={item.icon}
                alt={item.title.replace('\n', ' ')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.07))',
                }}
              />
            </div>

            {/* Label (2 lines allowed, centered) */}
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#334155',
                textAlign: 'center',
                lineHeight: 1.18,
                whiteSpace: 'pre-line',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '26px',
              }}
            >
              {getLocalizedTitle(item.id, item.title, t)}
            </span>
          </button>
        ))}
      </div>

      {/* Modern Organized All Menu Bottom Sheet (Portal to Android Device Frame) */}
      {isAllMenuOpen && (
        (() => {
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
                backgroundColor: 'rgba(11, 17, 32, 0.82)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
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
              onClick={() => setIsAllMenuOpen(false)}
            >
              <div
                style={{
                  width: '100%',
                  height: '92%',
                  maxHeight: '92%',
                  backgroundColor: '#FFFFFF',
                  borderTopLeftRadius: '28px',
                  borderTopRightRadius: '28px',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 -16px 40px rgba(0, 0, 0, 0.4)',
                  animation: 'bottomSheetSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 10000,
                  margin: 0,
                  boxSizing: 'border-box',
                }}
                onClick={(e) => e.stopPropagation()}
              >
            {/* Sheet Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
              <div style={{ width: '48px', height: '5px', backgroundColor: '#CBD5E1', borderRadius: '9999px' }} />
            </div>

            {/* Header Area */}
            <div
              style={{
                padding: '8px 16px 12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.2px' }}>
                    {t('menu.allMenuTitle')}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: '#EAF7FF',
                      color: '#053079',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #BAE6FD',
                    }}
                  >
                    {t('menu.featuresCount', { count: currentCategories.reduce((acc, cat) => acc + cat.items.length, 0) })}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 400 }}>
                  {t('menu.allMenuSubtitle')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAllMenuOpen(false)}
                aria-label="Close"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '12px 16px 8px 16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <MagnifyingGlass
                  size={16}
                  weight="bold"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('menu.searchPlaceholder')}
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '0 36px 0 36px',
                    fontSize: '0.8125rem',
                    color: '#334155',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Categorized List Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 16px 32px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map((sec) => (
                  <div key={sec.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Category Title Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#053079',
                          letterSpacing: '-0.2px',
                        }}
                      >
                        {sec.name}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>
                        {sec.items.length} {sec.items.length > 1 ? t('menu.featuresPlural') : t('menu.featureSingle')}
                      </span>
                    </div>

                    {/* 4-Col Grid for this category */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '10px',
                      }}
                    >
                      {sec.items.map((item) => {
                        const locItemTitle = getLocalizedTitle(item.id, item.title, t);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setIsAllMenuOpen(false);
                              handleClick(item);
                            }}
                            className="quick-menu-card"
                            style={{
                              backgroundColor: '#F8FAFC',
                              borderRadius: '16px',
                              border: '1px solid #F1F5F9',
                              padding: '10px 4px 10px 4px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              gap: '6px',
                              cursor: 'pointer',
                              transition: 'transform 0.15s ease',
                              outline: 'none',
                              userSelect: 'none',
                              minHeight: '112px',
                              boxSizing: 'border-box',
                              boxShadow: 'none',
                            }}
                          >
                            <div
                              style={{
                                width: '64px',
                                height: '64px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={item.icon}
                                alt={locItemTitle.replace('\n', ' ')}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08))',
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                                color: '#334155',
                                textAlign: 'center',
                                lineHeight: 1.18,
                                fontFamily: 'var(--font-sans)',
                                letterSpacing: '-0.15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '26px',
                                whiteSpace: 'pre-line',
                              }}
                            >
                              {locItemTitle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                /* Empty Search State */
                <div
                  style={{
                    padding: '40px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '8px',
                    color: '#94A3B8',
                  }}
                >
                  <FunnelSimple size={36} weight="duotone" color="#CBD5E1" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                    {t('menu.noResults')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {t('menu.noResultsDesc')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );

      return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
    })()
  )}

      <style>{`
        .quick-menu-card:active {
          transform: scale(0.96);
          background-color: #F1F5F9 !important;
        }

        @keyframes bottomSheetSlideUp {
          from {
            transform: translateY(100%);
            opacity: 0.6;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default QuickMenuGrid;

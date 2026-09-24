import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CaretDown,
  CalendarBlank,
  X,
  MagnifyingGlass,
  MapPin,
  Clock,
  CheckCircle,
  Sparkle,
  Star,
  ShieldCheck,
  Funnel,
  SealCheck,
  ArrowRight,
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

const INITIAL_HOME_SERVICES = [
  // 6 On Survey / Assessment
  {
    id: 'hs-1',
    code: 'HS-2026-0812',
    title: 'AC Deep Cleaning & Chemical Wash Survey',
    category: 'AC & Ventilation',
    status: 'ON_SURVEY',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 1502 (Tower A)',
    scheduledTime: 'Today, 14:00 WIB',
    assignedTo: 'Siti Rahma (Housekeeper)',
    createdAt: '25 Sep 2026, 09:00',
  },
  {
    id: 'hs-2',
    code: 'hs-2',
    codeText: 'HS-2026-0815',
    title: 'Balcony Hydro-Pressure Wash Survey',
    category: 'Balcony & Exterior Glass',
    status: 'ON_SURVEY',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 0910 (Tower B)',
    scheduledTime: 'Today, 16:30 WIB',
    assignedTo: 'Budi Santoso',
    createdAt: '25 Sep 2026, 11:15',
  },
  {
    id: 'hs-3',
    code: 'HS-2026-0809',
    title: 'Marble Floor Crystallization Assessment',
    category: 'Floor & Polishing',
    status: 'ON_SURVEY',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 2004 (Tower C)',
    scheduledTime: 'Tomorrow, 10:00 WIB',
    assignedTo: 'Siti Rahma & Team',
    createdAt: '24 Sep 2026, 15:40',
  },
  {
    id: 'hs-4',
    code: 'HS-2026-0805',
    title: 'Post-Renovation Dust & Debris Survey',
    category: 'Deep Cleaning',
    status: 'ON_SURVEY',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 0612 (Tower A)',
    scheduledTime: 'Tomorrow, 13:30 WIB',
    assignedTo: 'Dewi Lestari',
    createdAt: '24 Sep 2026, 10:20',
  },
  {
    id: 'hs-5',
    code: 'HS-2026-0798',
    title: 'Kitchen Exhaust Hood Degreasing Inspection',
    category: 'Kitchen Deep Clean',
    status: 'ON_SURVEY',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 1802 (Tower B)',
    scheduledTime: '27 Sep 2026, 11:00 WIB',
    assignedTo: 'Siti Rahma',
    createdAt: '23 Sep 2026, 16:30',
  },
  {
    id: 'hs-6',
    code: 'HS-2026-0792',
    title: 'Mattress & Upholstery Mite Sanitizing Survey',
    category: 'Sanitization & UV',
    status: 'ON_SURVEY',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 1108 (Tower C)',
    scheduledTime: '28 Sep 2026, 14:00 WIB',
    assignedTo: 'Dewi Lestari',
    createdAt: '23 Sep 2026, 09:10',
  },

  // 12 Services Executed / Completed / In Progress
  {
    id: 'hs-7',
    code: 'HS-2026-0788',
    title: 'Full Unit Deep Cleaning & Sanitization',
    category: 'General Housekeeping',
    status: 'ON_WORK',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 1204 (Tower B)',
    scheduledTime: 'Today, 13:00 WIB',
    assignedTo: 'Siti Rahma & Team',
    createdAt: '24 Sep 2026, 14:00',
  },
  {
    id: 'hs-8',
    code: 'HS-2026-0781',
    title: 'Sofa & Fabric Wet Extraction Vacuuming',
    category: 'Upholstery & Carpet',
    status: 'ON_WORK',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 0802 (Tower A)',
    scheduledTime: 'Today, 15:30 WIB',
    assignedTo: 'Dewi Lestari',
    createdAt: '24 Sep 2026, 09:30',
  },
  {
    id: 'hs-9',
    code: 'HS-2026-0775',
    title: 'Bathroom Anti-Bacterial Descaling',
    category: 'Bathroom Sanitization',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 2101 (Tower C)',
    scheduledTime: '22 Sep 2026, 10:00 WIB',
    completedAt: '22 Sep 2026, 11:45 WIB',
    assignedTo: 'Siti Rahma',
  },
  {
    id: 'hs-10',
    code: 'HS-2026-0768',
    title: 'Master Bedroom AC Filter Steam Wash',
    category: 'AC & Ventilation',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 0512 (Tower A)',
    scheduledTime: '21 Sep 2026, 14:00 WIB',
    completedAt: '21 Sep 2026, 15:30 WIB',
    assignedTo: 'Budi Santoso',
  },
  {
    id: 'hs-11',
    code: 'HS-2026-0760',
    title: 'Curtain & Drapery Steam Cleaning',
    category: 'Fabric Care',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 1805 (Tower B)',
    scheduledTime: '20 Sep 2026, 11:00 WIB',
    completedAt: '20 Sep 2026, 12:30 WIB',
    assignedTo: 'Dewi Lestari',
  },
  {
    id: 'hs-12',
    code: 'HS-2026-0752',
    title: 'Kitchen Backsplash & Stove Degreasing',
    category: 'Kitchen Deep Clean',
    status: 'COMPLETE',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 0308 (Tower A)',
    scheduledTime: '19 Sep 2026, 15:00 WIB',
    completedAt: '19 Sep 2026, 16:40 WIB',
    assignedTo: 'Siti Rahma',
  },
  {
    id: 'hs-13',
    code: 'HS-2026-0744',
    title: 'Granite Tabletop Buffing & Protection',
    category: 'Floor & Polishing',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 1102 (Tower C)',
    scheduledTime: '18 Sep 2026, 09:30 WIB',
    completedAt: '18 Sep 2026, 11:00 WIB',
    assignedTo: 'Siti Rahma & Team',
  },
  {
    id: 'hs-14',
    code: 'HS-2026-0738',
    title: 'Window Frame & Glass Hydro-Cleaning',
    category: 'Balcony & Exterior Glass',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 2205 (Tower B)',
    scheduledTime: '16 Sep 2026, 13:30 WIB',
    completedAt: '16 Sep 2026, 15:00 WIB',
    assignedTo: 'Dewi Lestari',
  },
  {
    id: 'hs-15',
    code: 'HS-2026-0729',
    title: 'Mattress Sanitizing & Nano-Silver Fogging',
    category: 'Sanitization & UV',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 0709 (Tower A)',
    scheduledTime: '14 Sep 2026, 10:00 WIB',
    completedAt: '14 Sep 2026, 11:20 WIB',
    assignedTo: 'Siti Rahma',
  },
  {
    id: 'hs-16',
    code: 'HS-2026-0718',
    title: 'Living Room Parquet Floor Waxing',
    category: 'Floor & Polishing',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 1406 (Tower C)',
    scheduledTime: '12 Sep 2026, 14:00 WIB',
    completedAt: '12 Sep 2026, 16:00 WIB',
    assignedTo: 'Siti Rahma & Team',
  },
  {
    id: 'hs-17',
    code: 'HS-2026-0705',
    title: 'Air Conditioning Duct Fogging & Freshener',
    category: 'AC & Ventilation',
    status: 'COMPLETE',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 1901 (Tower B)',
    scheduledTime: '09 Sep 2026, 11:00 WIB',
    completedAt: '09 Sep 2026, 12:30 WIB',
    assignedTo: 'Budi Santoso',
  },
  {
    id: 'hs-18',
    code: 'HS-2026-0692',
    title: 'Move-In Deep Cleaning Package',
    category: 'Deep Cleaning',
    status: 'COMPLETE',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 0403 (Tower A)',
    scheduledTime: '05 Sep 2026, 09:00 WIB',
    completedAt: '05 Sep 2026, 12:00 WIB',
    assignedTo: 'Siti Rahma & Team',
  },
];

/**
 * Home Service Detail Header Component
 */
export const HomeServiceDetailHeader = ({
  onBack,
  selectedMonth = 8, // 0-indexed (8 = September)
  selectedYear = 2026,
  onPrevMonth,
  onNextMonth,
  onOpenPicker,
}) => {
  const { language } = useLanguage();
  const monthName = language === 'id' ? MONTH_NAMES_ID[selectedMonth] : MONTH_NAMES[selectedMonth];
  const headerTitle = language === 'id' ? 'Daftar Home Service' : 'Home Service';

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
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#1E293B',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          {headerTitle}
        </h1>
      </div>

      {/* 2. Date/Month Navigator Filter Row */}
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
          onClick={onPrevMonth}
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
          <span>{`${monthName} ${selectedYear}`}</span>
        </button>

        <button
          type="button"
          onClick={onNextMonth}
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
  );
};

/**
 * Home Service Detail View Screen
 */
export const HomeServiceDetailView = ({
  selectedMonth = 8,
  selectedYear = 2026,
  onMonthChange,
  isPickerOpen,
  setIsPickerOpen,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SURVEY' | 'WORK'
  const [searchQuery, setSearchQuery] = useState('');
  const [pickerTempMonth, setPickerTempMonth] = useState(selectedMonth);
  const [pickerTempYear, setPickerTempYear] = useState(selectedYear);

  const isSurveyItem = (item) =>
    item.status === 'ON_SURVEY' ||
    item.title.toLowerCase().includes('assessment') ||
    item.title.toLowerCase().includes('inspection') ||
    item.title.toLowerCase().includes('survey');

  const totalCount = INITIAL_HOME_SERVICES.length;
  const surveyCount = INITIAL_HOME_SERVICES.filter(isSurveyItem).length;
  const workCount = totalCount - surveyCount;

  const filteredServices = INITIAL_HOME_SERVICES.filter((item) => {
    // Filter Tab
    if (activeTab === 'SURVEY' && !isSurveyItem(item)) return false;
    if (activeTab === 'WORK' && isSurveyItem(item)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const codeStr = item.codeText || item.code || '';
      const matchCode = codeStr.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLocation = item.locationName.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      return matchCode || matchTitle || matchLocation || matchCategory;
    }

    return true;
  });

  const handleApplyMonthPicker = () => {
    if (onMonthChange) {
      onMonthChange(pickerTempMonth, pickerTempYear);
    }
    setIsPickerOpen(false);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ON_SURVEY':
        return (
          <span
            style={{
              backgroundColor: '#EDE9FE',
              color: '#6D28D9',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
            }}
          >
            {language === 'id' ? 'Survei Jadwal' : 'On Survey'}
          </span>
        );
      case 'ON_WORK':
        return (
          <span
            style={{
              backgroundColor: '#FFF7ED',
              color: '#C2410C',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
            }}
          >
            {language === 'id' ? 'Pengerjaan' : 'In Service'}
          </span>
        );
      case 'COMPLETE':
        return (
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
            }}
          >
            {language === 'id' ? 'Selesai' : 'Complete'}
          </span>
        );
      default:
        return null;
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
        padding: '16px',
        gap: '16px',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingBottom: '40px',
      }}
    >
      {/* 1. Activity Summary Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: 'none',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Header: Title & Month Picker Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
            {language === 'id' ? 'Ringkasan Tugas Home Service' : 'Home Service Summary'}
          </h2>
          <button
            type="button"
            onClick={() => {
              setPickerTempMonth(selectedMonth);
              setPickerTempYear(selectedYear);
              setIsPickerOpen(true);
            }}
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
            <span>{(language === 'id' ? MONTH_NAMES_ID : MONTH_NAMES)[selectedMonth]?.slice(0, 3)} {selectedYear}</span>
            <CaretDown size={14} weight="bold" color="#053079" />
          </button>
        </div>

        {/* Donut Chart Breakdown for Home Service */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '4px 0',
          }}
        >
          {/* Left Donut SVG with Center Label */}
          <div
            style={{
              position: 'relative',
              width: '110px',
              height: '110px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="110"
              height="110"
              viewBox="0 0 120 120"
              style={{
                transform: 'rotate(-90deg)',
                overflow: 'visible',
              }}
            >
              {/* Background Ring */}
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="12"
              />
              {/* Works Executed Segment (Green #16A34A) */}
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#16A34A"
                strokeWidth="12"
                strokeDasharray={`${(workCount / (totalCount || 1)) * 289.03} 289.03`}
                strokeDashoffset="0"
                strokeLinecap="round"
                style={{
                  opacity: activeTab === 'SURVEY' ? 0.3 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
              {/* Surveys Conducted Segment (Blue #2563EB) */}
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#2563EB"
                strokeWidth="12"
                strokeDasharray={`${(surveyCount / (totalCount || 1)) * 289.03} 289.03`}
                strokeDashoffset={-((workCount / (totalCount || 1)) * 289.03)}
                strokeLinecap="round"
                style={{
                  opacity: activeTab === 'WORK' ? 0.3 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
            </svg>

            {/* Center Text */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1,
                  letterSpacing: '-0.3px',
                }}
              >
                {totalCount}
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#64748B',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}
              >
                Total
              </span>
            </div>
          </div>

          {/* Right Breakdown Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Works / Layanan Item */}
            <div
              onClick={() => setActiveTab(activeTab === 'WORK' ? 'ALL' : 'WORK')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                opacity: activeTab === 'SURVEY' ? 0.4 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                    {language === 'id' ? 'Layanan yang Dilakukan' : 'Services Executed'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                    {totalCount > 0 ? ((workCount / totalCount) * 100).toFixed(1) : '0'}% {language === 'id' ? 'dari total' : 'of total'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#15803D' }}>
                {workCount}
              </span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#E2E8F0', width: '100%' }} />

            {/* Surveys Item */}
            <div
              onClick={() => setActiveTab(activeTab === 'SURVEY' ? 'ALL' : 'SURVEY')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                opacity: activeTab === 'WORK' ? 0.4 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                    {language === 'id' ? 'Survey yang Dilakukan' : 'Surveys Conducted'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                    {totalCount > 0 ? ((surveyCount / totalCount) * 100).toFixed(1) : '0'}% {language === 'id' ? 'dari total' : 'of total'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1D4ED8' }}>
                {surveyCount}
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#F1F5F9', width: '100%' }} />

        {/* Weekly Activity Trend (Survey vs Layanan / Services) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
              {language === 'id' ? 'Tren Aktivitas Mingguan' : 'Weekly Activity Trend'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.6875rem', fontWeight: 600 }}>
              <div
                onClick={() => setActiveTab(activeTab === 'SURVEY' ? 'ALL' : 'SURVEY')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#1D4ED8',
                  cursor: 'pointer',
                  opacity: activeTab === 'WORK' ? 0.4 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span style={{ width: '10px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px' }} />
                <span>Survey</span>
              </div>
              <div
                onClick={() => setActiveTab(activeTab === 'WORK' ? 'ALL' : 'WORK')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#15803D',
                  cursor: 'pointer',
                  opacity: activeTab === 'SURVEY' ? 0.4 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span style={{ width: '10px', height: '3px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                <span>{language === 'id' ? 'Layanan' : 'Services'}</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', position: 'relative' }}>
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
                <linearGradient id="detailHsSurveyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="detailHsWorkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              {[
                { val: '6', y: 22 },
                { val: '4', y: 56 },
                { val: '2', y: 90 },
                { val: '0', y: 124 },
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

              {/* Work Area Under Line (Green) */}
              <path
                d="M 55,73 L 135,73 L 215,56 L 295,90 L 295,124 L 55,124 Z"
                fill="url(#detailHsWorkGrad)"
                style={{
                  opacity: activeTab === 'SURVEY' ? 0.15 : 1,
                  transition: 'opacity 0.2s ease',
                  animation: 'areaFadeIn 0.4s ease-out',
                }}
              />

              {/* Work Connecting Line (Green) */}
              <path
                d="M 55,73 L 135,73 L 215,56 L 295,90"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: activeTab === 'SURVEY' ? 0.3 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />

              {/* Survey Area Under Line (Blue) */}
              <path
                d="M 55,107 L 135,90 L 215,107 L 295,90 L 295,124 L 55,124 Z"
                fill="url(#detailHsSurveyGrad)"
                style={{
                  opacity: activeTab === 'WORK' ? 0.15 : 1,
                  transition: 'opacity 0.2s ease',
                  animation: 'areaFadeIn 0.4s ease-out',
                }}
              />

              {/* Survey Connecting Line (Blue) */}
              <path
                d="M 55,107 L 135,90 L 215,107 L 295,90"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: activeTab === 'WORK' ? 0.3 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />

              {/* Data Points & Values for Work (Green) */}
              {[
                { x: 55, y: 73, val: '3' },
                { x: 135, y: 73, val: '3' },
                { x: 215, y: 56, val: '4' },
                { x: 295, y: 90, val: '2' },
              ].map((pt, i) => (
                <g
                  key={`detail-hs-work-${i}`}
                  style={{
                    opacity: activeTab === 'SURVEY' ? 0.25 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fontSize="11"
                    fontWeight="700"
                    fill="#15803D"
                    textAnchor="middle"
                  >
                    {pt.val}
                  </text>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#16A34A"
                    strokeWidth="2.5"
                  />
                </g>
              ))}

              {/* Data Points & Values for Survey (Blue) */}
              {[
                { x: 55, y: 107, val: '1' },
                { x: 135, y: 90, val: '2' },
                { x: 215, y: 107, val: '1' },
                { x: 295, y: 90, val: '2' },
              ].map((pt, i) => (
                <g
                  key={`detail-hs-survey-${i}`}
                  style={{
                    opacity: activeTab === 'WORK' ? 0.25 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <text
                    x={pt.x}
                    y={pt.y + 15}
                    fontSize="11"
                    fontWeight="700"
                    fill="#1D4ED8"
                    textAnchor="middle"
                  >
                    {pt.val}
                  </text>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                  />
                </g>
              ))}

              {/* X-Axis Labels */}
              {[
                { x: 55, label: language === 'id' ? 'Mg 1' : 'W1' },
                { x: 135, label: language === 'id' ? 'Mg 2' : 'W2' },
                { x: 215, label: language === 'id' ? 'Mg 3' : 'W3' },
                { x: 295, label: language === 'id' ? 'Mg 4' : 'W4' },
              ].map((axis, i) => (
                <text
                  key={`detail-hs-axis-${i}`}
                  x={axis.x}
                  y="142"
                  fontSize="10"
                  fontWeight="600"
                  fill="#64748B"
                  textAnchor="middle"
                >
                  {axis.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Customer Satisfaction & Review Summary - Rich Fill Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
            borderRadius: '12px',
            padding: '10px 14px',
            boxShadow: '0 2px 8px rgba(180, 83, 9, 0.18)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            gap: '12px',
          }}
        >
          {/* Background Glow Effect */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Left: Star Icon + Score & Stars + Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <Star size={18} weight="fill" color="#FEF08A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.3px' }}>
                  4.9
                </span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} weight="fill" color="#FDE047" />
                  ))}
                </div>
              </div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#FEF3C7', lineHeight: 1 }}>
                {language === 'id' ? 'Rating Kepuasan Tenant' : 'Tenant Satisfaction'}
              </span>
            </div>
          </div>

          {/* Right: Satisfaction % & Review Count */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', zIndex: 1 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
              98% {language === 'id' ? 'Puas' : 'Satisfied'}
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#FEF3C7', lineHeight: 1 }}>
              12 {language === 'id' ? 'Ulasan' : 'Reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '8px 12px',
            border: '1px solid #E2E8F0',
            gap: '8px',
          }}
        >
          <MagnifyingGlass size={18} color="#64748B" weight="bold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari kode, jenis layanan, lokasi...' : 'Search code, service type, unit...'}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.8125rem',
              color: '#1E293B',
              backgroundColor: 'transparent',
              width: '100%',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'ALL' ? '1px solid #0F172A' : '1px solid #E2E8F0',
              backgroundColor: activeTab === 'ALL' ? '#0F172A' : '#FFFFFF',
              color: activeTab === 'ALL' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {language === 'id' ? `Semua (${totalCount})` : `All (${totalCount})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SURVEY')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'SURVEY' ? '1px solid #2563EB' : '1px solid #E2E8F0',
              backgroundColor: activeTab === 'SURVEY' ? '#EFF6FF' : '#FFFFFF',
              color: activeTab === 'SURVEY' ? '#1D4ED8' : '#475569',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {language === 'id' ? `Survey (${surveyCount})` : `Surveys (${surveyCount})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WORK')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'WORK' ? '1px solid #16A34A' : '1px solid #E2E8F0',
              backgroundColor: activeTab === 'WORK' ? '#F0FDF4' : '#FFFFFF',
              color: activeTab === 'WORK' ? '#15803D' : '#475569',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {language === 'id' ? `Layanan (${workCount})` : `Services (${workCount})`}
          </button>
        </div>
      </div>

      {/* 3. Home Service Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredServices.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px 16px',
              textAlign: 'center',
              color: '#64748B',
              fontSize: '0.8125rem',
              border: '1px solid #E2E8F0',
            }}
          >
            {language === 'id' ? 'Tidak ada tugas Home Service ditemukan' : 'No Home Service tasks found'}
          </div>
        ) : (
          filteredServices.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {/* Top Row: Code, Category & Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#02388A' }}>
                    {task.code || task.codeText}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    • {task.category}
                  </span>
                </div>
                {renderStatusBadge(task.status)}
              </div>

              {/* Task Title */}
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0, lineHeight: 1.3 }}>
                {task.title}
              </h3>

              {/* Location & Time Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#64748B" weight="bold" />
                  <span style={{ fontWeight: 600, color: '#334155' }}>{task.locationName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#64748B" weight="bold" />
                  <span>{task.scheduledTime || task.completedAt}</span>
                </div>
              </div>

              {/* Bottom Row: Assigned Officer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #F1F5F9',
                  fontSize: '0.6875rem',
                  color: '#64748B',
                }}
              >
                <span>
                  {language === 'id' ? 'Petugas:' : 'Assigned:'}{' '}
                  <strong style={{ color: '#1E293B' }}>{task.assignedTo}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => alert(`Detail Home Service: ${task.code || task.codeText}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#02388A',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span>{language === 'id' ? 'Lihat Detail' : 'View Details'}</span>
                  <ArrowRight size={12} weight="bold" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Month Picker Bottom Sheet Modal */}
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
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
                maxHeight: '85%',
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
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {language === 'id' ? 'Pilih Periode Home Service' : 'Select Home Service Period'}
                  </h2>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                    {language === 'id' ? 'Pilih bulan dan tahun' : 'Choose month and year'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
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

              {/* Year Switcher */}
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
                  onClick={() => setPickerTempYear((y) => y - 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>
                  {pickerTempYear}
                </span>
                <button
                  type="button"
                  onClick={() => setPickerTempYear((y) => y + 1)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12 Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {(language === 'id' ? MONTH_NAMES_ID : MONTH_NAMES).map((mName, idx) => {
                  const isSelected = pickerTempMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setPickerTempMonth(idx)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#02388A' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mName.slice(0, 3)}
                    </button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={handleApplyMonthPicker}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#02388A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                {language === 'id' ? 'Terapkan Periode' : 'Apply Period'}
              </button>
            </div>
          </div>
        );

        return modalTarget ? createPortal(modalElement, modalTarget) : modalElement;
      })()}
    </div>
  );
};

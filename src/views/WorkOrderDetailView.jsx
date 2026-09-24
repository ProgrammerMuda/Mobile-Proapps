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
  WarningCircle,
  Wrench,
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

const INITIAL_WORK_ORDERS = [
  // 2 On Survey
  {
    id: 'wo-1',
    code: 'WO-2026-0782',
    title: 'AC Not Cooling Assessment',
    category: 'HVAC / Pendingin',
    status: 'ON_SURVEY',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 1502 (Tower A)',
    scheduledTime: 'Today, 14:00 WIB',
    assignedTo: 'Ahmad Pratama (Lead)',
    createdAt: '25 Jul 2026, 09:15',
  },
  {
    id: 'wo-2',
    code: 'WO-2026-0785',
    title: 'Water Heater Leak Assessment',
    category: 'Plumbing / Pipa Air',
    status: 'ON_SURVEY',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 0910 (Tower B)',
    scheduledTime: 'Today, 17:15 WIB',
    assignedTo: 'Ahmad Pratama',
    createdAt: '25 Jul 2026, 11:30',
  },

  // 3 On Work
  {
    id: 'wo-3',
    code: 'WO-2026-0779',
    title: 'Corridor Light Replacement',
    category: 'Electrical / Listrik',
    status: 'ON_WORK',
    priority: 'NORMAL',
    locationType: 'Facility',
    locationName: 'Elevator Lobby (Tower C)',
    scheduledTime: 'Today, 16:30 WIB',
    assignedTo: 'Ahmad Pratama & Team',
    createdAt: '24 Jul 2026, 14:20',
  },
  {
    id: 'wo-4',
    code: 'WO-2026-0771',
    title: 'Main Water Pump Valve Inspection',
    category: 'Mechanical / Mesin',
    status: 'ON_WORK',
    priority: 'HIGH',
    locationType: 'Facility',
    locationName: 'Basement 1 (Pump Room)',
    scheduledTime: 'Today, 10:00 WIB',
    assignedTo: 'Ahmad Pratama (Lead)',
    createdAt: '24 Jul 2026, 08:45',
  },
  {
    id: 'wo-5',
    code: 'WO-2026-0768',
    title: 'Exhaust Fan Duct Repair',
    category: 'Ventilation / Udara',
    status: 'ON_WORK',
    priority: 'NORMAL',
    locationType: 'Facility',
    locationName: 'Gymnasium 3rd Fl (Tower A)',
    scheduledTime: 'Today, 13:30 WIB',
    assignedTo: 'Ahmad Pratama',
    createdAt: '23 Jul 2026, 16:10',
  },

  // 14 Complete
  {
    id: 'wo-6',
    code: 'WO-2026-0754',
    title: 'Balcony Sliding Door Roller Repair',
    category: 'Civil / Bangunan',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 1204 (Tower B)',
    scheduledTime: '22 Jul 2026, 14:00 WIB',
    completedAt: '22 Jul 2026, 15:30 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-7',
    code: 'WO-2026-0749',
    title: 'Circuit Breaker Tripping Troubleshooting',
    category: 'Electrical / Listrik',
    status: 'COMPLETE',
    priority: 'HIGH',
    locationType: 'Unit',
    locationName: 'Unit 0802 (Tower A)',
    scheduledTime: '21 Jul 2026, 11:00 WIB',
    completedAt: '21 Jul 2026, 12:45 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-8',
    code: 'WO-2026-0742',
    title: 'Sink Drain Clog Resolution',
    category: 'Plumbing / Pipa Air',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 2101 (Tower C)',
    scheduledTime: '20 Jul 2026, 15:30 WIB',
    completedAt: '20 Jul 2026, 16:20 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-9',
    code: 'WO-2026-0738',
    title: 'Lobby AC Filter Cleaning & Maintenance',
    category: 'HVAC / Pendingin',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Facility',
    locationName: 'Main Lobby (Tower A)',
    scheduledTime: '19 Jul 2026, 09:00 WIB',
    completedAt: '19 Jul 2026, 11:30 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-10',
    code: 'WO-2026-0731',
    title: 'Door Access Magnetic Lock Calibration',
    category: 'Security System',
    status: 'COMPLETE',
    priority: 'HIGH',
    locationType: 'Facility',
    locationName: 'Emergency Exit Floor 7',
    scheduledTime: '18 Jul 2026, 13:00 WIB',
    completedAt: '18 Jul 2026, 14:15 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-11',
    code: 'WO-2026-0725',
    title: 'Swimming Pool Filter Pump Inspection',
    category: 'Mechanical / Mesin',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Facility',
    locationName: 'Pool Deck 5th Floor',
    scheduledTime: '17 Jul 2026, 10:00 WIB',
    completedAt: '17 Jul 2026, 11:30 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-12',
    code: 'WO-2026-0720',
    title: 'Bathroom Water Pressure Adjustment',
    category: 'Plumbing / Pipa Air',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 0512 (Tower A)',
    scheduledTime: '16 Jul 2026, 16:00 WIB',
    completedAt: '16 Jul 2026, 16:45 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-13',
    code: 'WO-2026-0715',
    title: 'Fire Alarm Detector Routine Test',
    category: 'Fire Safety',
    status: 'COMPLETE',
    priority: 'HIGH',
    locationType: 'Facility',
    locationName: 'Corridor Floor 10-15',
    scheduledTime: '15 Jul 2026, 09:30 WIB',
    completedAt: '15 Jul 2026, 12:00 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-14',
    code: 'WO-2026-0708',
    title: 'Balcony Waterproofing Inspection',
    category: 'Civil / Bangunan',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 1805 (Tower B)',
    scheduledTime: '14 Jul 2026, 14:30 WIB',
    completedAt: '14 Jul 2026, 15:45 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-15',
    code: 'WO-2026-0702',
    title: 'Basement Parking Light Fixture Replacement',
    category: 'Electrical / Listrik',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Facility',
    locationName: 'Basement 2 (Zone C)',
    scheduledTime: '12 Jul 2026, 11:00 WIB',
    completedAt: '12 Jul 2026, 12:15 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-16',
    code: 'WO-2026-0695',
    title: 'Kitchen Tap Leakage Repair',
    category: 'Plumbing / Pipa Air',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 0308 (Tower A)',
    scheduledTime: '10 Jul 2026, 15:00 WIB',
    completedAt: '10 Jul 2026, 15:40 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-17',
    code: 'WO-2026-0688',
    title: 'Intercom System Troubleshooting',
    category: 'Electronic / Sistem',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 1102 (Tower C)',
    scheduledTime: '08 Jul 2026, 13:30 WIB',
    completedAt: '08 Jul 2026, 14:20 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-18',
    code: 'WO-2026-0680',
    title: 'Generator Weekly Maintenance & Warmup',
    category: 'Mechanical / Listrik',
    status: 'COMPLETE',
    priority: 'HIGH',
    locationType: 'Facility',
    locationName: 'Genset Room (B1)',
    scheduledTime: '05 Jul 2026, 09:00 WIB',
    completedAt: '05 Jul 2026, 11:00 WIB',
    assignedTo: 'Ahmad Pratama',
  },
  {
    id: 'wo-19',
    code: 'WO-2026-0675',
    title: 'Master Bedroom AC Thermostat Calibration',
    category: 'HVAC / Pendingin',
    status: 'COMPLETE',
    priority: 'NORMAL',
    locationType: 'Unit',
    locationName: 'Unit 2205 (Tower B)',
    scheduledTime: '02 Jul 2026, 10:30 WIB',
    completedAt: '02 Jul 2026, 11:45 WIB',
    assignedTo: 'Ahmad Pratama',
  },
];

/**
 * Work Order Detail Header Component
 */
export const WorkOrderDetailHeader = ({
  onBack,
  selectedMonth = 6, // 0-indexed (6 = July)
  selectedYear = 2026,
  onPrevMonth,
  onNextMonth,
  onOpenPicker,
}) => {
  const { language } = useLanguage();
  const monthName = language === 'id' ? MONTH_NAMES_ID[selectedMonth] : MONTH_NAMES[selectedMonth];
  const headerTitle = language === 'id' ? 'Daftar Work Order' : 'Work Order';

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

      {/* 2. Date/Month Navigator Filter Row (Identical to BM Attendance Detail) */}
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
 * Work Order Detail View Screen
 */
export const WorkOrderDetailView = ({
  selectedMonth = 6,
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
    item.title.toLowerCase().includes('survey') ||
    item.title.toLowerCase().includes('test');

  const totalCount = INITIAL_WORK_ORDERS.length;
  const surveyCount = INITIAL_WORK_ORDERS.filter(isSurveyItem).length;
  const workCount = totalCount - surveyCount;

  const filteredWorkOrders = INITIAL_WORK_ORDERS.filter((item) => {
    // Filter Tab
    if (activeTab === 'SURVEY' && !isSurveyItem(item)) return false;
    if (activeTab === 'WORK' && isSurveyItem(item)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = item.code.toLowerCase().includes(q);
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
            {language === 'id' ? 'Pengerjaan' : 'On Work'}
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
            {language === 'id' ? 'Ringkasan Tugas Work Order' : 'Work Order Summary'}
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

        {/* 3 Activity Performance Metrics (Interactive Filter Pills) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            textAlign: 'center',
          }}
        >
          {/* 1. Total Request */}
          <div
            onClick={() => setActiveTab('ALL')}
            style={{
              backgroundColor: activeTab === 'ALL' ? '#E2E8F0' : '#F8FAFC',
              borderRadius: '12px',
              padding: '8px 4px',
              border: activeTab === 'ALL' ? '1.5px solid #0F172A' : '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#334155', fontWeight: 700, lineHeight: 1.2 }}>
              <div>Total</div>
              <div>{language === 'id' ? 'Request' : 'Requests'}</div>
            </div>
          </div>

          {/* 2. Survey yang Telah Dilakukan (Biru) */}
          <div
            onClick={() => setActiveTab(activeTab === 'SURVEY' ? 'ALL' : 'SURVEY')}
            style={{
              backgroundColor: activeTab === 'SURVEY' ? '#DBEAFE' : '#EFF6FF',
              borderRadius: '12px',
              padding: '8px 4px',
              border: activeTab === 'SURVEY' ? '1.5px solid #2563EB' : '1px solid #DBEAFE',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D4ED8', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              {surveyCount}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#1E40AF', fontWeight: 700, lineHeight: 1.2 }}>
              <div>{language === 'id' ? 'Survey yang' : 'Surveys'}</div>
              <div>{language === 'id' ? 'Telah Dilakukan' : 'Conducted'}</div>
            </div>
          </div>

          {/* 3. Pekerjaan yang Telah Dilakukan */}
          <div
            onClick={() => setActiveTab(activeTab === 'WORK' ? 'ALL' : 'WORK')}
            style={{
              backgroundColor: activeTab === 'WORK' ? '#DCFCE7' : '#F0FDF4',
              borderRadius: '12px',
              padding: '8px 4px',
              border: activeTab === 'WORK' ? '1.5px solid #15803D' : '1px solid #DCFCE7',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803D', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              {workCount}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#166534', fontWeight: 700, lineHeight: 1.2 }}>
              <div>{language === 'id' ? 'Pekerjaan yang' : 'Works'}</div>
              <div>{language === 'id' ? 'Telah Dilakukan' : 'Executed'}</div>
            </div>
          </div>
        </div>

        {/* Dynamic Dual Line / Area Chart (Same style as Tenant Requests) */}
        <div
          style={{
            marginTop: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
              {language === 'id' ? 'Tren Aktivitas Bulanan' : 'Monthly Activity Trend'}
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
                  opacity: activeTab === 'WORK' ? 0.35 : 1,
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
                  opacity: activeTab === 'SURVEY' ? 0.35 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span style={{ width: '10px', height: '3px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                <span>{language === 'id' ? 'Pekerjaan' : 'Work'}</span>
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
                <linearGradient id="woSurveyGradDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="woWorkGradDetail" x1="0" y1="0" x2="0" y2="1">
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
                d="M 55,73 L 135,56 L 215,56 L 295,73 L 295,124 L 55,124 Z"
                fill="url(#woWorkGradDetail)"
                style={{
                  animation: 'areaFadeIn 0.4s ease-out',
                  opacity: activeTab === 'SURVEY' ? 0.15 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* Work Connecting Line (Green) */}
              <path
                d="M 55,73 L 135,56 L 215,56 L 295,73"
                fill="none"
                stroke="#16A34A"
                strokeWidth={activeTab === 'WORK' ? '3.5' : '2.5'}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: activeTab === 'SURVEY' ? 0.25 : 1,
                  transition: 'all 0.3s ease',
                }}
              />

              {/* Survey Area Under Line (Blue) */}
              <path
                d="M 55,107 L 135,73 L 215,90 L 295,90 L 295,124 L 55,124 Z"
                fill="url(#woSurveyGradDetail)"
                style={{
                  animation: 'areaFadeIn 0.4s ease-out',
                  opacity: activeTab === 'WORK' ? 0.15 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* Survey Connecting Line (Blue) */}
              <path
                d="M 55,107 L 135,73 L 215,90 L 295,90"
                fill="none"
                stroke="#2563EB"
                strokeWidth={activeTab === 'SURVEY' ? '3.5' : '2.5'}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: activeTab === 'WORK' ? 0.25 : 1,
                  transition: 'all 0.3s ease',
                }}
              />

              {/* Data Points & Values for Work (Green) */}
              {[
                { x: 55, y: 73, val: '3' },
                { x: 135, y: 56, val: '4' },
                { x: 215, y: 56, val: '4' },
                { x: 295, y: 73, val: '3' },
              ].map((pt, i) => (
                <g
                  key={`work-${i}`}
                  style={{
                    opacity: activeTab === 'SURVEY' ? 0.25 : 1,
                    transition: 'opacity 0.3s ease',
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
                    r={activeTab === 'WORK' ? 5 : 4}
                    fill="#FFFFFF"
                    stroke="#16A34A"
                    strokeWidth="2.5"
                  />
                </g>
              ))}

              {/* Data Points & Values for Survey (Blue) */}
              {[
                { x: 55, y: 107, val: '1' },
                { x: 135, y: 73, val: '3' },
                { x: 215, y: 90, val: '2' },
                { x: 295, y: 90, val: '2' },
              ].map((pt, i) => (
                <g
                  key={`survey-${i}`}
                  style={{
                    opacity: activeTab === 'WORK' ? 0.25 : 1,
                    transition: 'opacity 0.3s ease',
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
                    r={activeTab === 'SURVEY' ? 5 : 4}
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
                  key={`axis-${i}`}
                  x={axis.x}
                  y="146"
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
      </div>

      {/* 2. Search Box */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '0 12px',
          height: '42px',
        }}
      >
        <MagnifyingGlass size={18} color="#94A3B8" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'id' ? 'Cari no tiket, unit, lokasi...' : 'Search ticket, unit, location...'}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            padding: '0 8px',
            fontSize: '0.8125rem',
            color: '#1E293B',
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
              padding: 0,
              cursor: 'pointer',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>

      {/* 3. Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { key: 'ALL', label: language === 'id' ? `Semua (${totalCount})` : `All (${totalCount})` },
          { key: 'SURVEY', label: language === 'id' ? `Survey (${surveyCount})` : `Survey (${surveyCount})` },
          { key: 'WORK', label: language === 'id' ? `Pekerjaan (${workCount})` : `Work (${workCount})` },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                backgroundColor: isActive ? '#02388A' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#64748B',
                border: isActive ? '1px solid #02388A' : '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Work Order Ticket List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredWorkOrders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px 16px',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: '0.875rem',
              border: '1px solid #E2E8F0',
            }}
          >
            {language === 'id' ? 'Tidak ada tiket Work Order yang cocok' : 'No matching Work Order tickets found'}
          </div>
        ) : (
          filteredWorkOrders.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '1px solid #E2E8F0',
              }}
            >
              {/* Header: Ticket Code, Priority & Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#02388A', fontFamily: 'monospace' }}>
                    #{item.code}
                  </span>
                  {item.priority === 'HIGH' && (
                    <span
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Urgent
                    </span>
                  )}
                </div>
                {renderStatusBadge(item.status)}
              </div>

              {/* Title & Category */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  {item.title}
                </h4>
                <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                  {item.category}
                </div>
              </div>

              {/* Location & Time Info */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  border: '1px solid #F1F5F9',
                  fontSize: '0.6875rem',
                  color: '#475569',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#02388A" weight="fill" />
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>
                    {item.locationType}: {item.locationName}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
                  <Clock size={14} color="#64748B" />
                  <span>
                    {item.status === 'COMPLETE'
                      ? `${language === 'id' ? 'Selesai' : 'Completed'}: ${item.completedAt}`
                      : `${language === 'id' ? 'Jadwal' : 'Schedule'}: ${item.scheduledTime}`}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {item.status === 'ON_SURVEY' && (
                <button
                  type="button"
                  onClick={() => alert(`Mulai survei untuk tiket: ${item.code}`)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{language === 'id' ? 'Mulai Survei Sekarang' : 'Start Survey Now'}</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              )}

              {item.status === 'ON_WORK' && (
                <button
                  type="button"
                  onClick={() => alert(`Lanjutkan pengerjaan untuk tiket: ${item.code}`)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{language === 'id' ? 'Lanjutkan Pengerjaan' : 'Continue Execution'}</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              )}

              {item.status === 'COMPLETE' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '2px',
                    fontSize: '0.6875rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontWeight: 600 }}>
                    <SealCheck size={14} weight="fill" />
                    <span>{language === 'id' ? 'Tugas Selesai & Terverifikasi' : 'Task Completed & Verified'}</span>
                  </div>
                  <span
                    onClick={() => alert(`Melihat Berita Acara (BAST) untuk: ${item.code}`)}
                    style={{ color: '#02388A', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {language === 'id' ? 'Lihat BAST →' : 'View Report →'}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Month & Year Picker Bottom Sheet Modal (In-Frame) */}
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
            }}
            onClick={() => setIsPickerOpen(false)}
          >
            <div
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '20px 16px 28px',
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

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  {language === 'id' ? 'Pilih Periode Work Order' : 'Select Work Order Period'}
                </h3>
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
                  border: '1px solid #F1F5F9',
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

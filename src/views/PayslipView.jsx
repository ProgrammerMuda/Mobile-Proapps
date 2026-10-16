import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CalendarBlank,
  X,
  Eye,
  EyeSlash,
  DownloadSimple,
  ShareNetwork,
  CheckCircle,
  CurrencyCircleDollar,
  Receipt,
  TrendDown,
  TrendUp,
  Building,
  User,
  Clock,
  Briefcase,
  Info,
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

const MONTH_SHORT_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Juli',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

// Mock generator for Payslip data across various months
const getMonthlyPayslipData = (year, monthIndex, roleType = 'ENGINEERING') => {
  // Base salary depending on role
  let baseSalary = 5200000;
  let roleTitleId = 'Engineering On-Duty';
  let roleTitleEn = 'Engineering On-Duty';
  let deptId = 'Teknik & Pemeliharaan (MEP)';
  let deptEn = 'Engineering & Maintenance (MEP)';

  if (roleType === 'SECURITY') {
    baseSalary = 4600000;
    roleTitleId = 'Petugas Keamanan';
    roleTitleEn = 'Security Officer';
    deptId = 'Keamanan & Ketertiban Kawasan';
    deptEn = 'Safety & Security';
  } else if (roleType === 'HOUSEKEEPING') {
    baseSalary = 4300000;
    roleTitleId = 'Petugas Kebersihan';
    roleTitleEn = 'Housekeeping Staff';
    deptId = 'Housekeeping & Sanitasi';
    deptEn = 'Housekeeping & Sanitation';
  } else if (roleType === 'MANAGER') {
    baseSalary = 8000000;
    roleTitleId = 'Building Manager';
    roleTitleEn = 'Building Manager';
    deptId = 'Manajemen Pengelola Gedung';
    deptEn = 'Building Management';
  }

  // Monthly variations (slight overtime/shift variation per month)
  const seed = (monthIndex * 17 + year) % 10;
  const attendanceAllowance = 850000 + seed * 20000;
  const mealTransport = 900000;
  const overtimeIncentive = 350000 + (seed % 5) * 50000;
  const bpjsKetenagakerjaan = 280000;
  const bpjsKesehatan = 170000;
  const pph21 = 85000 + seed * 5000;
  const lateDeduction = seed > 6 ? 50000 : 0;

  const totalEarnings = baseSalary + attendanceAllowance + mealTransport + overtimeIncentive;
  const totalDeductions = bpjsKetenagakerjaan + bpjsKesehatan + pph21 + lateDeduction;
  const takeHomePay = totalEarnings - totalDeductions;

  // Pay date (25th of the selected month or end of month)
  const payDate = `25 ${MONTH_SHORT_ID[monthIndex]} ${year}`;
  const payDateEn = `25 ${MONTH_SHORT[monthIndex]} ${year}`;

  return {
    periodMonthIndex: monthIndex,
    periodYear: year,
    payDate,
    payDateEn,
    roleTitleId,
    roleTitleEn,
    deptId,
    deptEn,
    bankName: 'BCA (Bank Central Asia)',
    bankAccount: '5271889201',
    slipNumber: `PS-${year}${String(monthIndex + 1).padStart(2, '0')}-0892`,
    earnings: {
      baseSalary,
      attendanceAllowance,
      mealTransport,
      overtimeIncentive,
      total: totalEarnings,
    },
    deductions: {
      bpjsKetenagakerjaan,
      bpjsKesehatan,
      pph21,
      lateDeduction,
      total: totalDeductions,
    },
    takeHomePay,
    workDaysCount: 22 - (seed % 3),
    overtimeHours: 12 + (seed % 6),
    leaveDaysCount: seed % 2,
    offDaysCount: 8,
  };
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

export const PayslipView = ({ onBack, user }) => {
  const { language } = useLanguage();
  const isId = language === 'id';

  // Month & Year state (default to September 2026, monthIndex = 8 for previous processed pay period)
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);

  // Privacy toggle: show/hide salary numbers
  const [isAmountVisible, setIsAmountVisible] = useState(true);

  // Notification for downloaded/shared slip
  const [toastMessage, setToastMessage] = useState(null);

  const monthLabel = isId ? MONTH_NAMES_ID[selectedMonth] : MONTH_NAMES[selectedMonth];

  // Sync picker year
  useEffect(() => {
    if (isMonthPickerOpen) {
      setPickerYear(selectedYear);
    }
  }, [isMonthPickerOpen, selectedYear]);

  // Determine user role for mock data
  const userRole = useMemo(() => {
    const role = user?.role || user?.position || 'ENGINEERING';
    const upper = String(role).toUpperCase();
    if (upper.includes('SEC')) return 'SECURITY';
    if (upper.includes('HOUSE') || upper.includes('CLEAN')) return 'HOUSEKEEPING';
    if (upper.includes('MANAGE') || upper.includes('BM')) return 'MANAGER';
    return 'ENGINEERING';
  }, [user]);

  const payslipData = useMemo(() => {
    return getMonthlyPayslipData(selectedYear, selectedMonth, userRole);
  }, [selectedYear, selectedMonth, userRole]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleDownload = () => {
    setToastMessage(isId ? 'Slip gaji berhasil diunduh (PDF)!' : 'Payslip downloaded successfully (PDF)!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    setToastMessage(isId ? 'Tautan slip gaji berhasil disalin ke clipboard!' : 'Payslip link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayAmount = (num) => {
    if (!isAmountVisible) return '••••••••••';
    return formatRupiah(num);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'inherit',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle size={16} weight="fill" color="#22C55E" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
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
          position: 'sticky',
          top: 0,
        }}
      >
        {/* 1. Title Row */}
        <div
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '52px',
          }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
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
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.2px',
              textAlign: 'center',
              flex: 1,
            }}
          >
            {isId ? 'Slip Gaji' : 'Payslip'}
          </h1>

          <div style={{ width: '32px' }} />
        </div>

        {/* 2. Month & Year Picker Navigator Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '2px 16px 14px 16px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            type="button"
            onClick={handlePrevMonth}
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
            onClick={() => setIsMonthPickerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              flex: 1,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <CalendarBlank size={18} weight="fill" color="#053079" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {monthLabel} {selectedYear}
            </span>
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
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

      {/* Main Content Area */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '32px' }}>
        {/* 1. Take Home Pay Hero Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #02388A 0%, #0348AF 60%, #09B2FF 140%)',
            borderRadius: '20px',
            padding: '20px 18px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 8px 24px rgba(2, 56, 138, 0.22)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle decorative circle */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Row: Label & Privacy Eye Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Receipt size={18} color="#93C5FD" weight="fill" />
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#BFDBFE', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                {isId ? 'Total Gaji Bersih' : 'Take Home Pay'}
              </span>
            </div>

            {/* Privacy Eye Toggle */}
            <button
              type="button"
              onClick={() => setIsAmountVisible((v) => !v)}
              aria-label={isAmountVisible ? 'Hide salary amount' : 'Show salary amount'}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                padding: '4px 8px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {isAmountVisible ? (
                <>
                  <EyeSlash size={15} weight="bold" />
                  <span>{isId ? 'Sembunyikan' : 'Hide'}</span>
                </>
              ) : (
                <>
                  <Eye size={15} weight="bold" />
                  <span>{isId ? 'Lihat' : 'Show'}</span>
                </>
              )}
            </button>
          </div>

          {/* Main Nominal */}
          <div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                letterSpacing: isAmountVisible ? '-0.8px' : '2px',
                lineHeight: 1.1,
                color: '#FFFFFF',
              }}
            >
              {displayAmount(payslipData.takeHomePay)}
            </div>
            <div style={{ fontSize: '11px', color: '#DBEAFE', marginTop: '5px', fontWeight: 500 }}>
              {isId ? 'Periode Penggajian' : 'Payroll Period'}: 01 {monthLabel} {selectedYear} - {new Date(selectedYear, selectedMonth + 1, 0).getDate()} {monthLabel} {selectedYear}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Bottom Info: Employee & Bank Account (Left) & Status Paid Badge (Right) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {user?.name || 'Ahmad Fauzi'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#BFDBFE', fontWeight: 500, marginTop: '2px' }}>
                BCA • 5271889201
              </div>
            </div>

            {/* Paid Status Badge on Bottom Right */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#16A34A',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
              }}
            >
              <CheckCircle size={13} weight="fill" color="#FFFFFF" />
              <span>{isId ? 'Ditransfer' : 'Paid'}</span>
            </div>
          </div>
        </div>

        {/* 2. Action Buttons (Download PDF & Share) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            onClick={handleDownload}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#02388A',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.15s ease',
            }}
          >
            <DownloadSimple size={17} weight="bold" color="#02388A" />
            <span>{isId ? 'Unduh PDF' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.15s ease',
            }}
          >
            <ShareNetwork size={17} weight="bold" color="#334155" />
            <span>{isId ? 'Bagikan' : 'Share'}</span>
          </button>
        </div>

        {/* 3. Earnings Section (Penerimaan) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16A34A',
                }}
              >
                <TrendUp size={16} weight="bold" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>
                {isId ? 'Penerimaan (Earnings)' : 'Earnings'}
              </span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A' }}>
              {displayAmount(payslipData.earnings.total)}
            </span>
          </div>

          {/* Breakdown Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>
                {isId ? 'Gaji Pokok' : 'Basic Salary'}
              </span>
              <span style={{ fontWeight: 700, color: '#1E293B' }}>
                {displayAmount(payslipData.earnings.baseSalary)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>
                {isId ? 'Tunjangan Kehadiran & Shift' : 'Attendance & Shift Allowance'}
              </span>
              <span style={{ fontWeight: 700, color: '#1E293B' }}>
                {displayAmount(payslipData.earnings.attendanceAllowance)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>
                {isId ? 'Uang Makan & Operasional' : 'Meal & Operational Allowance'}
              </span>
              <span style={{ fontWeight: 700, color: '#1E293B' }}>
                {displayAmount(payslipData.earnings.mealTransport)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>
                {isId ? 'Insentif Lembur / Roster' : 'Overtime / Roster Incentive'}
              </span>
              <span style={{ fontWeight: 700, color: '#1E293B' }}>
                {displayAmount(payslipData.earnings.overtimeIncentive)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Deductions Section (Potongan) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                }}
              >
                <TrendDown size={16} weight="bold" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>
                {isId ? 'Potongan (Deductions)' : 'Deductions'}
              </span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>
              {isAmountVisible ? `- ${formatRupiah(payslipData.deductions.total)}` : '••••••••••'}
            </span>
          </div>

          {/* Breakdown Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>
                BPJS Ketenagakerjaan
              </span>
              <span style={{ fontWeight: 700, color: '#DC2626' }}>
                {isAmountVisible ? `- ${formatRupiah(payslipData.deductions.bpjsKetenagakerjaan)}` : '••••••••••'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>
                BPJS Kesehatan
              </span>
              <span style={{ fontWeight: 700, color: '#DC2626' }}>
                {isAmountVisible ? `- ${formatRupiah(payslipData.deductions.bpjsKesehatan)}` : '••••••••••'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>
                {isId ? 'PPh 21 (Pajak Penghasilan)' : 'Income Tax (PPh 21)'}
              </span>
              <span style={{ fontWeight: 700, color: '#DC2626' }}>
                {isAmountVisible ? `- ${formatRupiah(payslipData.deductions.pph21)}` : '••••••••••'}
              </span>
            </div>

            {payslipData.deductions.lateDeduction > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: '#64748B', fontWeight: 500 }}>
                  {isId ? 'Potongan Keterlambatan' : 'Late Arrival Deduction'}
                </span>
                <span style={{ fontWeight: 700, color: '#DC2626' }}>
                  {isAmountVisible ? `- ${formatRupiah(payslipData.deductions.lateDeduction)}` : '••••••••••'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Attendance & Work Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} weight="fill" color="#09B2FF" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>
              {isId ? 'Ringkasan Kehadiran Periode Ini' : 'Attendance Summary for Period'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '12px 6px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#02388A' }}>{payslipData.workDaysCount}</div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{isId ? 'Hadir' : 'Present'}</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '12px 6px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#7C3AED' }}>{payslipData.leaveDaysCount}</div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{isId ? 'Izin / Cuti' : 'Permit'}</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '12px 6px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#D97706' }}>{payslipData.overtimeHours}j</div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{isId ? 'Lembur' : 'Overtime'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Month & Year Picker Modal Portal */}
      {isMonthPickerOpen && (() => {
        const modalTarget = typeof document !== 'undefined'
          ? document.getElementById('phone-screen-container') || document.querySelector('.android-device-screen') || document.body
          : null;

        if (!modalTarget) return null;

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
            onClick={() => setIsMonthPickerOpen(false)}
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

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', margin: 0 }}>
                  {isId ? 'Pilih Periode Bulan' : 'Select Month Period'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMonthPickerOpen(false)}
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

              {/* Year Selector Row */}
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
                  onClick={() => setPickerYear((y) => y - 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{pickerYear}</span>
                <button
                  type="button"
                  onClick={() => setPickerYear((y) => y + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {/* 12-Month Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const isSelected = selectedMonth === i && selectedYear === pickerYear;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(i);
                        setSelectedYear(pickerYear);
                        setIsMonthPickerOpen(false);
                      }}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#02388A' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isId ? MONTH_NAMES_ID[i] : MONTH_NAMES[i]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

        return createPortal(modalElement, modalTarget);
      })()}
    </div>
  );
};

export default PayslipView;

// Demo ledger; replace with the leave-balance API. Only Annual Leave is quota-based.
export const ANNUAL_LEAVE_PERIOD = { start: '2026-01-01', end: '2026-12-31' };

// type: ENTITLEMENT | CARRY_OVER | LEAVE_TAKEN | COLLECTIVE | ADJUSTMENT. kind decides the sign of days.
export const INITIAL_LEAVE_QUOTA_LEDGER = [
  {
    id: 'QL-007', type: 'ADJUSTMENT', kind: 'ADDITION', days: 1, date: '2026-10-17', status: 'APPROVED', requestRef: 'ADJ-017',
    title: {
      id: 'Penyesuaian manual: tanggal akhir masa percobaan terinput terlambat sebulan, sehingga satu hari akrual hilang.',
      en: 'Manual adjustment: Probation end date was entered a month late, so one day of accrual is missing.',
    },
    actor: { id: 'Diajukan oleh Anisa Maharani · Disetujui oleh Building Manager', en: 'Requested by Anisa Maharani · Approved by Building Manager' },
  },
  {
    id: 'QL-006', type: 'LEAVE_TAKEN', kind: 'DEDUCTION', days: 2, date: '2026-04-14', status: 'APPROVED',
    title: { id: 'Cuti diambil (2 hari kerja)', en: 'Leave taken (2 working days)' },
    actor: { id: 'Sarah Jenkins (HR Mgr)', en: 'Sarah Jenkins (HR Mgr)' },
  },
  {
    id: 'QL-005', type: 'COLLECTIVE', kind: 'DEDUCTION', days: 1, date: '2026-03-04', status: 'APPROVED',
    title: { id: 'Potongan cuti bersama: Hari Raya Nyepi', en: 'Collective leave deduction: Nyepi Day' },
    actor: { id: 'Sistem Kebijakan HR', en: 'HR Policy System' },
  },
  {
    id: 'QL-004', type: 'COLLECTIVE', kind: 'DEDUCTION', days: 1, date: '2026-02-18', status: 'APPROVED',
    title: { id: 'Potongan cuti bersama: Tahun Baru Imlek', en: 'Collective leave deduction: Chinese New Year' },
    actor: { id: 'Sistem Kebijakan HR', en: 'HR Policy System' },
  },
  {
    id: 'QL-003', type: 'LEAVE_TAKEN', kind: 'DEDUCTION', days: 2, date: '2026-02-10', status: 'APPROVED',
    title: { id: 'Cuti diambil (2 hari kerja)', en: 'Leave taken (2 working days)' },
    actor: { id: 'Sarah Jenkins (HR Mgr)', en: 'Sarah Jenkins (HR Mgr)' },
  },
  {
    id: 'QL-002', type: 'CARRY_OVER', kind: 'ADDITION', days: 2, date: '2026-01-01', status: 'APPROVED',
    title: { id: 'Sisa cuti dari 2025 (hangus 31 Mar 2026)', en: 'Carry-over from 2025 (expires 31 Mar 2026)' },
    actor: { id: 'Sistem Otomatis', en: 'Auto System' },
  },
  {
    id: 'QL-001', type: 'ENTITLEMENT', kind: 'ADDITION', days: 12, date: '2026-01-01', status: 'APPROVED',
    title: { id: 'Hak cuti tahunan 2026', en: 'Annual leave entitlement 2026' },
    actor: { id: 'Sistem Otomatis', en: 'Auto System' },
  },
];

// Both adjustment types credit days back to the balance.
export const ADJUST_TYPES = [
  { id: 'ADD', label: { id: 'Tambah Kuota', en: 'Add Quota' }, hint: { id: 'Mis. kompensasi kerja di hari libur.', en: 'E.g. compensation for working on a day off.' } },
  { id: 'RESTORE', label: { id: 'Kembalikan Pemotongan', en: 'Restore Deduction' }, hint: { id: 'Mis. cuti dibatalkan atau salah dipotong.', en: 'E.g. a cancelled leave or a wrong deduction.' } },
];

export const ADJUST_MAX_DAYS = 30;
export const ADJUST_APPROVERS = [
  { initials: 'HR', name: { id: 'HR atau Building Service', en: 'HR or Building Service' }, step: { id: 'Tahap 1 · Verifikasi', en: 'Step 1 · Verification' } },
  { initials: 'BM', name: { id: 'Building Management', en: 'Building Management' }, step: { id: 'Tahap 2 · Persetujuan akhir', en: 'Step 2 · Final approval' } },
];

export const formatQuotaDate = (iso, language) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const dayUnit = (count, language) => (language === 'id' ? 'hari' : count === 1 ? 'day' : 'days');

// Pending/rejected entries never change the balance.
export const getQuotaSummary = (ledger) => {
  const approved = ledger.filter((entry) => entry.status === 'APPROVED');
  const total = approved.filter((entry) => entry.kind === 'ADDITION').reduce((sum, entry) => sum + entry.days, 0);
  const used = approved.filter((entry) => entry.kind === 'DEDUCTION').reduce((sum, entry) => sum + entry.days, 0);
  return { total, used, remaining: total - used, pendingCount: ledger.filter((entry) => entry.status === 'PENDING').length };
};

export const createAdjustmentEntry = ({ type, days, reason, requestedBy }) => {
  const requestRef = `ADJ-${String(Math.floor(Math.random() * 900) + 100)}`;
  return {
    id: `QL-${requestRef}`,
    type: 'ADJUSTMENT',
    kind: 'ADDITION',
    days,
    date: new Date().toISOString().slice(0, 10),
    status: 'PENDING',
    requestRef,
    adjustType: type,
    reason,
    title: {
      id: `${type === 'ADD' ? 'Tambah kuota' : 'Kembalikan pemotongan'}: ${reason}`,
      en: `${type === 'ADD' ? 'Add quota' : 'Restore deduction'}: ${reason}`,
    },
    actor: {
      id: `Diajukan oleh ${requestedBy} · Menunggu persetujuan`,
      en: `Requested by ${requestedBy} · Waiting for approval`,
    },
  };
};

const formatSubmittedAt = (date) =>
  `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

// Approval-list item for a submitted adjustment; ledgerId links the decision back to the quota ledger.
export const createAdjustmentApproval = ({ entry, user, currentBalance }) => {
  const adjustType = ADJUST_TYPES.find((item) => item.id === entry.adjustType) || ADJUST_TYPES[0];
  return {
    id: `APV-${entry.requestRef}`,
    ledgerId: entry.id,
    requestRef: entry.requestRef,
    employeeName: user?.name || 'Employee',
    employeeRole: user?.unitOrDept || '-',
    type: 'QUOTA_ADJUSTMENT',
    adjustType: entry.adjustType,
    subType: adjustType.label.en,
    title: adjustType.label.en,
    days: entry.days,
    currentBalance,
    date: entry.date,
    dateDisplay: formatQuotaDate(entry.date, 'en'),
    duration: `+${entry.days} ${entry.days === 1 ? 'Day' : 'Days'}`,
    submittedAt: formatSubmittedAt(new Date()),
    status: 'PENDING',
    approvalStep: 1,
    reason: entry.reason,
    attachment: null,
  };
};

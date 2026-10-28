// Demo ledger; replace with the leave-balance API. Only Annual Leave is quota-based.
export const ANNUAL_LEAVE_PERIOD = { start: '2026-01-01', end: '2026-12-31' };

// type: ENTITLEMENT | CARRY_OVER | LEAVE_TAKEN | COLLECTIVE | ADJUSTMENT. kind decides the sign of days.
export const INITIAL_LEAVE_QUOTA_LEDGER = [
  {
    id: 'QL-007', type: 'ADJUSTMENT', adjustType: 'ADD', kind: 'ADDITION', days: 1, date: '2026-10-17', status: 'APPROVED', requestRef: 'ADJ-017',
    submittedBy: 'Anisa Maharani',
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

// ADD and RESTORE credit the balance; DEDUCT debits it.
export const ADJUST_TYPES = [
  { id: 'ADD', label: { id: 'Tambah Kuota', en: 'Add Quota' }, hint: { id: 'Mis. kompensasi kerja di hari libur.', en: 'E.g. compensation for working on a day off.' } },
  { id: 'DEDUCT', label: { id: 'Kurangi Kuota', en: 'Deduction' }, hint: { id: 'Mis. kelebihan kuota atau cuti yang belum tercatat.', en: 'E.g. excess quota or leave that was not recorded.' } },
  { id: 'RESTORE', label: { id: 'Kembalikan Pemotongan', en: 'Restore Deduction' }, hint: { id: 'Mis. cuti dibatalkan atau salah dipotong.', en: 'E.g. a cancelled leave or a wrong deduction.' } },
];

export const isDeductType = (adjustType) => adjustType === 'DEDUCT';

const ADJUST_TITLE_PREFIX = {
  ADD: { id: 'Tambah kuota', en: 'Add quota' },
  DEDUCT: { id: 'Kurangi kuota', en: 'Deduct quota' },
  RESTORE: { id: 'Kembalikan pemotongan', en: 'Restore deduction' },
};

export const ADJUST_MAX_DAYS = 30;

// Roles that may file an adjustment on behalf of another employee.
export const canAdjustForOthers = (roleCode) => roleCode === 'HR' || roleCode === 'BS';

// Who may act on an adjustment at a given approval step: step 1 is HR/Building Service, step 2 is Building Management.
// BM can also act on step 1 so the demo flow still works from the BM account.
export const canActOnAdjustmentStep = (roleCode, step) => (step >= 2 ? roleCode === 'BM' : ['HR', 'BS', 'BM'].includes(roleCode));

// Demo staff balances for on-behalf requests; replace with the staff leave-balance API.
const staffDeduction = (id, type, days, date, title) => ({ id, type, kind: 'DEDUCTION', days, date, status: 'APPROVED', title });
export const STAFF_LEAVE_QUOTAS = [
  {
    id: 'emp-dedi', name: 'Dedi Kurniawan', nip: '2019030142', position: 'Teknisi Listrik', role: 'Engineering', remaining: 8,
    deductions: [
      staffDeduction('SQ-DK-02', 'LEAVE_TAKEN', 3, '2026-08-11', { id: 'Cuti diambil (3 hari kerja)', en: 'Leave taken (3 working days)' }),
      staffDeduction('SQ-DK-01', 'COLLECTIVE', 1, '2026-03-04', { id: 'Potongan cuti bersama: Hari Raya Nyepi', en: 'Collective leave deduction: Nyepi Day' }),
    ],
  },
  {
    id: 'emp-rina', name: 'Rina Melati', nip: '2020070215', position: 'Leader Housekeeping', role: 'Housekeeping', remaining: 5,
    deductions: [
      staffDeduction('SQ-RM-02', 'LEAVE_TAKEN', 4, '2026-06-22', { id: 'Cuti diambil (4 hari kerja)', en: 'Leave taken (4 working days)' }),
      staffDeduction('SQ-RM-01', 'COLLECTIVE', 1, '2026-02-18', { id: 'Potongan cuti bersama: Tahun Baru Imlek', en: 'Collective leave deduction: Chinese New Year' }),
    ],
  },
  {
    id: 'emp-bambang', name: 'Bambang Wijaya', nip: '2018110087', position: 'Chief Security', role: 'Security', remaining: 10,
    deductions: [
      staffDeduction('SQ-BW-01', 'LEAVE_TAKEN', 2, '2026-09-15', { id: 'Cuti diambil (2 hari kerja)', en: 'Leave taken (2 working days)' }),
    ],
  },
  {
    id: 'emp-siti', name: 'Siti Rahma', nip: '2021020331', position: 'Tenant Relation Officer', role: 'Tenant Relation', remaining: 3,
    deductions: [
      staffDeduction('SQ-SR-02', 'LEAVE_TAKEN', 2, '2026-10-02', { id: 'Cuti diambil (2 hari kerja)', en: 'Leave taken (2 working days)' }),
      staffDeduction('SQ-SR-01', 'LEAVE_TAKEN', 5, '2026-05-18', { id: 'Cuti diambil (5 hari kerja)', en: 'Leave taken (5 working days)' }),
    ],
  },
  {
    id: 'emp-dimas', name: 'Dimas Prasetyo', nip: '2022050406', position: 'Teknisi HVAC', role: 'Engineering', remaining: 0,
    deductions: [
      staffDeduction('SQ-DP-01', 'LEAVE_TAKEN', 6, '2026-07-06', { id: 'Cuti diambil (6 hari kerja)', en: 'Leave taken (6 working days)' }),
    ],
  },
];
export const ADJUST_APPROVERS = [
  { initials: 'HR', name: { id: 'HR atau Building Service', en: 'HR or Building Service' }, step: { id: 'Tahap 1 · Verifikasi', en: 'Step 1 · Verification' } },
  { initials: 'BM', name: { id: 'Building Management', en: 'Building Management' }, step: { id: 'Tahap 2 · Persetujuan akhir', en: 'Step 2 · Final approval' } },
];

export const formatQuotaDate = (iso, language) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const dayUnit = (count, language) => (language === 'id' ? 'hari' : count === 1 ? 'day' : 'days');

// Plain-language effect of an adjustment, shown under the balance card.
export const adjustEffectText = (adjustType, days, language) => {
  const unit = dayUnit(days, language);
  if (adjustType === 'DEDUCT') return language === 'id' ? `Kuota dikurangi ${days} ${unit} dari saldo.` : `${days} ${unit} will be taken off the balance.`;
  if (adjustType === 'RESTORE') return language === 'id' ? `${days} ${unit} dari pemotongan sebelumnya dikembalikan ke saldo.` : `${days} ${unit} from an earlier deduction go back to the balance.`;
  return language === 'id' ? `Kuota ditambah ${days} ${unit} ke saldo.` : `${days} ${unit} will be added to the balance.`;
};

// Pending/rejected entries never change the balance.
export const getQuotaSummary = (ledger) => {
  const approved = ledger.filter((entry) => entry.status === 'APPROVED');
  const total = approved.filter((entry) => entry.kind === 'ADDITION').reduce((sum, entry) => sum + entry.days, 0);
  const used = approved.filter((entry) => entry.kind === 'DEDUCTION').reduce((sum, entry) => sum + entry.days, 0);
  return { total, used, remaining: total - used, pendingCount: ledger.filter((entry) => entry.status === 'PENDING').length };
};

// Approved deductions that no pending/approved restore already points at.
export const getRestorableDeductions = (ledger) => {
  const claimed = new Set(ledger.filter((entry) => entry.restoreOf && entry.status !== 'REJECTED').map((entry) => entry.restoreOf));
  return ledger.filter((entry) => entry.kind === 'DEDUCTION' && entry.status === 'APPROVED' && !claimed.has(entry.id));
};

// verifiedBy is set when HR/Building Service files the request: step 1 is already done, so it goes straight to Building Management.
export const createAdjustmentEntry = ({ type, days, reason, requestedBy, requestedByRole = null, restoreSource, verifiedBy = null }) => {
  const requestRef = `ADJ-${String(Math.floor(Math.random() * 900) + 100)}`;
  return {
    ...(restoreSource && { restoreOf: restoreSource.id, restoreSource }),
    id: `QL-${requestRef}`,
    type: 'ADJUSTMENT',
    kind: isDeductType(type) ? 'DEDUCTION' : 'ADDITION',
    days,
    date: new Date().toISOString().slice(0, 10),
    status: 'PENDING',
    requestRef,
    submittedBy: requestedByRole ? `${requestedBy} (${requestedByRole})` : requestedBy,
    adjustType: type,
    reason,
    title: {
      id: `${ADJUST_TITLE_PREFIX[type].id}: ${reason}`,
      en: `${ADJUST_TITLE_PREFIX[type].en}: ${reason}`,
    },
    approvalStep: verifiedBy ? 2 : 1,
    verifiedBy,
    actor: verifiedBy
      ? {
          id: `Diajukan oleh ${requestedBy} · Terverifikasi · Menunggu Building Management`,
          en: `Requested by ${requestedBy} · Verified · Waiting for Building Management`,
        }
      : {
          id: `Diajukan oleh ${requestedBy} · Menunggu persetujuan`,
          en: `Requested by ${requestedBy} · Waiting for approval`,
        },
  };
};

const formatSubmittedAt = (date) =>
  `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

// Approval-list item for a submitted adjustment; ledgerId links the decision back to the quota ledger.
// submittedBy defaults to the entry's requester; App overrides it when HR/Building Service files on behalf of another employee.
export const createAdjustmentApproval = ({ entry, user, currentBalance, submittedBy = entry.submittedBy || null }) => {
  const adjustType = ADJUST_TYPES.find((item) => item.id === entry.adjustType) || ADJUST_TYPES[0];
  return {
    id: `APV-${entry.requestRef}`,
    ledgerId: entry.id,
    requestRef: entry.requestRef,
    employeeName: user?.name || 'Employee',
    employeeRole: user?.unitOrDept || '-',
    employeeNip: user?.nip || null,
    employeePosition: user?.position || null,
    type: 'QUOTA_ADJUSTMENT',
    adjustType: entry.adjustType,
    subType: adjustType.label.en,
    title: adjustType.label.en,
    days: entry.days,
    currentBalance,
    date: entry.date,
    dateDisplay: formatQuotaDate(entry.date, 'en'),
    duration: `${isDeductType(entry.adjustType) ? '−' : '+'}${entry.days} ${entry.days === 1 ? 'Day' : 'Days'}`,
    submittedAt: formatSubmittedAt(new Date()),
    status: 'PENDING',
    approvalStep: entry.approvalStep || 1,
    ...(entry.verifiedBy && { verifiedBy: entry.verifiedBy, verifiedAt: formatSubmittedAt(new Date()) }),
    reason: entry.reason,
    restoreSource: entry.restoreSource || null,
    submittedBy,
    attachment: null,
  };
};

/**
 * PROAPPS User Roles & Demo Accounts Model
 */

export const ROLES = {
  BUILDING_MANAGEMENT: 'Building Management',
  TENANT_RELATION: 'Tenant Relation',
  TENANT: 'Tenant',
  ENGINEERING: 'Engineering',
  HOUSEKEEPING: 'Housekeeping',
  SECURITY: 'Security',
};

export const DEMO_ACCOUNTS = [
  {
    id: 'bm-01',
    role: ROLES.BUILDING_MANAGEMENT,
    roleCode: 'BM',
    name: 'Ahmad Pratama',
    email: 'bm@proapps.id',
    phone: '08123456701',
    password: 'password',
    unitOrDept: 'Building Management',
    badgeColor: 'purple',
    description: 'Akses penuh operasional gedung, approval, analitik, dan manajemen staf.',
    permissions: ['all_access', 'approvals', 'financial_reports', 'staff_management'],
  },
  {
    id: 'tr-01',
    role: ROLES.TENANT_RELATION,
    roleCode: 'TR',
    name: 'Siti Rahma',
    email: 'tr@proapps.id',
    phone: '08123456702',
    password: 'password',
    unitOrDept: 'Tenant Relation Division',
    badgeColor: 'blue',
    description: 'Manajemen komplain tenant, pengumuman gedung, tagihan IPL, dan survei kepuasan.',
    permissions: ['complaints_handling', 'announcements', 'invoicing', 'tenant_directory'],
  },
  {
    id: 'tenant-01',
    role: ROLES.TENANT,
    roleCode: 'TENANT',
    name: 'Budi Santoso',
    email: 'tenant@proapps.id',
    phone: '08123456703',
    password: 'password',
    unitOrDept: 'Tower A - Unit 1204',
    badgeColor: 'green',
    description: 'Info tagihan unit, buat tiket bantuan/komplain, izin renovasi, dan booking fasilitas.',
    permissions: ['my_billing', 'submit_ticket', 'visitor_pass', 'facility_booking'],
  },
  {
    id: 'eng-01',
    role: ROLES.ENGINEERING,
    roleCode: 'ENG',
    name: 'Dedi Kurniawan',
    email: 'eng@proapps.id',
    phone: '08123456704',
    password: 'password',
    unitOrDept: 'Engineering & Maintenance',
    badgeColor: 'orange',
    description: 'Work order perbaikan, pencatatan meteran listrik/air, dan inspeksi preventif AC/Genset.',
    permissions: ['work_orders', 'preventive_maintenance', 'meter_reading', 'equipment_logs'],
  },
  {
    id: 'hk-01',
    role: ROLES.HOUSEKEEPING,
    roleCode: 'HK',
    name: 'Rina Melati',
    email: 'hk@proapps.id',
    phone: '08123456705',
    password: 'password',
    unitOrDept: 'Housekeeping & Cleanliness',
    badgeColor: 'amber',
    description: 'Jadwal kebersihan area publik, checklist toilet/lobby, dan stok chemical.',
    permissions: ['cleaning_schedule', 'area_checklist', 'waste_management', 'chemical_stock'],
  },
  {
    id: 'sec-01',
    role: ROLES.SECURITY,
    roleCode: 'SEC',
    name: 'Bambang Wijaya',
    email: 'security@proapps.id',
    phone: '08123456706',
    password: 'password',
    unitOrDept: 'Security & Safety Office',
    badgeColor: 'red',
    description: 'Log pengunjung (visitor), buku patroli digital, laporan insiden, dan akses gerbang.',
    permissions: ['visitor_logs', 'patrol_records', 'incident_reports', 'gate_control'],
  },
];

export const findAccount = (identifier, password) => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  return DEMO_ACCOUNTS.find(
    (acc) =>
      (acc.email.toLowerCase() === cleanId || acc.phone === cleanId || acc.roleCode.toLowerCase() === cleanId) &&
      (!cleanPass || cleanPass === acc.password || cleanPass === 'password' || cleanPass === 'password123')
  );
};

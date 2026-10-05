export const getRequestDisplayTitle = (request, language) => request.type === 'PERMIT'
  ? getCategoryOptions(request.type, language).find((option) => option.value === request.subType)?.title || request.subType || request.title
  : request.title;

export const getCategoryOptions = (type, lang) => {
  const isId = lang === 'id';
  const maps = {
    PERMIT: [
      {
        value: 'Cuti Tahunan',
        title: isId ? 'Cuti Tahunan' : 'Annual Leave',
        badge: isId ? 'Sisa 8 Hari' : '8 Days Left',
      },
      {
        value: 'Sakit Rawat Jalan',
        title: isId ? 'Sakit Rawat Jalan' : 'Outpatient Sick Leave',
        badge: isId ? 'Sisa 10 Hari' : '10 Days Left',
      },
      {
        value: 'Sakit Rawat Inap',
        title: isId ? 'Sakit Rawat Inap' : 'Inpatient Sick Leave',
        badge: isId ? 'Sisa 14 Hari' : '14 Days Left',
      },
      {
        value: 'Cuti Khusus',
        title: isId ? 'Cuti Khusus' : 'Special Leave',
        badge: isId ? 'Sisa 5 Hari' : '5 Days Left',
      },
      {
        value: 'Unpaid Leave',
        title: isId ? 'Unpaid Leave' : 'Unpaid Leave',
        badge: isId ? 'Sisa 3 Hari' : '3 Days Left',
      },
    ],
    MANUAL_ATTENDANCE: [
      {
        value: 'Lupa Clock In',
        title: isId ? 'Lupa Clock In' : 'Missed Clock In',
        badge: isId ? 'Sisa 3x / Bln' : '3x / Month',
      },
      {
        value: 'Lupa Clock Out',
        title: isId ? 'Lupa Clock Out' : 'Missed Clock Out',
        badge: isId ? 'Sisa 3x / Bln' : '3x / Month',
      },
      {
        value: 'Error GPS / Jaringan',
        title: isId ? 'Error GPS / Jaringan' : 'GPS / Network Error',
        badge: isId ? 'Sisa 5x / Bln' : '5x / Month',
      },
    ],
    OVERTIME: [
      {
        value: 'BKO Overtime',
        title: isId ? 'BKO Overtime' : 'BKO Overtime',
        badge: isId ? 'Sisa 14 Jam' : '14 Hrs Left',
      },
      {
        value: 'Staff Overtime',
        title: isId ? 'Staff Overtime' : 'Staff Overtime',
        badge: isId ? 'Sisa 14 Jam' : '14 Hrs Left',
      },
    ],
    CHANGE_SHIFT: [
      {
        value: 'Tukar Shift',
        title: isId ? 'Tukar Shift Rekan Kerja' : 'Shift Swap',
        badge: isId ? 'Sisa 2x / Bln' : '2x / Month',
      },
      {
        value: 'Ganti Hari Kerja',
        title: isId ? 'Ganti Hari Kerja' : 'Off-Day Swap',
        badge: isId ? 'Sisa 2x / Bln' : '2x / Month',
      },
    ],
  };
  return maps[type] || maps.PERMIT;
};

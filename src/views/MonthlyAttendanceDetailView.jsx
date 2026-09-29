import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CaretRight,
  CalendarBlank,
  X,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Users,
  MagnifyingGlass,
  Buildings,
  Briefcase,
  SignIn,
  SignOut,
  MapPin,
  FileText,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import attendanceEmptySearch from '../assets/attendance-empty-search.png';

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
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DAY_NAMES_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

const DAY_SHORT_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to get week ranges for a given year & month (1-indexed weeks: 1 to 5)
const getMonthWeeks = (year, monthIndex) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return [
    { weekNumber: 1, startDay: 1, endDay: Math.min(7, daysInMonth) },
    { weekNumber: 2, startDay: 8, endDay: Math.min(14, daysInMonth) },
    { weekNumber: 3, startDay: 15, endDay: Math.min(21, daysInMonth) },
    { weekNumber: 4, startDay: 22, endDay: Math.min(28, daysInMonth) },
    { weekNumber: 5, startDay: 29, endDay: daysInMonth },
  ].filter((w) => w.startDay <= daysInMonth);
};

// Mock monthly attendance log generator for personal attendance
const generateMonthlyLogs = (year, monthIndex) => {
  const logs = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = daysInMonth; day >= 1; day--) {
    const dateObj = new Date(year, monthIndex, day);
    const dayOfWeek = dateObj.getDay();
    // Skip weekends (Sunday = 0, Saturday = 6)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    if (day === 24) {
      // Late In, On Time Out
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'late',
        inStatus: 'LATE',
        outStatus: 'ON_TIME',
        lateMinutes: 18,
        clockIn: '08:18 WIB',
        clockOut: '17:05 WIB',
        workDuration: '8h 47m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: 'Gedung Menara Jasmine, Lobby Utama',
        notes: 'Terlambat 18 menit (Macet Tol)',
      });
    } else if (day === 21) {
      // Early In, Early Out
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'early_out',
        inStatus: 'EARLY_IN',
        outStatus: 'EARLY_OUT',
        clockIn: '07:48 WIB',
        clockOut: '16:45 WIB',
        workDuration: '8h 57m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: 'Gedung Menara Jasmine, Lantai B1',
        notes: 'Pulang 15 menit awal (Izin Urusan Keluarga)',
      });
    } else if (day === 18) {
      // Early In, On Time Out
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'early_in',
        inStatus: 'EARLY_IN',
        outStatus: 'ON_TIME',
        clockIn: '07:50 WIB',
        clockOut: '17:02 WIB',
        workDuration: '9h 12m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: 'Gedung Menara Jasmine, Lobby Utama',
        notes: 'Shift Pagi (Masuk Awal)',
      });
    } else if (day === 17) {
      // Alpha day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'alpha',
        inStatus: null,
        outStatus: null,
        clockIn: '-- : --',
        clockOut: '-- : --',
        workDuration: '0h 0m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: '--',
        notes: 'Tanpa Keterangan (Alpha)',
      });
    } else if (day === 14) {
      // Late day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'late',
        inStatus: 'LATE',
        outStatus: 'ON_TIME',
        lateMinutes: 14,
        clockIn: '08:14 WIB',
        clockOut: '17:05 WIB',
        workDuration: '8h 51m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: 'Gedung Menara Jasmine, Lobby Utama',
        notes: 'Terlambat 14 menit',
      });
    } else if (day === 8) {
      // 1 Leave day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'leave',
        inStatus: null,
        outStatus: null,
        clockIn: '-- : --',
        clockOut: '-- : --',
        workDuration: '0h 0m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: '--',
        notes: 'Cuti Tahunan (Disetujui)',
      });
    } else if (day === 3) {
      // 1 Alpha day
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'alpha',
        inStatus: null,
        outStatus: null,
        clockIn: '-- : --',
        clockOut: '-- : --',
        workDuration: '0h 0m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: '--',
        notes: 'Tanpa Keterangan (Alpha)',
      });
    } else {
      // On time days
      logs.push({
        id: `att-${year}-${monthIndex}-${day}`,
        date: dateObj,
        dayNumber: day,
        status: 'ontime',
        inStatus: 'ON_TIME',
        outStatus: 'ON_TIME',
        clockIn: '08:00 WIB',
        clockOut: '17:00 WIB',
        workDuration: '9h 00m',
        shift: 'Shift Pagi (08:00 - 17:00)',
        location: 'Gedung Menara Jasmine, Lobby Utama',
        notes: 'Shift Pagi (08:00 - 17:00)',
      });
    }
  }

  return logs;
};

// Department Breakdown Data for BM
const DEPARTMENTS_DATA = [
  {
    id: 'engineering',
    name: 'Engineering',
    present: 39,
    late: 6,
    leave: 11,
    absent: 18,
    totalAssigned: 68,
    percentage: 57,
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    present: 26,
    late: 5,
    leave: 19,
    absent: 29,
    totalAssigned: 74,
    percentage: 35,
  },
  {
    id: 'security',
    name: 'Security',
    present: 23,
    late: 4,
    leave: 8,
    absent: 15,
    totalAssigned: 46,
    percentage: 50,
  },
  {
    id: 'management',
    name: 'Management',
    present: 13,
    late: 2,
    leave: 6,
    absent: 11,
    totalAssigned: 30,
    percentage: 43,
  },
];

// Helper to generate realistic employee attendance status for any selected day
const getEmployeesAttendanceForDay = (year, monthIndex, day) => {
  if (day === 24) {
    return [
      { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:45 WIB', clockOut: '16:40 WIB', duration: '8h 55m', inStatus: 'EARLY_IN', outStatus: 'EARLY_OUT', status: 'EARLY_OUT' },
      { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:05 WIB', duration: '9h 15m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '08:18 WIB', clockOut: '19:40 WIB', duration: '11h 22m', lateMinutes: 18, inStatus: 'LATE', outStatus: 'EARLY_OUT', status: 'LATE' },
      { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'LEAVE' },
      { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:10 WIB', duration: '12h 25m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'ALPHA' },
      { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:35 WIB', duration: '9h 10m', inStatus: 'ON_TIME', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:42 WIB', clockOut: '17:15 WIB', duration: '8h 33m', lateMinutes: 12, inStatus: 'LATE', outStatus: 'EARLY_OUT', status: 'LATE' },
    ];
  }

  if (day === 21) {
    return [
      { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:48 WIB', clockOut: '16:45 WIB', duration: '8h 57m', inStatus: 'EARLY_IN', outStatus: 'EARLY_OUT', status: 'EARLY_OUT' },
      { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:48 WIB', clockOut: '16:02 WIB', duration: '9h 14m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:50 WIB', clockOut: '20:00 WIB', duration: '12h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:52 WIB', clockOut: '17:00 WIB', duration: '9h 08m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Libur Reguler', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'OFF' },
      { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:55 WIB', clockOut: '16:00 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:20 WIB', clockOut: '17:10 WIB', duration: '8h 50m', inStatus: 'EARLY_IN', outStatus: 'EARLY_OUT', status: 'EARLY_OUT' },
      { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:30 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    ];
  }

  if (day === 18) {
    return [
      { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:50 WIB', clockOut: '16:45 WIB', duration: '8h 55m', inStatus: 'EARLY_IN', outStatus: 'EARLY_OUT', status: 'EARLY_OUT' },
      { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:55 WIB', clockOut: '16:00 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:00 WIB', duration: '12h 15m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '08:15 WIB', clockOut: '16:50 WIB', duration: '8h 35m', lateMinutes: 15, inStatus: 'LATE', outStatus: 'EARLY_OUT', status: 'LATE' },
      { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:50 WIB', clockOut: '20:10 WIB', duration: '12h 20m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Libur Reguler', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'OFF' },
      { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:22 WIB', clockOut: '17:30 WIB', duration: '9h 08m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:30 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    ];
  }

  if (day === 17) {
    return [
      { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:50 WIB', clockOut: '17:00 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:00 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '08:15 WIB', clockOut: '19:50 WIB', duration: '11h 35m', lateMinutes: 15, inStatus: 'LATE', outStatus: 'EARLY_OUT', status: 'LATE' },
      { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'LEAVE' },
      { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:00 WIB', duration: '12h 15m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'ALPHA' },
      { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:35 WIB', duration: '9h 10m', inStatus: 'ON_TIME', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:20 WIB', clockOut: '17:30 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    ];
  }

  if (day === 14) {
    return [
      { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '08:14 WIB', clockOut: '17:05 WIB', duration: '8h 51m', lateMinutes: 14, inStatus: 'LATE', outStatus: 'ON_TIME', status: 'LATE' },
      { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:00 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:55 WIB', clockOut: '20:00 WIB', duration: '12h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:55 WIB', clockOut: '17:00 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:00 WIB', duration: '12h 15m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:52 WIB', clockOut: '16:00 WIB', duration: '9h 08m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:20 WIB', clockOut: '17:30 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:30 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    ];
  }

  if (day === 8) {
    return [
      { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:58 WIB', clockOut: '17:00 WIB', duration: '9h 02m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Libur Reguler', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'OFF' },
      { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:50 WIB', clockOut: '20:00 WIB', duration: '12h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'LEAVE' },
      { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:00 WIB', duration: '12h 15m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:00 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:20 WIB', clockOut: '17:30 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:30 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    ];
  }

  if (day === 3) {
    return [
      { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:55 WIB', clockOut: '17:00 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:00 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:50 WIB', clockOut: '20:00 WIB', duration: '12h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:55 WIB', clockOut: '17:00 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:00 WIB', duration: '12h 15m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '-- : --', clockOut: '-- : --', duration: '0h 0m', inStatus: null, outStatus: null, status: 'ALPHA' },
      { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:20 WIB', clockOut: '17:30 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
      { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:30 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    ];
  }

  // General weekdays
  const isAltLate = day % 3 === 0;
  const isAltEarlyOut = day % 4 === 0;
  return [
    { id: 'emp-1', name: 'Budi Santoso', dept: 'Engineering', role: 'Civil & Plumbing', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:55 WIB', clockOut: isAltEarlyOut ? '16:45 WIB' : '17:02 WIB', duration: isAltEarlyOut ? '8h 50m' : '9h 07m', inStatus: 'EARLY_IN', outStatus: isAltEarlyOut ? 'EARLY_OUT' : 'ON_TIME', status: isAltEarlyOut ? 'EARLY_OUT' : 'ONTIME' },
    { id: 'emp-2', name: 'Siti Rahma', dept: 'Housekeeping', role: 'Leader Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:05 WIB', duration: '9h 15m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    { id: 'emp-3', name: 'Agus Setiawan', dept: 'Security', role: 'Patrol Guard', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: isAltLate ? '08:18 WIB' : '07:50 WIB', clockOut: isAltEarlyOut ? '19:40 WIB' : '20:05 WIB', duration: isAltLate ? '11h 47m' : '12h 15m', lateMinutes: isAltLate ? 18 : 0, inStatus: isAltLate ? 'LATE' : 'EARLY_IN', outStatus: isAltEarlyOut ? 'EARLY_OUT' : 'ON_TIME', status: isAltLate ? 'LATE' : isAltEarlyOut ? 'EARLY_OUT' : 'ONTIME' },
    { id: 'emp-4', name: 'Dewi Lestari', dept: 'Engineering', role: 'HVAC Specialist', shift: 'Shift Pagi (08:00 - 17:00)', clockIn: '07:55 WIB', clockOut: '17:00 WIB', duration: '9h 05m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    { id: 'emp-5', name: 'Rudi Hartono', dept: 'Security', role: 'Security Commander', shift: 'Shift Pagi (08:00 - 20:00)', clockIn: '07:45 WIB', clockOut: '20:10 WIB', duration: '12h 25m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    { id: 'emp-6', name: 'Sri Wahyuni', dept: 'Housekeeping', role: 'Public Area Cleaner', shift: 'Shift Pagi (07:00 - 16:00)', clockIn: '06:50 WIB', clockOut: '16:00 WIB', duration: '9h 10m', inStatus: 'EARLY_IN', outStatus: 'ON_TIME', status: 'ONTIME' },
    { id: 'emp-7', name: 'Hendra Gunawan', dept: 'Management', role: 'Billing Officer', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: '08:25 WIB', clockOut: '17:35 WIB', duration: '9h 10m', inStatus: 'ON_TIME', outStatus: 'ON_TIME', status: 'ONTIME' },
    { id: 'emp-8', name: 'Fitri Handayani', dept: 'Management', role: 'Tenant Relation', shift: 'Shift Pagi (08:30 - 17:30)', clockIn: isAltLate ? '08:42 WIB' : '08:25 WIB', clockOut: isAltEarlyOut ? '17:15 WIB' : '17:32 WIB', duration: isAltLate ? '8h 50m' : '9h 07m', lateMinutes: isAltLate ? 12 : 0, inStatus: isAltLate ? 'LATE' : 'ON_TIME', outStatus: isAltEarlyOut ? 'EARLY_OUT' : 'ON_TIME', status: isAltLate ? 'LATE' : isAltEarlyOut ? 'EARLY_OUT' : 'ONTIME' },
  ];
};

// Helper to generate full chronological employee attendance records for any period (daily, weekly, monthly)
const getEmployeesAttendanceForPeriod = (year, monthIndex, periodMode, weekNumber, dayNumber) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const targetDays = [];

  if (periodMode === 'daily') {
    targetDays.push(Math.min(Math.max(1, dayNumber), daysInMonth));
  } else if (periodMode === 'weekly') {
    const weeks = getMonthWeeks(year, monthIndex);
    const currWeekObj = weeks.find((w) => w.weekNumber === weekNumber) || weeks[weeks.length - 1] || { startDay: 22, endDay: 28 };
    for (let d = currWeekObj.endDay; d >= currWeekObj.startDay; d--) {
      const dObj = new Date(year, monthIndex, d);
      const dayOfWeek = dObj.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
      targetDays.push(d);
    }
  } else {
    // monthly: all work days of the month descending (e.g. 30, 29, ... 1)
    for (let d = daysInMonth; d >= 1; d--) {
      const dObj = new Date(year, monthIndex, d);
      const dayOfWeek = dObj.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
      targetDays.push(d);
    }
  }

  const allRecords = [];
  targetDays.forEach((d) => {
    const dObj = new Date(year, monthIndex, d);
    const dayName = DAY_NAMES_ID[dObj.getDay()];
    const dayNameEn = DAY_NAMES[dObj.getDay()];
    const monthShort = MONTH_SHORT_ID[monthIndex];
    const monthShortEn = MONTH_SHORT[monthIndex];

    const dateFormattedId = `${dayName}, ${d} ${monthShort} ${year}`;
    const dateFormattedEn = `${dayNameEn}, ${d} ${monthShortEn} ${year}`;

    const dayEmployees = getEmployeesAttendanceForDay(year, monthIndex, d);
    dayEmployees.forEach((emp) => {
      allRecords.push({
        ...emp,
        recordId: `${emp.id}-${year}-${monthIndex}-${d}`,
        dayNumber: d,
        dateObj: dObj,
        dateFormattedId,
        dateFormattedEn,
      });
    });
  });

  return allRecords;
};

/**
 * Monthly Attendance Detail Header Bar (With Bulanan | Mingguan | Harian Switcher)
 */
export const MonthlyAttendanceDetailHeader = ({
  onBack,
  periodMode = 'monthly', // 'monthly' | 'weekly' | 'daily'
  onPeriodModeChange,
  selectedMonth = 8, // 0-indexed (8 = September)
  selectedYear = 2026,
  selectedWeek = 4,
  selectedDay = 24,
  onPrevPeriod,
  onNextPeriod,
  onOpenPicker,
}) => {
  const { language } = useLanguage();
  const headerTitle = language === 'id' ? 'Laporan Presensi' : 'Report Attendance';

  // Format Navigator Label depending on active period mode
  let periodNavigatorLabel = '';
  if (periodMode === 'monthly') {
    const monthName = language === 'id' ? MONTH_NAMES_ID[selectedMonth] : MONTH_NAMES[selectedMonth];
    periodNavigatorLabel = `${monthName} ${selectedYear}`;
  } else if (periodMode === 'weekly') {
    const weeks = getMonthWeeks(selectedYear, selectedMonth);
    const currWeekObj = weeks.find((w) => w.weekNumber === selectedWeek) || weeks[weeks.length - 1] || { startDay: 22, endDay: 28 };
    const monthShort = language === 'id' ? MONTH_SHORT_ID[selectedMonth] : MONTH_SHORT[selectedMonth];
    const prefix = language === 'id' ? `Minggu ${selectedWeek}` : `Week ${selectedWeek}`;
    periodNavigatorLabel = `${prefix} (${currWeekObj.startDay} - ${currWeekObj.endDay} ${monthShort} ${selectedYear})`;
  } else {
    // Daily mode
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const safeDay = Math.min(Math.max(1, selectedDay), daysInMonth);
    const dateObj = new Date(selectedYear, selectedMonth, safeDay);
    const dayName = language === 'id' ? DAY_NAMES_ID[dateObj.getDay()] : DAY_NAMES[dateObj.getDay()];
    const monthShort = language === 'id' ? MONTH_SHORT_ID[selectedMonth] : MONTH_SHORT[selectedMonth];
    periodNavigatorLabel = `${dayName}, ${safeDay} ${monthShort} ${selectedYear}`;
  }

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
      {/* 1. Title Row (Centered Title) */}
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
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.2px',
            textAlign: 'center',
            flex: 1,
          }}
        >
          {headerTitle}
        </h1>

        <div style={{ width: '32px' }} />
      </div>

      {/* 2. Clean Segmented Period Tabs Switcher (Bulanan | Mingguan | Harian) */}
      <div style={{ padding: '0 16px 8px 16px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            borderRadius: '10px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {[
            { id: 'monthly', label: language === 'id' ? 'Bulanan' : 'Monthly' },
            { id: 'weekly', label: language === 'id' ? 'Mingguan' : 'Weekly' },
            { id: 'daily', label: language === 'id' ? 'Harian' : 'Daily' },
          ].map((tab) => {
            const isActive = periodMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onPeriodModeChange && onPeriodModeChange(tab.id)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#02388A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 1px 3px rgba(2, 56, 138, 0.25)' : 'none',
                  outline: 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Date/Period Navigator Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '4px 16px 14px 16px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          type="button"
          onClick={onPrevPeriod}
          aria-label="Previous period"
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
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{periodNavigatorLabel}</span>
        </button>

        <button
          type="button"
          onClick={onNextPeriod}
          aria-label="Next period"
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
 * Monthly Attendance Detail View Screen
 */
export const MonthlyAttendanceDetailView = ({
  user,
  onBack,
  activeMainTab: controlledActiveMainTab,
  onMainTabChange,
  periodMode = 'monthly', // 'monthly' | 'weekly' | 'daily'
  onPeriodModeChange,
  selectedMonth = 8,
  selectedYear = 2026,
  selectedWeek = 4,
  selectedDay = 24,
  onPeriodChange,
  isPickerOpen,
  setIsPickerOpen,
  onSelectAttendanceRecord,
}) => {
  const { language } = useLanguage();
  const isBM = user?.roleCode === 'BM';

  // For BM: Tab switcher between 'MY_ATTENDANCE' and 'EMPLOYEES'
  const [internalActiveMainTab, setInternalActiveMainTab] = useState(
    controlledActiveMainTab || 'MY_ATTENDANCE'
  );

  React.useEffect(() => {
    if (controlledActiveMainTab !== undefined) {
      setInternalActiveMainTab(controlledActiveMainTab);
    }
  }, [controlledActiveMainTab]);

  const activeMainTab = controlledActiveMainTab !== undefined ? controlledActiveMainTab : internalActiveMainTab;
  const setActiveMainTab = (tab) => {
    setInternalActiveMainTab(tab);
    if (onMainTabChange) onMainTabChange(tab);
  };

  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [employeeDeptFilter, setEmployeeDeptFilter] = useState('ALL');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('ALL');
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

  // Picker temp state for modals
  const [pickerTempMonth, setPickerTempMonth] = useState(selectedMonth);
  const [pickerTempYear, setPickerTempYear] = useState(selectedYear);
  const [pickerTempWeek, setPickerTempWeek] = useState(selectedWeek);
  const [pickerTempDay, setPickerTempDay] = useState(selectedDay);

  // Sync temp state whenever picker opens
  React.useEffect(() => {
    if (isPickerOpen) {
      setPickerTempMonth(selectedMonth);
      setPickerTempYear(selectedYear);
      setPickerTempWeek(selectedWeek);
      setPickerTempDay(selectedDay);
    }
  }, [isPickerOpen, selectedMonth, selectedYear, selectedWeek, selectedDay]);

  // Days in month calculation
  const daysInSelectedMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const safeDay = Math.min(Math.max(1, selectedDay), daysInSelectedMonth);
  const weeksList = useMemo(() => getMonthWeeks(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  const currentWeekObj = weeksList.find((w) => w.weekNumber === selectedWeek) || weeksList[weeksList.length - 1] || { startDay: 22, endDay: 28 };

  // 1. DATASETS FOR PERSONAL ATTENDANCE (MY ATTENDANCE)
  const fullMonthlyLogs = useMemo(() => generateMonthlyLogs(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  // Filtered logs depending on periodMode
  const activePeriodLogs = useMemo(() => {
    if (periodMode === 'monthly') {
      return fullMonthlyLogs;
    }
    if (periodMode === 'weekly') {
      return fullMonthlyLogs.filter((l) => l.dayNumber >= currentWeekObj.startDay && l.dayNumber <= currentWeekObj.endDay);
    }
    // Daily mode
    return fullMonthlyLogs.filter((l) => l.dayNumber === safeDay);
  }, [periodMode, fullMonthlyLogs, currentWeekObj, safeDay]);

  // Personal metrics for active period
  const totalLogs = activePeriodLogs.length;
  const onTimeCount = activePeriodLogs.filter((l) => l.status === 'ontime').length;
  const lateCount = activePeriodLogs.filter((l) => l.status === 'late').length;
  const leaveCount = activePeriodLogs.filter((l) => l.status === 'leave').length;
  const alphaCount = activePeriodLogs.filter((l) => l.status === 'alpha').length;
  const presentCount = onTimeCount + lateCount;
  const attendanceRatePct = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 0;

  // Filtered personal logs by status pill
  const filteredPersonalLogs = activePeriodLogs.filter((log) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ONTIME') return log.status === 'ontime';
    if (activeFilter === 'LATE') return log.status === 'late';
    if (activeFilter === 'LEAVE') return log.status === 'leave';
    if (activeFilter === 'ALPHA') return log.status === 'alpha';
    return true;
  });

  // Daily single log for personal daily mode
  const singleDailyLog = fullMonthlyLogs.find((l) => l.dayNumber === safeDay) || {
    id: `att-${selectedYear}-${selectedMonth}-${safeDay}`,
    date: new Date(selectedYear, selectedMonth, safeDay),
    dayNumber: safeDay,
    status: 'ontime',
    inStatus: 'ON_TIME',
    outStatus: 'ON_TIME',
    clockIn: '08:00 WIB',
    clockOut: '17:00 WIB',
    workDuration: '9h 00m',
    shift: 'Shift Pagi (08:00 - 17:00)',
    location: 'Gedung Menara Jasmine, Lobby Utama',
    notes: 'Presensi Shift Pagi',
  };

  // 2. DATASETS FOR EMPLOYEES ATTENDANCE (BM TAB)
  const allPeriodEmployeeRecords = useMemo(
    () => getEmployeesAttendanceForPeriod(selectedYear, selectedMonth, periodMode, selectedWeek, safeDay),
    [selectedYear, selectedMonth, periodMode, selectedWeek, safeDay]
  );

  const totalEmpRecords = allPeriodEmployeeRecords.length;
  const empKpiOntime = allPeriodEmployeeRecords.filter((e) => e.status === 'ONTIME' || (e.inStatus === 'EARLY_IN' && e.outStatus !== 'EARLY_OUT')).length;
  const empKpiLate = allPeriodEmployeeRecords.filter((e) => e.status === 'LATE' || e.inStatus === 'LATE' || e.outStatus === 'EARLY_OUT' || e.status === 'EARLY_OUT').length;
  const empKpiLeave = allPeriodEmployeeRecords.filter((e) => e.status === 'LEAVE' || e.status === 'OFF' || e.status === 'LIBUR').length;
  const empKpiAlpha = allPeriodEmployeeRecords.filter((e) => e.status === 'ALPHA').length;

  // Filtered employees list for display in BM tab
  const displayEmployeesList = useMemo(() => {
    return allPeriodEmployeeRecords.filter((emp) => {
      if (employeeDeptFilter !== 'ALL' && emp.dept.toLowerCase() !== employeeDeptFilter.toLowerCase()) {
        return false;
      }
      if (employeeStatusFilter !== 'ALL') {
        if (employeeStatusFilter === 'ONTIME') {
          const isOntime = emp.status === 'ONTIME' || (emp.inStatus === 'EARLY_IN' && emp.outStatus !== 'EARLY_OUT') || (emp.inStatus === 'ON_TIME' && emp.outStatus === 'ON_TIME');
          if (!isOntime) return false;
        }
        if (employeeStatusFilter === 'LATE') {
          const isLate = emp.status === 'LATE' || emp.inStatus === 'LATE' || emp.outStatus === 'EARLY_OUT' || emp.status === 'EARLY_OUT';
          if (!isLate) return false;
        }
        if (employeeStatusFilter === 'LEAVE' && (emp.status !== 'LEAVE' && emp.status !== 'OFF' && emp.status !== 'LIBUR')) return false;
        if (employeeStatusFilter === 'ALPHA' && emp.status !== 'ALPHA') return false;
      }
      if (employeeSearchQuery.trim()) {
        const q = employeeSearchQuery.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.dept.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q) ||
          (emp.dateFormattedId && emp.dateFormattedId.toLowerCase().includes(q)) ||
          (emp.dateFormattedEn && emp.dateFormattedEn.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allPeriodEmployeeRecords, employeeDeptFilter, employeeStatusFilter, employeeSearchQuery]);

  const handleApplyPicker = () => {
    if (onPeriodChange) {
      onPeriodChange({
        month: pickerTempMonth,
        year: pickerTempYear,
        week: pickerTempWeek,
        day: pickerTempDay,
      });
    }
    setIsPickerOpen(false);
  };

  const renderLogBadges = (log) => {
    if (log.status === 'leave' || log.status === 'off' || log.status === 'off_day' || log.status === 'LIBUR') {
      return (
        <span
          style={{
            backgroundColor: '#64748B',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {log.status === 'off' || log.status === 'off_day' || log.status === 'LIBUR'
            ? (language === 'id' ? 'Libur' : 'Day Off')
            : (language === 'id' ? 'Izin / Cuti' : 'Leave')}
        </span>
      );
    }
    if (log.status === 'alpha') {
      return (
        <span
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          Alpha
        </span>
      );
    }

    const inStatus = log.inStatus || (log.status === 'late' ? 'LATE' : 'ON_TIME');
    const outStatus = log.outStatus || 'ON_TIME';

    if (inStatus === 'ON_TIME' && outStatus === 'ON_TIME') {
      return (
        <span
          style={{
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Tepat Waktu' : 'On Time'}
        </span>
      );
    }

    const badges = [];
    if (inStatus === 'LATE') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {log.lateMinutes ? (language === 'id' ? `Terlambat (${log.lateMinutes}m)` : `Late (${log.lateMinutes}m)`) : (language === 'id' ? 'Terlambat' : 'Late')}
        </span>
      );
    } else if (inStatus === 'EARLY_IN' || inStatus === 'ON_TIME') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {inStatus === 'EARLY_IN'
            ? (language === 'id' ? 'Masuk Awal' : 'Early In')
            : (language === 'id' ? 'Tepat Waktu' : 'On Time')}
        </span>
      );
    }

    if (outStatus === 'EARLY_OUT') {
      badges.push(
        <span
          key="out"
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          {language === 'id' ? 'Pulang Awal' : 'Early Out'}
        </span>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {badges}
      </div>
    );
  };

  const renderDailyEmployeeBadges = (emp) => {
    if (emp.status === 'LEAVE' || emp.status === 'OFF' || emp.status === 'LIBUR') {
      return (
        <span
          style={{
            backgroundColor: '#64748B',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          {emp.status === 'OFF' || emp.status === 'LIBUR'
            ? (language === 'id' ? 'Libur' : 'Day Off')
            : (language === 'id' ? 'Izin / Cuti' : 'Leave')}
        </span>
      );
    }
    if (emp.status === 'ALPHA') {
      return (
        <span
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          Alpha
        </span>
      );
    }

    const inStatus = emp.inStatus || (emp.status === 'LATE' ? 'LATE' : emp.status === 'EARLY_IN' ? 'EARLY_IN' : 'ON_TIME');
    const outStatus = emp.outStatus || (emp.status === 'EARLY_OUT' ? 'EARLY_OUT' : 'ON_TIME');

    if (inStatus === 'ON_TIME' && outStatus === 'ON_TIME' && emp.status === 'ONTIME') {
      return (
        <span
          style={{
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          {language === 'id' ? 'Tepat Waktu' : 'On Time'}
        </span>
      );
    }

    const badges = [];

    // In Badge
    if (inStatus === 'LATE') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          {emp.lateMinutes
            ? language === 'id'
              ? `Terlambat (${emp.lateMinutes}m)`
              : `Late (${emp.lateMinutes}m)`
            : language === 'id'
            ? 'Terlambat'
            : 'Late'}
        </span>
      );
    } else if (inStatus === 'EARLY_IN') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          {language === 'id' ? 'Masuk Awal' : 'Early In'}
        </span>
      );
    } else if (inStatus === 'ON_TIME' && outStatus === 'EARLY_OUT') {
      badges.push(
        <span
          key="in"
          style={{
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          {language === 'id' ? 'Tepat Waktu' : 'On Time'}
        </span>
      );
    }

    // Out Badge
    if (outStatus === 'EARLY_OUT') {
      badges.push(
        <span
          key="out"
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          {language === 'id' ? 'Pulang Awal' : 'Early Out'}
        </span>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap', flexShrink: 0 }}>
        {badges}
      </div>
    );
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
        paddingBottom: '28px',
      }}
    >
      {/* BM Role: Segmented Tab Switcher (Absensi Saya vs Karyawan Lain) */}
      {isBM && (
        <div
          style={{
            display: 'flex',
            backgroundColor: '#E2E8F0',
            borderRadius: '12px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMainTab('MY_ATTENDANCE')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeMainTab === 'MY_ATTENDANCE' ? '#FFFFFF' : 'transparent',
              color: activeMainTab === 'MY_ATTENDANCE' ? '#02388A' : '#64748B',
              fontSize: '0.8125rem',
              fontWeight: activeMainTab === 'MY_ATTENDANCE' ? 700 : 600,
              boxShadow: activeMainTab === 'MY_ATTENDANCE' ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={16} weight={activeMainTab === 'MY_ATTENDANCE' ? 'bold' : 'regular'} />
            <span>{language === 'id' ? 'Absensi Saya' : 'My Attendance'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('EMPLOYEES')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeMainTab === 'EMPLOYEES' ? '#FFFFFF' : 'transparent',
              color: activeMainTab === 'EMPLOYEES' ? '#02388A' : '#64748B',
              fontSize: '0.8125rem',
              fontWeight: activeMainTab === 'EMPLOYEES' ? 700 : 600,
              boxShadow: activeMainTab === 'EMPLOYEES' ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Users size={16} weight={activeMainTab === 'EMPLOYEES' ? 'bold' : 'regular'} />
            <span>{language === 'id' ? 'Karyawan Lain' : 'All Employees'}</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: PERSONAL ATTENDANCE (MY ATTENDANCE)
          ========================================================================= */}
      {(!isBM || activeMainTab === 'MY_ATTENDANCE') && (
        <>
          {/* 1. KPI Summary Card */}
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
            <div>
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                {language === 'id' ? 'Ringkasan Kehadiran' : 'Attendance Summary'}
              </h2>
              <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                {periodMode === 'daily'
                  ? (language === 'id' ? `${DAY_NAMES_ID[new Date(selectedYear, selectedMonth, safeDay).getDay()]}, ${safeDay} ${MONTH_NAMES_ID[selectedMonth]} ${selectedYear} • Divisi Engineering` : `${safeDay} ${MONTH_NAMES[selectedMonth]} ${selectedYear} • Engineering Dept`)
                  : periodMode === 'weekly'
                  ? (language === 'id' ? `Minggu ${selectedWeek} (${currentWeekObj.startDay}-${currentWeekObj.endDay} ${MONTH_SHORT_ID[selectedMonth]}) • Engineering` : `Week ${selectedWeek} • Engineering`)
                  : (language === 'id' ? `${MONTH_NAMES_ID[selectedMonth]} ${selectedYear} • Divisi Engineering` : `${MONTH_NAMES[selectedMonth]} ${selectedYear} • Engineering Dept`)}
              </p>
            </div>

            {/* Hero Fill Attendance Rate Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #02388A 0%, #0052CC 60%, #0284C7 100%)',
                borderRadius: '14px',
                padding: '13px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarBlank size={18} weight="fill" color="#38BDF8" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.1px' }}>
                    {language === 'id' ? 'Tingkat Kehadiran' : 'Attendance Rate'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {presentCount}/{totalLogs} {language === 'id' ? 'Hari' : 'Days'}
                  </span>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1,
                    }}
                  >
                    {attendanceRatePct}%
                  </span>
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${attendanceRatePct}%`,
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* 4 Day Count KPI Metrics Micro-Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1 }}>{onTimeCount}</span>
                <span style={{ fontSize: '0.6875rem', color: '#15803D', fontWeight: 600 }}>{language === 'id' ? 'Tepat' : 'On Time'}</span>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FEF3C7',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>{lateCount}</span>
                <span style={{ fontSize: '0.6875rem', color: '#B45309', fontWeight: 600 }}>{language === 'id' ? 'Terlambat' : 'Late'}</span>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#475569', lineHeight: 1.1 }}>{leaveCount}</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>{language === 'id' ? 'Izin' : 'Leave'}</span>
              </div>

              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>{alphaCount}</span>
                <span style={{ fontSize: '0.6875rem', color: '#991B1B', fontWeight: 600 }}>Alpha</span>
              </div>
            </div>
          </div>

          {/* 2. Attendance Logs List Header & Filter Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: filteredPersonalLogs.length === 0 ? 1 : 'initial' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: '4px 0 0 0' }}>
              {periodMode === 'daily'
                ? (language === 'id' ? 'Riwayat Absensi Harian' : 'Daily Attendance Record')
                : periodMode === 'weekly'
                ? (language === 'id' ? 'Riwayat Absensi Mingguan' : 'Weekly Attendance Records')
                : (language === 'id' ? 'Riwayat Absensi Bulanan' : 'Monthly Attendance Records')}
            </h3>

            {/* Status Filter Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '2px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {[
                { id: 'ALL', label: language === 'id' ? 'Semua' : 'All', count: totalLogs },
                { id: 'ONTIME', label: language === 'id' ? 'Tepat' : 'On Time', count: onTimeCount },
                { id: 'LATE', label: language === 'id' ? 'Terlambat' : 'Late', count: lateCount },
                { id: 'LEAVE', label: language === 'id' ? 'Izin/Cuti' : 'Leave', count: leaveCount },
                { id: 'ALPHA', label: 'Alpha', count: alphaCount },
              ].map((filterTab) => {
                const isActive = activeFilter === filterTab.id;
                return (
                  <button
                    key={filterTab.id}
                    type="button"
                    onClick={() => setActiveFilter(filterTab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      border: isActive ? '1px solid #02388A' : '1px solid #E2E8F0',
                      backgroundColor: isActive ? '#02388A' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    <span>{filterTab.label}</span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                        color: isActive ? '#FFFFFF' : '#64748B',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      {filterTab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* List of Attendance Cards */}
            {filteredPersonalLogs.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  gap: '12px',
                  textAlign: 'center',
                }}
              >
                <img
                  src={attendanceEmptySearch}
                  alt="No attendance records"
                  style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                    {language === 'id' ? 'Tidak Ada Catatan Presensi' : 'No Attendance Records'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {language === 'id' ? 'Tidak ada data pada filter yang dipilih.' : 'No data found for the selected filter.'}
                  </span>
                </div>
              </div>
            ) : (
              filteredPersonalLogs.map((log) => {
                const dateObj = log.date;
                const dayOfWeek = dateObj.getDay();
                const dayName = language === 'id' ? DAY_NAMES_ID[dayOfWeek] : DAY_NAMES[dayOfWeek];
                const monthShort = language === 'id' ? MONTH_SHORT_ID[selectedMonth] : MONTH_SHORT[selectedMonth];
                const dateFormatted = `${dayName}, ${log.dayNumber} ${monthShort} ${selectedYear}`;

                const isLate = log.status === 'late' || log.inStatus === 'LATE' || log.outStatus === 'EARLY_OUT';
                const isAlpha = log.status === 'alpha';
                const isOff = log.status === 'leave' || log.status === 'off' || log.status === 'off_day' || log.status === 'LIBUR';

                let cardBg = '#FFFFFF';
                let cardBorder = '1px solid #E2E8F0';
                let tileBg = '#F8FAFC';
                let tileBorder = '1px solid #E2E8F0';

                if (isAlpha) {
                  cardBg = '#FEF2F2';
                  cardBorder = '1px solid #FECACA';
                  tileBg = '#FFFFFF';
                  tileBorder = '1px solid #FEE2E2';
                } else if (isLate) {
                  cardBg = '#FFFBEB';
                  cardBorder = '1px solid #FDE68A';
                  tileBg = '#FFFFFF';
                  tileBorder = '1px solid #FEF3C7';
                } else if (isOff) {
                  cardBg = '#F8FAFC';
                  cardBorder = '1px solid #E2E8F0';
                  tileBg = '#FFFFFF';
                  tileBorder = '1px solid #E2E8F0';
                }

                return (
                  <div
                    key={log.id}
                    onClick={() => {
                      const dayNameEn = DAY_NAMES[dayOfWeek];
                      const dayNameId = DAY_NAMES_ID[dayOfWeek];
                      const detailObj = {
                        date: dateFormatted,
                        dateEn: `${dayNameEn}, ${log.dayNumber} ${MONTH_SHORT[selectedMonth]} ${selectedYear}`,
                        shift: log.shift || 'Shift Pagi (08:00 - 17:00 WIB)',
                        clockIn: log.clockIn,
                        clockOut: log.clockOut,
                        duration: log.workDuration || '8h 50m',
                        status: log.status?.toUpperCase(),
                        inStatus: log.inStatus,
                        outStatus: log.outStatus,
                        lateMinutes: log.lateMinutes || (log.inStatus === 'LATE' ? 14 : 0),
                        earlyInMinutes: log.inStatus === 'EARLY_IN' ? 10 : 0,
                        earlyOutMinutes: log.outStatus === 'EARLY_OUT' ? 15 : 0,
                        location: 'Thamrin Executive Residences • Tower A',
                        clockInLocation: 'Lobby Tower A (Radius 8m)',
                        clockOutLocation: 'West Security Gate (Radius 12m)',
                        attendanceMethod: 'GPS & Face Biometric Verification',
                        siteName: 'Thamrin Executive Residences',
                        note: log.notes || (log.inStatus === 'LATE' ? 'Kepadatan lalu lintas pagi hari' : 'Presensi harian tercatat dalam geofence radius'),
                      };
                      if (onSelectAttendanceRecord) {
                        onSelectAttendanceRecord(detailObj);
                      }
                    }}
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '14px',
                      border: cardBorder,
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                        {dateFormatted}
                      </span>
                      {renderLogBadges(log)}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        backgroundColor: tileBg,
                        borderRadius: '10px',
                        padding: '8px 12px',
                        border: tileBorder,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                          {language === 'id' ? 'Masuk' : 'Clock In'}
                        </span>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                          {log.clockIn}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                          {language === 'id' ? 'Keluar' : 'Clock Out'}
                        </span>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                          {log.clockOut}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                      <span style={{ fontWeight: 500, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                        {log.shift || 'Shift Pagi (08:00 - 17:00)'}
                      </span>
                      <span style={{ fontWeight: 600, color: '#334155', flexShrink: 0 }}>
                        {language === 'id' ? `Durasi: ${log.workDuration}` : `Duration: ${log.workDuration}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: ALL EMPLOYEES ATTENDANCE (BM ONLY)
          ========================================================================= */}
      {isBM && activeMainTab === 'EMPLOYEES' && (
        <>
          {/* 1. Overall Employees KPI Summary Card */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                  {language === 'id' ? 'Presensi Seluruh Karyawan' : 'All Employee Attendance'}
                </h2>
                <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                  {periodMode === 'daily'
                    ? (language === 'id' ? `${DAY_NAMES_ID[new Date(selectedYear, selectedMonth, safeDay).getDay()]}, ${safeDay} ${MONTH_NAMES_ID[selectedMonth]} ${selectedYear}` : `${safeDay} ${MONTH_NAMES[selectedMonth]} ${selectedYear}`)
                    : periodMode === 'weekly'
                    ? (language === 'id' ? `Minggu ${selectedWeek} (${currentWeekObj.startDay}-${currentWeekObj.endDay} ${MONTH_SHORT_ID[selectedMonth]})` : `Week ${selectedWeek}`)
                    : (language === 'id' ? `Bulan ${MONTH_NAMES_ID[selectedMonth]} ${selectedYear}` : `${MONTH_NAMES[selectedMonth]} ${selectedYear}`)}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #DBEAFE',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {totalEmpRecords} {language === 'id' ? 'Presensi' : 'Records'}
              </div>
            </div>

            {/* 4 Day Count KPI Metrics Micro-Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1 }}>{empKpiOntime}</span>
                <span style={{ fontSize: '0.6875rem', color: '#15803D', fontWeight: 600 }}>{language === 'id' ? 'Tepat' : 'On Time'}</span>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FEF3C7',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>{empKpiLate}</span>
                <span style={{ fontSize: '0.6875rem', color: '#B45309', fontWeight: 600 }}>{language === 'id' ? 'Terlambat' : 'Late'}</span>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#475569', lineHeight: 1.1 }}>{empKpiLeave}</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>{language === 'id' ? 'Izin/Libur' : 'Leave/Off'}</span>
              </div>

              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>{empKpiAlpha}</span>
                <span style={{ fontSize: '0.6875rem', color: '#991B1B', fontWeight: 600 }}>Alpha</span>
              </div>
            </div>
          </div>

          {/* 2. Department Breakdown Progress Accordion Card (For Monthly / Weekly modes) */}
          {periodMode !== 'daily' && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                  {periodMode === 'weekly'
                    ? (language === 'id' ? 'Kehadiran Mingguan Per Departemen' : 'Weekly Attendance by Department')
                    : (language === 'id' ? 'Kehadiran Bulanan Per Departemen' : 'Monthly Attendance by Department')}
                </h3>
                <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                  {language === 'id'
                    ? 'Rata-rata tingkat kehadiran & pemenuhan shift kerja'
                    : 'Average attendance rate & shift fulfillment'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {DEPARTMENTS_DATA.map((dept) => {
                  const ratioPercent = Math.round((dept.present / dept.totalAssigned) * 100);
                  return (
                    <div key={dept.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                          {dept.name}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                          {dept.present}/{dept.totalAssigned} ({ratioPercent}%)
                        </span>
                      </div>

                      <div
                        style={{
                          width: '100%',
                          height: '7px',
                          backgroundColor: '#F1F5F9',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${ratioPercent}%`,
                            height: '100%',
                            backgroundColor: '#02388A',
                            borderRadius: '9999px',
                            transition: 'width 0.4s ease-out',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Employee List Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: displayEmployeesList.length === 0 ? 1 : 'initial' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: '4px 0 0 0' }}>
              {periodMode === 'daily'
                ? (language === 'id' ? 'Daftar Presensi Karyawan Harian' : 'Daily Employee Attendance List')
                : periodMode === 'weekly'
                ? (language === 'id' ? 'Daftar Presensi Karyawan Mingguan' : 'Weekly Employee Attendance List')
                : (language === 'id' ? 'Daftar Presensi Karyawan Bulanan' : 'Monthly Employee Attendance List')}
            </h3>

            {/* Search Input Bar */}
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
                gap: '8px',
              }}
            >
              <MagnifyingGlass size={18} color="#64748B" weight="bold" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={employeeSearchQuery}
                onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari nama karyawan / tanggal / divisi...' : 'Search employee / date / dept...'}
                style={{
                  border: 'none',
                  outline: 'none',
                  padding: 0,
                  margin: 0,
                  boxShadow: 'none',
                  flex: 1,
                  minWidth: 0,
                  width: '100%',
                  fontSize: '0.8125rem',
                  color: '#334155',
                  backgroundColor: 'transparent',
                }}
              />
              {employeeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setEmployeeSearchQuery('')}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '2px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {[
                { id: 'ALL', label: language === 'id' ? 'Semua' : 'All', count: totalEmpRecords },
                { id: 'ONTIME', label: language === 'id' ? 'Tepat' : 'On Time', count: empKpiOntime },
                { id: 'LATE', label: language === 'id' ? 'Terlambat' : 'Late', count: empKpiLate },
                { id: 'LEAVE', label: language === 'id' ? 'Izin/Libur' : 'Leave/Off', count: empKpiLeave },
                { id: 'ALPHA', label: 'Alpha', count: empKpiAlpha },
              ].map((filterTab) => {
                const isActive = employeeStatusFilter === filterTab.id;
                return (
                  <button
                    key={filterTab.id}
                    type="button"
                    onClick={() => setEmployeeStatusFilter(filterTab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      border: isActive ? '1px solid #02388A' : '1px solid #E2E8F0',
                      backgroundColor: isActive ? '#02388A' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    <span>{filterTab.label}</span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                        color: isActive ? '#FFFFFF' : '#64748B',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      {filterTab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* List of Employee Cards */}
            {displayEmployeesList.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  gap: '12px',
                  textAlign: 'center',
                }}
              >
                <img
                  src={attendanceEmptySearch}
                  alt="No employee data"
                  style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                    {language === 'id' ? 'Karyawan Tidak Ditemukan' : 'Employee Not Found'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {language === 'id' ? 'Tidak ada data presensi yang cocok dengan filter.' : 'No employee matching the selected criteria.'}
                  </span>
                </div>
              </div>
            ) : (
              displayEmployeesList.map((emp) => {
                const dateText = language === 'id' ? emp.dateFormattedId : emp.dateFormattedEn;

                const isLate = emp.status === 'LATE' || emp.inStatus === 'LATE' || emp.outStatus === 'EARLY_OUT';
                const isAlpha = emp.status === 'ALPHA';
                const isOff = emp.status === 'LEAVE' || emp.status === 'OFF' || emp.status === 'LIBUR';

                let cardBg = '#FFFFFF';
                let cardBorder = '1px solid #E2E8F0';
                let tileBg = '#F8FAFC';
                let tileBorder = '1px solid #E2E8F0';

                if (isAlpha) {
                  cardBg = '#FEF2F2';
                  cardBorder = '1px solid #FECACA';
                  tileBg = '#FFFFFF';
                  tileBorder = '1px solid #FEE2E2';
                } else if (isLate) {
                  cardBg = '#FFFBEB';
                  cardBorder = '1px solid #FDE68A';
                  tileBg = '#FFFFFF';
                  tileBorder = '1px solid #FEF3C7';
                } else if (isOff) {
                  cardBg = '#F8FAFC';
                  cardBorder = '1px solid #E2E8F0';
                  tileBg = '#FFFFFF';
                  tileBorder = '1px solid #E2E8F0';
                }

                return (
                  <div
                    key={emp.recordId || emp.id}
                    onClick={() => {
                      const detailObj = {
                        date: dateText,
                        dateEn: dateText,
                        shift: emp.shift || 'Shift Pagi (08:00 - 17:00 WIB)',
                        clockIn: emp.clockIn,
                        clockOut: emp.clockOut,
                        duration: emp.duration || '8h 50m',
                        status: emp.status?.toUpperCase(),
                        inStatus: emp.inStatus,
                        outStatus: emp.outStatus,
                        lateMinutes: emp.lateMinutes || (emp.inStatus === 'LATE' ? 14 : 0),
                        earlyInMinutes: emp.inStatus === 'EARLY_IN' ? 10 : 0,
                        earlyOutMinutes: emp.outStatus === 'EARLY_OUT' ? 15 : 0,
                        location: `${emp.dept || 'Engineering'} • ${emp.role || 'Staff'}`,
                        clockInLocation: 'Lobby Tower A (Radius 8m)',
                        clockOutLocation: 'West Security Gate (Radius 12m)',
                        attendanceMethod: 'GPS & Face Biometric Verification',
                        siteName: 'Thamrin Executive Residences',
                        note: `${emp.name} (${emp.dept} - ${emp.role}) • Presensi Geofence Mobile App`,
                      };
                      if (onSelectAttendanceRecord) {
                        onSelectAttendanceRecord(detailObj);
                      }
                    }}
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '14px',
                      border: cardBorder,
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Top Row: Date on Left, Status Badge on Right (Consistent with My Attendance, never drops down) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                        {dateText}
                      </span>
                      {renderDailyEmployeeBadges(emp)}
                    </div>

                    {/* Middle: Employee Name & Role Only (No Jabatan) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '-2px' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                        {emp.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                        {emp.dept || emp.role}
                      </span>
                    </div>

                    {/* Clock In & Out Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        backgroundColor: tileBg,
                        border: tileBorder,
                        borderRadius: '10px',
                        padding: '8px 12px',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                          {language === 'id' ? 'Masuk' : 'Clock In'}
                        </span>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                          {emp.clockIn || '-- : --'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                          {language === 'id' ? 'Keluar' : 'Clock Out'}
                        </span>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                          {emp.clockOut || '-- : --'}
                        </div>
                      </div>
                    </div>

                    {/* Footer Shift & Duration */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                      <span style={{ fontWeight: 500, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                        {emp.shift}
                      </span>
                      <span style={{ fontWeight: 600, color: '#334155', flexShrink: 0 }}>
                        {language === 'id' ? `Durasi: ${emp.duration || '--'}` : `Duration: ${emp.duration || '--'}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Picker Bottom Sheet Modal (In-Frame Portal) */}
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
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', margin: 0 }}>
                  {periodMode === 'daily'
                    ? (language === 'id' ? 'Pilih Tanggal Presensi' : 'Select Attendance Date')
                    : periodMode === 'weekly'
                    ? (language === 'id' ? 'Pilih Periode Minggu' : 'Select Week Period')
                    : (language === 'id' ? 'Pilih Periode Bulan' : 'Select Month Period')}
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

              {/* 1. PICKER FOR MONTHLY MODE */}
              {periodMode === 'monthly' && (
                <>
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
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
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
                </>
              )}

              {/* 2. PICKER FOR WEEKLY MODE */}
              {periodMode === 'weekly' && (
                <>
                  {/* Month / Year Switcher */}
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
                      onClick={() => {
                        if (pickerTempMonth === 0) {
                          setPickerTempMonth(11);
                          setPickerTempYear((y) => y - 1);
                        } else {
                          setPickerTempMonth((m) => m - 1);
                        }
                      }}
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
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                      {language === 'id' ? MONTH_NAMES_ID[pickerTempMonth] : MONTH_NAMES[pickerTempMonth]} {pickerTempYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (pickerTempMonth === 11) {
                          setPickerTempMonth(0);
                          setPickerTempYear((y) => y + 1);
                        } else {
                          setPickerTempMonth((m) => m + 1);
                        }
                      }}
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

                  {/* Weeks List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {getMonthWeeks(pickerTempYear, pickerTempMonth).map((w) => {
                      const isSelected = pickerTempWeek === w.weekNumber;
                      const monthShort = language === 'id' ? MONTH_SHORT_ID[pickerTempMonth] : MONTH_SHORT[pickerTempMonth];
                      return (
                        <button
                          key={w.weekNumber}
                          type="button"
                          onClick={() => setPickerTempWeek(w.weekNumber)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: isSelected ? '1.5px solid #02388A' : '1px solid #E2E8F0',
                            backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                            color: isSelected ? '#02388A' : '#334155',
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            fontWeight: isSelected ? 800 : 600,
                          }}
                        >
                          <span>{language === 'id' ? `Minggu ${w.weekNumber}` : `Week ${w.weekNumber}`}</span>
                          <span style={{ fontSize: '0.75rem', color: isSelected ? '#02388A' : '#64748B', fontWeight: 500 }}>
                            {w.startDay} - {w.endDay} {monthShort} {pickerTempYear}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* 3. PICKER FOR DAILY MODE */}
              {periodMode === 'daily' && (
                <>
                  {/* Month / Year Switcher */}
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
                      onClick={() => {
                        if (pickerTempMonth === 0) {
                          setPickerTempMonth(11);
                          setPickerTempYear((y) => y - 1);
                        } else {
                          setPickerTempMonth((m) => m - 1);
                        }
                      }}
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
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                      {language === 'id' ? MONTH_NAMES_ID[pickerTempMonth] : MONTH_NAMES[pickerTempMonth]} {pickerTempYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (pickerTempMonth === 11) {
                          setPickerTempMonth(0);
                          setPickerTempYear((y) => y + 1);
                        } else {
                          setPickerTempMonth((m) => m + 1);
                        }
                      }}
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

                  {/* Calendar Days Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Weekday headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                      {(language === 'id' ? DAY_SHORT_ID : DAY_SHORT_EN).map((dName) => (
                        <span key={dName} style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94A3B8' }}>
                          {dName}
                        </span>
                      ))}
                    </div>

                    {/* Date grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {(() => {
                        const daysInMonth = new Date(pickerTempYear, pickerTempMonth + 1, 0).getDate();
                        const firstDayOfWeek = new Date(pickerTempYear, pickerTempMonth, 1).getDay(); // 0 = Sun
                        const daysArray = [];

                        // Empty slots before 1st of month
                        for (let i = 0; i < firstDayOfWeek; i++) {
                          daysArray.push(<div key={`empty-${i}`} style={{ height: '36px' }} />);
                        }

                        // Day numbers
                        for (let d = 1; d <= daysInMonth; d++) {
                          const isSelected = pickerTempDay === d;
                          daysArray.push(
                            <button
                              key={`day-${d}`}
                              type="button"
                              onClick={() => setPickerTempDay(d)}
                              style={{
                                height: '36px',
                                borderRadius: '10px',
                                border: isSelected ? '1.5px solid #02388A' : '1px solid transparent',
                                backgroundColor: isSelected ? '#02388A' : '#F8FAFC',
                                color: isSelected ? '#FFFFFF' : '#334155',
                                fontSize: '0.8125rem',
                                fontWeight: isSelected ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {d}
                            </button>
                          );
                        }

                        return daysArray;
                      })()}
                    </div>
                  </div>
                </>
              )}

              {/* Apply Button */}
              <button
                type="button"
                onClick={handleApplyPicker}
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

export default MonthlyAttendanceDetailView;

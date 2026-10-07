import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { matchesRequestDate, formatRequestSubmission } from '../utils/requestDates';
import { getCategoryOptions, getRequestDisplayTitle } from '../utils/requestCategories';
import PermitPermissionView from './PermitPermissionView';
import ManualAttendanceView from './ManualAttendanceView';
import ChangeShiftView from './ChangeShiftView';
import OvertimeView from './OvertimeView';
import RequestPermissionDetailView from './RequestPermissionDetailView';
import noPermissionRequests from '../assets/illustrations/no-permission-requests.png';
import successCheck from '../assets/illustrations/success-check.png';
import {
  CaretLeft,
  CaretRight,
  CaretDown,
  CaretUp,
  Plus,
  FileText,
  Clock,
  ClockCountdown,
  ArrowsLeftRight,
  CheckCircle,
  XCircle,
  X,
  MagnifyingGlass,
  CalendarCheck,
  User,
  Paperclip,
  Check,
  Info,
  CalendarBlank,
  Buildings,
  UploadSimple,
  Trash,
  ArrowClockwise,
  FilePdf,
  FileDoc,
  FileCsv,
  FileImage,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import { CustomDatePickerPopover } from '../components/common';

const INITIAL_REQUESTS = [
  {
    id: 'REQ-PRM-2026-0048',
    type: 'PERMIT',
    subType: 'Sakit Rawat Inap',
    title: 'Sakit Rawat Inap',
    dateDisplay: '07 Okt 2026 - 11 Okt 2026',
    scheduleDate: '2026-10-07',
    duration: '5 Hari',
    submittedAt: '07 Okt 2026 • 08:00',
    status: 'APPROVED',
    reason: 'Demam Berdarah',
    approver: 'Hendra Wijaya (Building Manager)',
    approvedAt: '07 Okt 2026 • 09:30',
    attachment: 'Surat_Keterangan_Rawat_Inap_DBD.pdf',
    attachmentName: 'Surat_Keterangan_Rawat_Inap_DBD.pdf',
    attachmentSize: '1.2 MB',
  },
  {
    id: 'REQ-MAT-2026-0045',
    type: 'MANUAL_ATTENDANCE',
    subType: 'Manual Attendance',
    title: 'Manual Clock Out',
    shift: 'Shift Malam (20:00 - 05:00)',
    dateDisplay: '27 Sep 2026',
    scheduleDate: '2026-09-27',
    checkIn: '20:05',
    checkOut: '05:00',
    duration: 'Clock Out: 05:00',
    submittedAt: '28 Sep 2026 • 07:45',
    status: 'PENDING',
    reason: 'Baterai smartphone habis saat jam pulang dan antrian scan di pos sedang padat.',
    approver: 'Menunggu Building Service',
    location: 'Pos Security Lobby Utama',
    attachment: null,
  },
  {
    id: 'REQ-OVT-2026-0039',
    type: 'OVERTIME',
    subType: 'Staff Overtime',
    title: 'Staff Overtime',
    overtimeMode: 'OVERTIME_STAFF',
    dateDisplay: '26 Sep 2026 • 17:00 - 20:30',
    duration: '3.5 Jam',
    submittedAt: '26 Sep 2026 • 16:30',
    status: 'APPROVED',
    reason: 'Instalasi pipa pompa transfer air bersih mengalami kebocoran sambungan dan butuh penanganan segera.',
    approver: 'Bambang Sudirgo (Chief Engineering)',
    approvedAt: '26 Sep 2026 • 21:00',
    attachment: 'laporan_pekerjaan_pipa.pdf',
  },
  {
    id: 'REQ-OVT-2026-0032',
    type: 'OVERTIME',
    subType: 'BKO Overtime',
    title: 'BKO Overtime',
    overtimeMode: 'OVERTIME_BKO',
    shift: 'Shift Malam (20:00 - 05:00)',
    dateDisplay: '22 Sep 2026',
    duration: '1 Shift',
    submittedAt: '21 Sep 2026 • 11:20',
    status: 'APPROVED',
    reason: 'Penugasan BKO pengamanan tambahan area loading dock dan basement saat kunjungan VIP tenant.',
    approver: 'Bambang Sudirgo (Chief Engineering)',
    approvedAt: '21 Sep 2026 • 14:00',
    attachment: null,
  },
  {
    id: 'REQ-CSH-2026-0041',
    type: 'CHANGE_SHIFT',
    subType: 'Ganti Shift',
    title: 'Shift Change',
    fromShift: 'Shift Pagi (08:00 - 17:00)',
    toShift: 'Shift Malam (20:00 - 05:00)',
    dateDisplay: '28 Sep 2026',
    scheduleDate: '2026-09-28',
    duration: '1 Shift',
    submittedAt: '27 Sep 2026 • 09:30',
    status: 'APPROVED',
    reason: 'Ada keperluan keluarga mendesak di pagi hari, bersedia menggantikan jadwal shift malam.',
    approver: 'Hendra Wijaya',
    approvedAt: '27 Sep 2026 • 11:15',
  },
  {
    id: 'REQ-CSH-2026-0034',
    type: 'CHANGE_SHIFT',
    subType: 'Tukar Shift',
    title: 'Shift Swap',
    fromShift: 'Shift Siang (13:00 - 21:00)',
    toShift: 'Shift Pagi (08:00 - 17:00)',
    dateDisplay: '25 Sep 2026',
    scheduleDate: '2026-09-25',
    duration: '1 Shift',
    submittedAt: '24 Sep 2026 • 14:10',
    status: 'APPROVED',
    reason: 'Menemani orang tua kontrol kesehatan di rumah sakit pada sore hari.',
    swapWith: 'Dimas Prasetyo (Engineering)',
    approver: 'Hendra Wijaya',
    approvedAt: '24 Sep 2026 • 16:20',
  },
  {
    id: 'REQ-MAT-2026-0019',
    type: 'MANUAL_ATTENDANCE',
    subType: 'Manual Attendance',
    title: 'Manual Clock In & Out',
    shift: 'Shift Pagi (08:00 - 17:00)',
    dateDisplay: '10 Sep 2026',
    scheduleDate: '2026-09-10',
    checkIn: '07:55',
    checkOut: '17:05',
    duration: '07:55 - 17:05',
    submittedAt: '10 Sep 2026 • 17:30',
    status: 'REJECTED',
    reason: 'Aplikasi sempat error GPS out of range saat di lobby.',
    approver: 'Hendra Wijaya',
    rejectReason: 'Setelah diverifikasi dengan CCTV pos lobby, karyawan baru hadir pukul 08:35 WIB (terlambat). Silakan ajukan ulang sesuai jam kehadiran riil.',
    attachment: null,
  },
];

const REQUEST_FONT = { body: '16px', heading: '16px', caption: '12px' };

const REQUEST_TYPE_OPTIONS = [
  { id: 'PERMIT', label: 'Permit Permission', defaultSubType: 'Cuti Tahunan', icon: FileText, description: { id: 'Ajukan izin, cuti, atau sakit.', en: 'Request leave, time off, or sick leave.' } },
  { id: 'MANUAL_ATTENDANCE', label: 'Manual Attendance', defaultSubType: 'Lupa Clock In', icon: Clock, description: { id: 'Koreksi clock in atau clock out yang terlewat.', en: 'Correct a missed clock in or clock out.' } },
  { id: 'OVERTIME', label: 'Overtime', defaultSubType: 'BKO Overtime', icon: ClockCountdown, description: { id: 'Ajukan BKO Overtime atau Staff Overtime.', en: 'Request BKO Overtime or Staff Overtime.' } },
  { id: 'CHANGE_SHIFT', label: 'Change Shift', defaultSubType: 'Tukar Shift', icon: ArrowsLeftRight, description: { id: 'Ajukan perubahan atau tukar jadwal shift.', en: 'Request a shift change or swap.' } },
];

// Demo entitlement values; independent from search and request-list filters.
const PERMIT_QUOTA = {
  periodStart: '2026-01-01',
  periodEnd: '2026-12-31',
  items: [
    { id: 'annual-leave', name: { id: 'Cuti Tahunan', en: 'Annual Leave' }, quota: 8, used: 4 },
    { id: 'outpatient-sick-leave', name: { id: 'Izin Sakit', en: 'Sick Leave' }, quota: 11, used: 1 },
    { id: 'personal-leave', name: { id: 'Izin Pribadi', en: 'Personal Leave' }, quota: 3, used: 1 },
    { id: 'special-leave', name: { id: 'Cuti Khusus', en: 'Special Leave' }, quota: 5, used: 0 },
    { id: 'compensatory-leave', name: { id: 'Cuti Pengganti', en: 'Comp Leave' }, quota: 2, used: 0 },
  ],
};

const handleRequestSheetKeys = (event, onClose) => {
  if (event.key === 'Escape') onClose();
  if (event.key !== 'Tab') return;
  const controls = event.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)');
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
};

const getFileIconInfo = (fileName) => {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  let Icon = FileText;
  if (['csv'].includes(ext)) {
    Icon = FileCsv;
  } else if (['pdf'].includes(ext)) {
    Icon = FilePdf;
  } else if (['doc', 'docx'].includes(ext)) {
    Icon = FileDoc;
  } else if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) {
    Icon = FileImage;
  }

  return {
    Icon,
    color: '#09B2FF',
    bgColor: '#EAF7FF',
    borderColor: '#BAE6FD',
  };
};

export const RequestPermissionView = ({ onBack, user }) => {
  const { language } = useLanguage();

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempActiveTab, setTempActiveTab] = useState('ALL');
  const [tempStatusFilter, setTempStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [tempDateFilter, setTempDateFilter] = useState('');

  const hasActiveFilter = activeTab !== 'ALL' || statusFilter !== 'ALL' || !!dateFilter;
  const activeFiltersCount = (activeTab !== 'ALL' ? 1 : 0) + (statusFilter !== 'ALL' ? 1 : 0) + (dateFilter ? 1 : 0);

  // New Request Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isPermitPageOpen, setIsPermitPageOpen] = useState(false);
  const [isManualAttendancePageOpen, setIsManualAttendancePageOpen] = useState(false);
  const [isChangeShiftPageOpen, setIsChangeShiftPageOpen] = useState(false);
  const [isOvertimePageOpen, setIsOvertimePageOpen] = useState(false);
  const [isRequestTypeOpen, setIsRequestTypeOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [formType, setFormType] = useState('PERMIT');
  const [formSubType, setFormSubType] = useState('Cuti Tahunan');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [activeDatePicker, setActiveDatePicker] = useState(null); // 'start' | 'end' | null
  const [formTime, setFormTime] = useState('');
  const [formEndTime, setFormEndTime] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formSwapWith, setFormSwapWith] = useState('');
  const [formAttachment, setFormAttachment] = useState(null);
  const [formAttachments, setFormAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccessSheetOpen, setIsSuccessSheetOpen] = useState(false);
  const [isReviewSheetOpen, setIsReviewSheetOpen] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const startFileUploadSimulation = (fileId) => {
    let currentProgress = 15;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 22) + 16;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setFormAttachments((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f
          )
        );
      } else {
        setFormAttachments((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: currentProgress } : f
          )
        );
      }
    }, 110);
  };

  const handleFilesSelected = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    const fileList = Array.from(newFiles);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newItems = fileList.map((file) => {
      const sizeInMB = file.size / (1024 * 1024);
      const formattedSize = sizeInMB >= 1
        ? `${sizeInMB >= 10 ? sizeInMB.toFixed(0) : sizeInMB.toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      return {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        formattedSize,
        uploadDate: dateStr,
        progress: 15,
        status: 'uploading',
      };
    });

    setFormAttachments((prev) => [...prev, ...newItems]);

    // Simulate upload progress for each file
    newItems.forEach((item) => {
      startFileUploadSimulation(item.id);
    });
  };

  const handleRetryUpload = (idToRetry) => {
    setFormAttachments((prev) =>
      prev.map((f) => (f.id === idToRetry ? { ...f, progress: 15, status: 'uploading' } : f))
    );
    startFileUploadSimulation(idToRetry);
  };

  const handleRemoveAttachment = (idToRemove) => {
    setFormAttachments((prev) => prev.filter((item) => item.id !== idToRemove));
    const fileInput = document.getElementById('permit-attachment-file');
    if (fileInput) fileInput.value = '';
  };

  const TYPE_CONFIG = {
    PERMIT: {
      label: 'Permit',
      fullLabel: language === 'id' ? 'Permit (Izin/Cuti)' : 'Permit (Leave/Permit)',
      icon: FileText,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    MANUAL_ATTENDANCE: {
      label: language === 'id' ? 'Presensi Manual' : 'Manual Clock',
      fullLabel: language === 'id' ? 'Presensi Manual (Koreksi)' : 'Manual Attendance Correction',
      icon: Clock,
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
    },
    OVERTIME: {
      label: language === 'id' ? 'Lembur' : 'Overtime',
      fullLabel: language === 'id' ? 'Lembur (Overtime)' : 'Overtime Request',
      icon: ClockCountdown,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    CHANGE_SHIFT: {
      label: language === 'id' ? 'Tukar Shift' : 'Change Shift',
      fullLabel: language === 'id' ? 'Tukar Shift (Shift Swap)' : 'Shift Swap Request',
      icon: ArrowsLeftRight,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
  };

  const filteredRequests = requests.filter((item) => {
    if (activeTab !== 'ALL' && item.type !== activeTab) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (dateFilter && !matchesRequestDate(item.dateDisplay, dateFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = getRequestDisplayTitle(item, language).toLowerCase().includes(q);
      const matchSubType = item.subType.toLowerCase().includes(q);
      const matchReason = item.reason.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      if (!matchTitle && !matchSubType && !matchReason && !matchId) return false;
    }
    return true;
  });

  const isFormValid = Boolean(
    formSubType &&
    (formType === 'PERMIT' || formTitle.trim()) &&
    formDate.trim() &&
    (formType !== 'PERMIT' || formEndDate.trim()) &&
    (formType !== 'CHANGE_SHIFT' || formSwapWith.trim()) &&
    formReason.trim() &&
    formAttachments.length > 0 &&
    formAttachments.every((f) => f.progress === 100)
  );

  const formatFormDateDisplay = (dateVal) => {
    if (!dateVal) return '';
    if (dateVal.includes('-')) {
      try {
        return new Date(`${dateVal}T00:00:00`).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return dateVal;
      }
    }
    return dateVal;
  };

  const getPermitDuration = (start, end) => {
    if (!start || !end) return '1 Hari';
    try {
      const d1 = new Date(`${start}T00:00:00`);
      const d2 = new Date(`${end}T00:00:00`);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        return language === 'id' ? `${diffDays} Hari` : `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
      }
    } catch {}
    return '1 Hari';
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsReviewSheetOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (!isFormValid) return;
    const newId = `REQ-${formType === 'PERMIT' ? 'PRM' : formType.substring(0, 3)}-2026-00${Math.floor(Math.random() * 90) + 10}`;
    const startFormatted = formatFormDateDisplay(formDate) || formDate || '02 Okt 2026';
    const endFormatted = formatFormDateDisplay(formEndDate) || formEndDate || '03 Okt 2026';
    const newEntry = {
      id: newId,
      type: formType,
      subType: formSubType,
      title: formType === 'PERMIT' ? formSubType : formTitle || `${formSubType} - Baru`,
      dateDisplay: formType === 'PERMIT' ? `${startFormatted} - ${endFormatted}` : startFormatted,
      duration: formType === 'PERMIT' ? getPermitDuration(formDate, formEndDate) : formType === 'OVERTIME' ? '2 Jam' : '1 Kali',
      submittedAt: formatRequestSubmission(language),
      status: 'PENDING',
      reason: formReason || 'Permohonan baru yang diajukan oleh karyawan.',
      approver: 'Menunggu Building Service',
      swapWith: formType === 'CHANGE_SHIFT' ? formSwapWith : undefined,
      attachmentName: formAttachments.length > 0 ? formAttachments.map((f) => f.name).join(', ') : formAttachment?.name,
      attachment: formAttachments.length > 0 ? formAttachments.map((f) => f.name).join(', ') : formAttachment?.name,
    };

    setRequests((prev) => [newEntry, ...prev]);
    setSubmittedRequest(newEntry);
    setIsReviewSheetOpen(false);
    setIsNewModalOpen(false);
    setIsPermitPageOpen(false);
    setIsSuccessSheetOpen(true);

    setFormTitle('');
    setFormReason('');
    setFormDate('');
    setFormEndDate('');
    setFormSwapWith('');
    setFormAttachment(null);
    setFormAttachments([]);
  };

  const renderRequestFormContent = (includeSubmitButton = true) => {
    const categoryOptions = getCategoryOptions(formType, language);
    const currentCategoryOption = categoryOptions.find((opt) => opt.value === formSubType) || categoryOptions[0];

    return (
      <form id="permit-request-form" onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <style>{`
          #permit-request-form input::placeholder,
          #permit-request-form textarea::placeholder {
            font-size: 14px !important;
            color: #94A3B8 !important;
            opacity: 1 !important;
            font-weight: 400 !important;
            font-family: inherit !important;
          }
          #permit-request-form input::-webkit-input-placeholder,
          #permit-request-form textarea::-webkit-input-placeholder {
            font-size: 14px !important;
            color: #94A3B8 !important;
            opacity: 1 !important;
            font-weight: 400 !important;
            font-family: inherit !important;
          }
          #permit-request-form input::-moz-placeholder,
          #permit-request-form textarea::-moz-placeholder {
            font-size: 14px !important;
            color: #94A3B8 !important;
            opacity: 1 !important;
            font-weight: 400 !important;
            font-family: inherit !important;
          }
          #permit-request-form input[type="text"]:focus,
          #permit-request-form textarea:focus {
            border-color: #09B2FF !important;
            box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;
          }
        `}</style>
        {/* 2. Sub Type Selector (Bottom Sheet Modal Selector) */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
            {language === 'id' ? 'Kategori Izin' : 'Permit Category'}
            <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
          </label>

          {/* Hidden form input to preserve form serialization / validation */}
          <input type="hidden" name="formSubType" value={formSubType} />

          <button
            type="button"
            onClick={() => setIsCategorySheetOpen(!isCategorySheetOpen)}
            style={{
              width: '100%',
              minHeight: '48px',
              padding: '11px 14px',
              borderRadius: '12px',
              border: isCategorySheetOpen ? '1.5px solid #09B2FF' : '1.5px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              boxShadow: isCategorySheetOpen ? '0 0 0 3px rgba(9, 178, 255, 0.16)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              cursor: 'pointer',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#94A3B8';
            }}
            onMouseLeave={(e) => {
              if (!isCategorySheetOpen) e.currentTarget.style.borderColor = '#CBD5E1';
            }}
          >
            {/* Selected title / placeholder */}
            <span
              style={{
                fontSize: '14px',
                fontWeight: currentCategoryOption ? 500 : 400,
                color: currentCategoryOption ? '#334155' : '#94A3B8',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentCategoryOption?.title || formSubType || (language === 'id' ? 'Pilih jenis izin' : 'Choose type')}
            </span>

            {/* Right side: Secondary Quota Badge + Caret Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {currentCategoryOption?.badge && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748B',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    lineHeight: 1.2,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {currentCategoryOption.badge}
                </span>
              )}
              <span style={{ color: '#64748B', display: 'flex', alignItems: 'center' }}>
                {isCategorySheetOpen ? (
                  <CaretUp size={18} weight="bold" />
                ) : (
                  <CaretDown size={18} weight="bold" />
                )}
              </span>
            </div>
          </button>

          {/* Bottom Sheet Modal Selector */}
          {isCategorySheetOpen && createPortal(
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsCategorySheetOpen(false);
              }}
              style={{
                position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'flex-end',
                backdropFilter: 'blur(3px)',
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                style={{
                  width: '100%',
                  maxHeight: '85%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px 24px 0 0',
                  padding: '16px 20px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxSizing: 'border-box',
                  overflowY: 'auto',
                  animation: 'bottomSheetSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
                }}
              >
                {/* Drag Handle */}
                <div
                  style={{
                    width: '48px',
                    height: '5px',
                    borderRadius: '999px',
                    backgroundColor: '#E2E8F0',
                    alignSelf: 'center',
                    flexShrink: 0,
                  }}
                />

                {/* Sheet Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#334155' }}>
                      {language === 'id' ? 'Pilih Kategori Izin' : 'Select Permit Category'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                      {language === 'id'
                        ? 'Tentukan jenis kategori yang sesuai dengan kebutuhan Anda'
                        : 'Choose the category that matches your leave or request'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCategorySheetOpen(false)}
                    aria-label={language === 'id' ? 'Tutup pilihan kategori' : 'Close category selector'}
                    style={{
                      width: '32px',
                      height: '32px',
                      flexShrink: 0,
                      padding: 0,
                      border: 'none',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      color: '#64748B',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>

                {/* Category Options Cards List (No icons, consistent secondary quota badges) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoryOptions.map((opt) => {
                    const isSelected = formSubType === opt.value || formSubType === opt.title;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFormSubType(opt.value);
                          setIsCategorySheetOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          padding: '14px 16px',
                          border: isSelected ? '1.5px solid #053079' : '1px solid #E2E8F0',
                          borderRadius: '12px',
                          backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                          color: '#334155',
                          fontFamily: 'inherit',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(5, 48, 121, 0.08)' : 'none',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Option Title (No Icon) */}
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#053079' : '#334155',
                          }}
                        >
                          {opt.title}
                        </span>

                        {/* Right: Secondary Quota Badge + Selection Checkmark Circle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: 'auto' }}>
                          {opt.badge && (
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#64748B',
                                backgroundColor: '#F1F5F9',
                                border: '1px solid #E2E8F0',
                                borderRadius: '6px',
                                padding: '3px 8px',
                                lineHeight: 1.2,
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                            >
                              {opt.badge}
                            </span>
                          )}

                          {/* Checkmark Circle Indicator */}
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: isSelected ? 'none' : '2px solid #CBD5E1',
                              backgroundColor: isSelected ? '#053079' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && <Check size={12} weight="bold" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>,
            document.getElementById('phone-screen-container') || document.body
          )}
        </div>

                {/* 3. Judul / Ringkasan */}
                {formType !== 'PERMIT' && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {language === 'id' ? 'Judul Permohonan' : 'Request Title'}
                    <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={
                      language === 'id'
                        ? 'Contoh: Izin Cuti Tahunan 3 Hari'
                        : 'e.g., 3 Days Annual Leave Request'
                    }
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#334155',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                )}

                {/* 4. Tanggal & Waktu */}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        {formType === 'PERMIT'
                          ? (language === 'id' ? 'Tanggal Mulai' : 'Start Date')
                          : (language === 'id' ? 'Tanggal Pelaksanaan' : 'Date')}
                        <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveDatePicker(activeDatePicker === 'start' ? null : 'start')}
                        style={{
                          position: 'relative',
                          width: '100%',
                          minHeight: '44px',
                          border: `1px solid ${activeDatePicker === 'start' ? '#09B2FF' : '#CBD5E1'}`,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: activeDatePicker === 'start' ? '0 0 0 3px rgba(9, 178, 255, 0.16)' : 'none',
                          padding: '0 12px',
                          backgroundColor: '#FFFFFF',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            color: formDate ? '#334155' : '#94A3B8',
                            fontWeight: formDate ? 500 : 400,
                            fontFamily: 'inherit',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            userSelect: 'none',
                          }}
                        >
                          {formDate ? formatFormDateDisplay(formDate) : (language === 'id' ? 'Pilih tanggal' : 'Choose date')}
                        </span>
                        <CalendarBlank size={18} weight="bold" color="#64748B" style={{ flexShrink: 0, marginLeft: '8px' }} />
                      </button>
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        {formType === 'PERMIT'
                          ? (language === 'id' ? 'Tanggal Selesai' : 'End Date')
                          : formType === 'OVERTIME'
                          ? (language === 'id' ? 'Durasi Jam' : 'Hours')
                          : (language === 'id' ? 'Jam Presensi' : 'Time')}
                        <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                      </label>
                      {formType === 'PERMIT' ? (
                        <button
                          type="button"
                          onClick={() => setActiveDatePicker(activeDatePicker === 'end' ? null : 'end')}
                          style={{
                            position: 'relative',
                            width: '100%',
                            minHeight: '44px',
                            border: `1px solid ${activeDatePicker === 'end' ? '#09B2FF' : '#CBD5E1'}`,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: activeDatePicker === 'end' ? '0 0 0 3px rgba(9, 178, 255, 0.16)' : 'none',
                            padding: '0 12px',
                            backgroundColor: '#FFFFFF',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'inherit',
                            transition: 'border-color 0.2s',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '14px',
                              color: formEndDate ? '#334155' : '#94A3B8',
                              fontWeight: formEndDate ? 500 : 400,
                              fontFamily: 'inherit',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              userSelect: 'none',
                            }}
                          >
                            {formEndDate ? formatFormDateDisplay(formEndDate) : (language === 'id' ? 'Pilih tanggal' : 'Choose date')}
                          </span>
                          <CalendarBlank size={18} weight="bold" color="#64748B" style={{ flexShrink: 0, marginLeft: '8px' }} />
                        </button>
                      ) : (
                      <div style={{ position: 'relative', width: '100%' }}>
                        <input
                          type="text"
                          required
                          value={formType === 'OVERTIME' ? formTime : formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          placeholder={
                            formType === 'OVERTIME'
                              ? (language === 'id' ? 'Contoh: 2.5 Jam (17:00 - 19:30)' : 'e.g., 2.5 Hours (17:00 - 19:30)')
                              : (language === 'id' ? 'Contoh: 08:00' : 'e.g., 08:00')
                          }
                          style={{
                            width: '100%',
                            padding: '11px 36px 11px 12px',
                            borderRadius: '10px',
                            border: '1px solid #CBD5E1',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#334155',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B',
                          }}
                        >
                          <Clock size={18} weight="bold" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Date Picker Popover positioned right underneath Start/End Date */}
                <CustomDatePickerPopover
                  isOpen={Boolean(activeDatePicker)}
                  align={activeDatePicker === 'end' ? 'right' : 'left'}
                  value={activeDatePicker === 'start' ? formDate : formEndDate}
                  minDate={activeDatePicker === 'end' ? formDate : undefined}
                  language={language}
                  onSelect={(selectedDateStr) => {
                    if (activeDatePicker === 'start') {
                      setFormDate(selectedDateStr);
                      if (formEndDate && formEndDate < selectedDateStr) {
                        setFormEndDate(selectedDateStr);
                      }
                    } else if (activeDatePicker === 'end') {
                      setFormEndDate(selectedDateStr);
                    }
                    setActiveDatePicker(null);
                  }}
                  onClose={() => setActiveDatePicker(null)}
                />
              </div>

                {/* 5. Khusus Tukar Shift: Pilih Rekan Kerja */}
                {formType === 'CHANGE_SHIFT' && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {language === 'id' ? 'Karyawan yang Diajak Tukar' : 'Employee to Swap With'}
                      <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formSwapWith}
                      onChange={(e) => setFormSwapWith(e.target.value)}
                      placeholder={language === 'id' ? 'Contoh: Dimas Prasetyo (Teknisi Listrik)' : 'e.g., Dimas Prasetyo (Electrician)'}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#334155',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                )}

                {/* 6. Alasan / Deskripsi */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {language === 'id' ? 'Alasan Lengkap' : 'Detailed Reason'}
                    <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder={
                      language === 'id'
                        ? 'Contoh: Keperluan keluarga mendesak di luar kota...'
                        : 'e.g., Urgent family matter out of town...'
                    }
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#334155',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>

                {/* 7. Upload Lampiran (Multiple Upload & Progress) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label htmlFor="permit-attachment-file" style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: 0 }}>
                      Attachment File
                      <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                    </label>
                    {formAttachments.length > 0 && (
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#053079' }}>
                        {formAttachments.length} {language === 'id' ? 'File Terpilih' : 'Files Selected'}
                      </span>
                    )}
                  </div>

                  <input
                    id="permit-attachment-file"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesSelected(e.target.files);
                      }
                    }}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                  />

                  {/* Dropzone Card */}
                  <label
                    htmlFor="permit-attachment-file"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                        handleFilesSelected(e.dataTransfer.files);
                      }
                    }}
                    style={{
                      border: `1.5px dashed ${isDragging ? '#09B2FF' : '#CBD5E1'}`,
                      borderRadius: '16px',
                      padding: '24px 20px',
                      textAlign: 'center',
                      backgroundColor: isDragging ? '#F0F9FF' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      boxSizing: 'border-box',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDragging) {
                        e.currentTarget.style.borderColor = '#09B2FF';
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDragging) {
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#EAF7FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#09B2FF',
                        marginBottom: '4px',
                      }}
                    >
                      <UploadSimple size={22} weight="bold" />
                    </div>

                    <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <span>Drag and Drop or</span>
                      <span style={{ color: '#09B2FF', fontWeight: 700 }}>Browse to Upload</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 400, marginTop: '2px', textAlign: 'center', lineHeight: 1.4 }}>
                      <div>
                        {language === 'id'
                          ? 'Format didukung: PDF, JPG, PNG, DOC'
                          : 'Supported formats: PDF, JPG, PNG, DOC'}
                      </div>
                      <div>
                        {language === 'id' ? '(maks 10 MB)' : '(max 10MB)'}
                      </div>
                    </div>
                  </label>

                  {/* Upload Progress & Attached Files List Below */}
                  {formAttachments.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                      {formAttachments.map((item) => {
                        const isUploading = item.status === 'uploading';
                        const isFailed = item.status === 'failed';
                        const iconInfo = getFileIconInfo(item.name);
                        const IconComponent = iconInfo.Icon;

                        return (
                          <div
                            key={item.id}
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {/* File Type Icon Badge */}
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                backgroundColor: iconInfo.bgColor,
                                border: `1px solid ${iconInfo.borderColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: iconInfo.color,
                                flexShrink: 0,
                              }}
                            >
                              <IconComponent size={22} weight="bold" />
                            </div>

                            {/* File Details */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span
                                style={{
                                  fontSize: '13.5px',
                                  fontWeight: 600,
                                  color: '#334155',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  display: 'block',
                                }}
                                title={item.name}
                              >
                                {item.name}
                              </span>

                              {/* Row 2: Date & Size */}
                              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px' }}>
                                Date: {item.uploadDate || '2026-10-02'} &nbsp; Size: {item.formattedSize}
                              </div>

                              {/* Progress Bar (only while uploading) */}
                              {isUploading && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      height: '6px',
                                      backgroundColor: '#E5E7EB',
                                      borderRadius: '9999px',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${item.progress}%`,
                                        height: '100%',
                                        backgroundColor: '#09B2FF',
                                        borderRadius: '9999px',
                                        transition: 'width 0.2s ease-out',
                                      }}
                                    />
                                  </div>
                                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, minWidth: '32px', textAlign: 'right' }}>
                                    {item.progress}%
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Button: Centered Vertically on Right */}
                            <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', gap: '6px', flexShrink: 0 }}>
                              {isFailed && (
                                <button
                                  type="button"
                                  onClick={() => handleRetryUpload(item.id)}
                                  aria-label={language === 'id' ? 'Unggah ulang' : 'Retry upload'}
                                  title={language === 'id' ? 'Unggah ulang' : 'Retry'}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '6px',
                                    cursor: 'pointer',
                                    color: '#9CA3AF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '6px',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#09B2FF'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
                                >
                                  <ArrowClockwise size={18} weight="bold" />
                                </button>
                              )}

                              {isUploading ? (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAttachment(item.id)}
                                  aria-label={language === 'id' ? 'Batal' : 'Cancel'}
                                  title={language === 'id' ? 'Batal' : 'Cancel'}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '6px',
                                    cursor: 'pointer',
                                    color: '#9CA3AF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '6px',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#EF4444';
                                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#9CA3AF';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <X size={18} weight="bold" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAttachment(item.id)}
                                  aria-label={language === 'id' ? 'Hapus file' : 'Delete file'}
                                  title={language === 'id' ? 'Hapus file' : 'Delete'}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '6px',
                                    cursor: 'pointer',
                                    color: '#EF4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '6px',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#DC2626';
                                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#EF4444';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Trash size={18} weight="regular" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submit button (if rendered inline) */}
                {includeSubmitButton && (
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      backgroundColor: isFormValid ? '#053079' : '#E2E8F0',
                      color: isFormValid ? '#FFFFFF' : '#94A3B8',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      cursor: isFormValid ? 'pointer' : 'not-allowed',
                      marginTop: '8px',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {language === 'id' ? 'Kirim Permohonan Sekarang' : 'Submit Request Now'}
                  </button>
                )}
              </form>
    );
  };

  const renderReviewSheet = () => {
    if (!isReviewSheetOpen) return null;

    const startFormatted = formatFormDateDisplay(formDate) || formDate || '-';
    const endFormatted = formatFormDateDisplay(formEndDate) || formEndDate || '-';
    const dateDisplay = formType === 'PERMIT'
      ? `${startFormatted} - ${endFormatted}`
      : startFormatted;
    const durationDisplay = formType === 'PERMIT'
      ? getPermitDuration(formDate, formEndDate)
      : formType === 'OVERTIME' ? '2 Jam' : '1 Kali';

    const typeConfig = TYPE_CONFIG[formType] || TYPE_CONFIG.PERMIT;
    const TypeIcon = typeConfig.icon || FileText;
    const selectedCategoryLabel = getCategoryOptions(formType, language)
      .find((option) => option.value === formSubType)?.title || formSubType;

    const attachedFilesText = formAttachments.length > 0
      ? formAttachments.map((f) => f.name).join(', ')
      : formAttachment?.name || null;

    return createPortal(
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsReviewSheetOpen(false);
        }}
        style={{
          position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(3px)',
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-sheet-title"
          style={{
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '16px 20px 24px',
            maxHeight: '88%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Handle Bar */}
          <div
            aria-hidden="true"
            style={{
              width: '48px',
              height: '4px',
              borderRadius: '999px',
              backgroundColor: '#E2E8F0',
              alignSelf: 'center',
              flexShrink: 0,
            }}
          />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <h3
                id="review-sheet-title"
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#334155',
                  letterSpacing: '-0.01em',
                }}
              >
                {language === 'id' ? 'Review Permohonan Izin' : 'Review Permit Request'}
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                {language === 'id'
                  ? 'Pastikan data pengajuan izin Anda sudah benar.'
                  : 'Please review your request details before submitting.'}
              </p>
            </div>
            <button
              type="button"
              aria-label={language === 'id' ? 'Tutup review' : 'Close review'}
              onClick={() => setIsReviewSheetOpen(false)}
              style={{
                border: 'none',
                background: '#F1F5F9',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
                flexShrink: 0,
              }}
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Review Details Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Category / Type Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EAF7FF',
                  border: '1px solid #BAE6FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#09B2FF',
                  flexShrink: 0,
                }}
              >
                <TypeIcon size={20} weight="fill" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 500, color: '#09B2FF', marginBottom: '3px' }}>
                  {formType === 'PERMIT' ? 'Permit Permission' : typeConfig.label}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                  {selectedCategoryLabel}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1.5px dashed #CBD5E1', margin: '2px 0' }} />

            {/* Title */}
            {formType !== 'PERMIT' && (
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                {language === 'id' ? 'Judul Permohonan' : 'Request Title'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
                {formTitle || `${formSubType} - Baru`}
              </div>
            </div>
            )}

            {/* Date & Duration */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                {language === 'id' ? 'Waktu Pelaksanaan & Durasi' : 'Scheduled Date & Duration'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '3px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  <CalendarCheck size={16} color="#09B2FF" />
                  {dateDisplay}
                </span>
                <span style={{ backgroundColor: '#E2E8F0', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                  {durationDisplay}
                </span>
              </div>
            </div>

            {/* Swap Shift info if CHANGE_SHIFT */}
            {formType === 'CHANGE_SHIFT' && formSwapWith && (
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                  {language === 'id' ? 'Tukar Shift Dengan' : 'Swap Shift With'}
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                  {formSwapWith}
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                {language === 'id' ? 'Alasan / Keterangan' : 'Reason / Notes'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#1E293B', marginTop: '3px', lineHeight: 1.45, fontWeight: 500 }}>
                {formReason || '-'}
              </div>
            </div>

            {/* Attachment */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                {language === 'id' ? 'Lampiran Dokumen' : 'Attachment'}
              </div>
              <div style={{ marginTop: '4px' }}>
                {attachedFilesText ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 10px',
                      backgroundColor: '#EAF7FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#02388A',
                    }}
                  >
                    <Paperclip size={14} />
                    <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachedFilesText}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                    {language === 'id' ? 'Tidak ada dokumen dilampirkan' : 'No document attached'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Left (Edit Request) and Right (Confirm) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setIsReviewSheetOpen(false)}
              style={{
                width: '100%',
                minHeight: '48px',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              Edit Request
            </button>

            <button
              type="button"
              onClick={handleConfirmSubmit}
              style={{
                width: '100%',
                minHeight: '48px',
                backgroundColor: '#053079',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: 'none',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Check size={18} weight="bold" />
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>,
      document.getElementById('phone-screen-container') || document.body
    );
  };

  if (selectedDetail) {
    return (
      <RequestPermissionDetailView
        request={selectedDetail}
        user={user}
        language={language}
        onBack={() => setSelectedDetail(null)}
        onCancelRequest={(id) => {
          setRequests((prev) => prev.filter((r) => r.id !== id));
          setSelectedDetail(null);
        }}
        onReapply={() => {
          setSelectedDetail(null);
          setIsPermitPageOpen(true);
        }}
      />
    );
  }

  if (isPermitPageOpen) {
    return (
      <>
        <PermitPermissionView
          language={language}
          onBack={() => setIsPermitPageOpen(false)}
          footer={
            <button
              type="submit"
              form="permit-request-form"
              disabled={!isFormValid}
              style={{
                width: '100%',
                minHeight: '48px',
                backgroundColor: isFormValid ? '#053079' : '#E2E8F0',
                color: isFormValid ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {language === 'id' ? 'Kirim Permohonan Sekarang' : 'Submit Request Now'}
            </button>
          }
        >
          {renderRequestFormContent(false)}
        </PermitPermissionView>
        {renderReviewSheet()}
      </>
    );
  }

  if (isManualAttendancePageOpen) {
    return (
      <ManualAttendanceView
        language={language}
        onBack={() => setIsManualAttendancePageOpen(false)}
        onSubmit={(manualData) => {
          const newId = `REQ-MAT-2026-00${Math.floor(Math.random() * 90) + 10}`;
          const isCheckInOnly = manualData.requestedCheckIn && !manualData.requestedCheckOut;
          const isCheckOutOnly = !manualData.requestedCheckIn && manualData.requestedCheckOut;
          const manualTitle = isCheckInOnly
            ? 'Manual Clock In'
            : isCheckOutOnly
            ? 'Manual Clock Out'
            : 'Manual Clock In & Out';
          const subTypeLabel = isCheckInOnly
            ? (language === 'id' ? 'Lupa Clock In' : 'Missed Clock In')
            : isCheckOutOnly
            ? (language === 'id' ? 'Lupa Clock Out' : 'Missed Clock Out')
            : (language === 'id' ? 'Koreksi Presensi Lengkap' : 'Full Attendance Correction');

          const durationText = manualData.requestedCheckIn && manualData.requestedCheckOut
            ? `${manualData.checkIn} - ${manualData.checkOut}`
            : manualData.requestedCheckIn
            ? `Clock In: ${manualData.checkIn}`
            : `Clock Out: ${manualData.checkOut}`;

          const newEntry = {
            id: newId,
            type: 'MANUAL_ATTENDANCE',
            subType: subTypeLabel,
            title: manualTitle,
            shift: manualData.shift,
            dateDisplay: `${manualData.formattedDate}${manualData.checkIn ? ` • In: ${manualData.checkIn}` : ''}${manualData.checkOut ? ` • Out: ${manualData.checkOut}` : ''}`,
            duration: durationText,
            submittedAt: formatRequestSubmission(language),
            status: 'PENDING',
            reason: manualData.notes || (language === 'id' ? 'Pengajuan presensi manual untuk tanggal terkait.' : 'Manual attendance request for the specified date.'),
            approver: 'Menunggu Building Service',
            scheduleDate: manualData.scheduleDate,
            formattedDate: manualData.formattedDate,
            checkIn: manualData.checkIn,
            checkOut: manualData.checkOut,
            attachment: null,
          };

          setRequests((prev) => [newEntry, ...prev]);
          setSubmittedRequest(newEntry);
          setIsManualAttendancePageOpen(false);
          setIsSuccessSheetOpen(true);
        }}
      />
    );
  }

  if (isChangeShiftPageOpen) {
    return (
      <ChangeShiftView
        language={language}
        onBack={() => setIsChangeShiftPageOpen(false)}
        onSubmit={(shiftData) => {
          const newId = `REQ-CSH-2026-00${Math.floor(Math.random() * 90) + 10}`;
          const isSwap = shiftData.mode === 'CHANGE_SHIFT_SWAP';
          const isTransfer = shiftData.mode === 'CHANGE_SHIFT_TRANSFER';
          const subTypeLabel = isTransfer
            ? (language === 'id' ? 'Transfer Shift' : 'Shift Transfer')
            : isSwap
            ? (language === 'id' ? 'Tukar Shift' : 'Shift Swap')
            : (language === 'id' ? 'Ganti Shift' : 'Shift Change');

          const newEntry = {
            id: newId,
            type: 'CHANGE_SHIFT',
            subType: subTypeLabel,
            title: isTransfer ? 'Shift Transfer' : isSwap ? 'Shift Swap' : 'Shift Change',
            shift: shiftData.fromShift,
            fromShift: shiftData.fromShift,
            toShift: shiftData.toShift,
            swapWith: (isSwap || isTransfer) ? shiftData.partnerName : null,
            partnerShift: shiftData.partnerShift,
            dateDisplay: shiftData.formattedDate,
            scheduleDate: shiftData.scheduleDate,
            duration: '1 Shift',
            submittedAt: formatRequestSubmission(language),
            status: 'PENDING',
            reason: shiftData.notes,
            approver: 'Menunggu Building Service',
            attachment: null,
          };

          setRequests((prev) => [newEntry, ...prev]);
          setSubmittedRequest(newEntry);
          setIsChangeShiftPageOpen(false);
          setIsSuccessSheetOpen(true);
        }}
      />
    );
  }

  if (isOvertimePageOpen) {
    return (
      <OvertimeView
        language={language}
        onBack={() => setIsOvertimePageOpen(false)}
        onSubmit={(overtimeData) => {
          const newId = `REQ-OVT-2026-00${Math.floor(Math.random() * 90) + 10}`;
          const isBKO = overtimeData.mode === 'OVERTIME_BKO';
          const subTypeLabel = isBKO ? 'BKO Overtime' : 'Staff Overtime';

          const newEntry = {
            id: newId,
            type: 'OVERTIME',
            subType: subTypeLabel,
            title: isBKO ? 'BKO Overtime' : 'Staff Overtime',
            scheduleDate: overtimeData.scheduleDate,
            dateDisplay: isBKO
              ? overtimeData.formattedDate
              : `${overtimeData.formattedDate} • ${overtimeData.startTime} - ${overtimeData.endTime}`,
            duration: overtimeData.duration,
            shift: overtimeData.shift,
            startTime: overtimeData.startTime,
            endTime: overtimeData.endTime,
            overtimeMode: overtimeData.mode,
            submittedAt: formatRequestSubmission(language),
            status: 'PENDING',
            reason: overtimeData.reason,
            approver: isBKO ? 'Bambang Sudirgo (Chief Engineering)' : 'Hendra Gunawan (HR Manager)',
            attachment: overtimeData.attachment,
            attachmentInfo: overtimeData.attachmentInfo,
          };

          setRequests((prev) => [newEntry, ...prev]);
          setSubmittedRequest(newEntry);
          setIsOvertimePageOpen(false);
          setIsSuccessSheetOpen(true);
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#FFFFFF',
        color: '#334155',
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontSize: REQUEST_FONT.body,
      }}
    >
      {/* Top Header Bar with Integrated Search & Filter */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF',
          padding: '12px 16px 14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        {/* Row 1: Back Button & Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            minHeight: '36px',
          }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#334155',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          <h1
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: REQUEST_FONT.heading,
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.01em',
              width: 'calc(100% - 72px)',
              lineHeight: 1.2,
              textAlign: 'center',
            }}
          >
            {language === 'id' ? 'Request Permission' : 'Request Permission'}
          </h1>

          <div style={{ width: '36px' }} />
        </div>

        {/* Row 2: Search Input & Filter Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              height: '44px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              gap: '8px',
              boxSizing: 'border-box',
            }}
          >
            <MagnifyingGlass size={18} weight="bold" color="#64748B" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari ID, jenis, atau alasan...' : 'Find request number, type, reason...'}
              style={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                border: 'none',
                padding: 0,
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: REQUEST_FONT.body,
                color: '#334155',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>

          {/* Filter Button (Square Rounded with FunnelSimple) */}
          <button
            type="button"
            onClick={() => {
              setTempActiveTab(activeTab);
              setTempStatusFilter(statusFilter);
              setTempDateFilter(dateFilter);
              setIsFilterModalOpen(true);
            }}
            aria-label="Filter"
            aria-haspopup="dialog"
            aria-expanded={isFilterModalOpen}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: hasActiveFilter ? '#053079' : '#FFFFFF',
              border: hasActiveFilter ? '1px solid #053079' : '1px solid #E2E8F0',
              color: hasActiveFilter ? '#FFFFFF' : '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
              boxShadow: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            {hasActiveFilter && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9999px',
                  backgroundColor: '#09B2FF',
                  color: '#FFFFFF',
                  fontSize: REQUEST_FONT.caption,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: '2px solid #FFFFFF',
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

      </header>

      <section aria-labelledby="permit-quota-title" style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ marginBottom: '10px' }}>
          <h2 id="permit-quota-title" style={{ margin: '0 0 3px', fontSize: REQUEST_FONT.body, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarCheck size={20} weight="fill" color="#09B2FF" aria-hidden="true" />
            {language === 'id' ? 'Total Kuota' : 'Total Quota'}
          </h2>
          <p style={{ margin: 0, fontSize: REQUEST_FONT.caption, color: '#64748B', lineHeight: 1.4 }}>
            {language === 'id' ? 'Periode' : 'Period'}{' '}
            {[PERMIT_QUOTA.periodStart, PERMIT_QUOTA.periodEnd].map((date) => new Date(`${date}T00:00:00`).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })).join(' – ')}
          </p>
        </div>
        <div role="region" aria-label={language === 'id' ? 'Kuota permit, geser ke samping' : 'Permit quotas, scroll horizontally'} tabIndex={0} style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollSnapType: 'x proximity', WebkitOverflowScrolling: 'touch' }}>
          {PERMIT_QUOTA.items.map((item) => (
            <article key={item.id} style={{ flex: '0 0 calc((100% - 8px) / 2)', minWidth: 0, boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF', scrollSnapAlign: 'start', overflowWrap: 'break-word' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: REQUEST_FONT.body, fontWeight: 600, lineHeight: 1.4, color: '#334155' }}>{item.name[language] || item.name.en}</h3>
              <p style={{ margin: '0 0 4px', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', color: '#09B2FF' }}>
                <strong style={{ fontSize: REQUEST_FONT.heading, lineHeight: 1, fontWeight: 700 }}>{item.quota}</strong>
                <span style={{ fontSize: REQUEST_FONT.caption, fontWeight: 500 }}>{language === 'id' ? 'hari kuota' : 'days quota'}</span>
              </p>
              <p style={{ margin: 0, fontSize: REQUEST_FONT.caption, color: '#64748B', lineHeight: 1.4 }}>
                {item.used} {language === 'id' ? 'hari digunakan' : `${item.used === 1 ? 'day' : 'days'} used`}
              </p>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .permission-request-card:focus-visible {
          outline: 2px solid #053079;
          outline-offset: 3px;
        }
      `}</style>
      <h2 style={{ margin: 0, padding: '16px 16px 0', backgroundColor: '#F1F5F9', fontSize: REQUEST_FONT.body, fontWeight: 700, color: '#334155' }}>
        {language === 'id' ? 'Riwayat Perizinan' : 'History Permission'}
      </h2>
      {/* Requests Cards List */}
      <div
        style={{
          padding: filteredRequests.length === 0 ? '24px 16px' : '14px 16px 80px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: filteredRequests.length === 0 ? 'center' : 'flex-start',
          gap: '12px',
          flex: 1,
          backgroundColor: '#F1F5F9',
        }}
      >
        {filteredRequests.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <img
              src={noPermissionRequests}
              alt=""
              width={1536}
              height={1024}
              style={{
                display: 'block',
                width: '90%',
                height: 'auto',
                borderRadius: '16px',
                margin: '0 auto 16px',
              }}
            />
            <h4 style={{ fontSize: REQUEST_FONT.body, fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
              {language === 'id' ? 'Tidak Ada Permohonan' : 'No Requests Found'}
            </h4>
            <p style={{ fontSize: REQUEST_FONT.caption, color: '#64748B', margin: 0 }}>
              {language === 'id'
                ? 'Belum ada data permohonan yang sesuai dengan filter ini.'
                : 'No permission requests match your current filter.'}
            </p>
          </div>
        ) : (
          filteredRequests.map((item) => {
            const displayTitle = getRequestDisplayTitle(item, language);
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.PERMIT;
            const IconComponent = config.icon;
            const isApproved = item.status === 'APPROVED';
            const isPending = item.status === 'PENDING';
            const isShiftSwap = item.type === 'CHANGE_SHIFT' && Boolean(item.swapWith);
            const isShiftRequest = item.type === 'CHANGE_SHIFT' && Boolean(item.toShift);
            const requestType = REQUEST_TYPE_OPTIONS.find((option) => option.id === item.type)?.label || 'Permit Permission';

            return (
              <article
                key={item.id}
                className="permission-request-card"
                role="button"
                tabIndex={0}
                aria-label={`View details: ${displayTitle}`}
                onClick={() => setSelectedDetail(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedDetail(item);
                  }
                }}
                style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '8px', backgroundColor: '#EAF7FF', border: '1px solid #BAE6FD', color: '#09B2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={21} weight="fill" color="#09B2FF" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: REQUEST_FONT.body, lineHeight: 1.35, fontWeight: 700, color: '#334155' }}>{requestType}</h3>
                    <p style={{ margin: 0, fontSize: REQUEST_FONT.caption, color: '#64748B', lineHeight: 1.4 }}>
                      Created: {item.submittedAt.split(' • ')[0]}
                    </p>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0, padding: '5px 9px', borderRadius: '999px', fontSize: REQUEST_FONT.caption, fontWeight: 700, backgroundColor: isApproved ? '#16A34A' : isPending ? '#F97316' : '#DC2626', color: '#FFFFFF' }}>
                    {isApproved ? 'Approved' : isPending ? 'Waiting Approval' : 'Rejected'}
                  </span>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 5px', fontSize: REQUEST_FONT.body, fontWeight: 700, color: '#334155', lineHeight: 1.45 }}>
                    {displayTitle}
                  </h4>
                  {isShiftSwap && (
                    <p style={{ margin: '0 0 4px', fontSize: REQUEST_FONT.caption, fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>
                      Swap with {item.swapWith}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: REQUEST_FONT.caption, color: '#64748B', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.reason}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: isShiftRequest ? 'nowrap' : 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: REQUEST_FONT.caption }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: isShiftRequest ? '0 0 auto' : '1 1 160px', minWidth: 0 }}>
                    <CalendarCheck size={18} color="#09B2FF" style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: '#334155', lineHeight: 1.5, whiteSpace: isShiftRequest ? 'nowrap' : 'normal' }}>{item.dateDisplay}</span>
                  </div>
                  <span title={isShiftRequest ? item.toShift : undefined} style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '3px 7px', borderRadius: '4px', fontWeight: 600, minWidth: 0, marginLeft: isShiftRequest ? 'auto' : 0, overflow: isShiftRequest ? 'hidden' : 'visible', textOverflow: isShiftRequest ? 'ellipsis' : 'clip', whiteSpace: isShiftRequest ? 'nowrap' : 'normal' }}>
                    {isShiftRequest ? item.toShift : item.duration}
                  </span>
                </div>

              </article>
            );
          })
        )}
      </div>

      {/* =========================================================================
          FIXED BOTTOM FOOTER: + Apply Request Permission (Full Button)
          ========================================================================= */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          padding: '12px 16px 14px 16px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: 35,
        }}
      >
        <button
          type="button"
          onClick={() => setIsRequestTypeOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isRequestTypeOpen}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#053079',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: 'none',
            letterSpacing: '-0.01em',
            transition: 'transform 0.1s ease',
          }}
        >
          <Plus size={20} weight="bold" />
          <span>Apply Request Permission</span>
        </button>
      </div>

      {isRequestTypeOpen && createPortal(
        <div
          onClick={(event) => { if (event.target === event.currentTarget) setIsRequestTypeOpen(false); }}
          style={{ position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="request-type-title" onKeyDown={(event) => handleRequestSheetKeys(event, () => setIsRequestTypeOpen(false))} style={{ width: '100%', maxHeight: '90%', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'var(--font-sans)' }}>
            <div aria-hidden="true" style={{ width: '60px', height: '5px', borderRadius: '999px', backgroundColor: '#F1F5F9', alignSelf: 'center', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h3 id="request-type-title" style={{ margin: '0 0 5px', fontSize: REQUEST_FONT.heading, fontWeight: 700, color: '#334155' }}>{language === 'id' ? 'Pilih Jenis Request' : 'Select Request Type'}</h3>
                <p style={{ margin: 0, fontSize: REQUEST_FONT.caption, lineHeight: 1.5, color: '#64748B' }}>{language === 'id' ? 'Request apa yang ingin kamu ajukan?' : 'What would you like to request?'}</p>
              </div>
              <button type="button" aria-label={language === 'id' ? 'Tutup pilihan request' : 'Close request types'} onClick={() => setIsRequestTypeOpen(false)} style={{ width: '32px', height: '32px', flexShrink: 0, padding: 0, border: 'none', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {REQUEST_TYPE_OPTIONS.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button key={option.id} type="button" autoFocus={index === 0} onClick={() => {
                    setFormType(option.id);
                    setFormSubType(option.defaultSubType);
                    setIsRequestTypeOpen(false);
                    if (option.id === 'PERMIT') {
                      setIsNewModalOpen(false);
                      setIsPermitPageOpen(true);
                    } else if (option.id === 'MANUAL_ATTENDANCE') {
                      setIsNewModalOpen(false);
                      setIsManualAttendancePageOpen(true);
                    } else if (option.id === 'CHANGE_SHIFT') {
                      setIsNewModalOpen(false);
                      setIsChangeShiftPageOpen(true);
                    } else if (option.id === 'OVERTIME') {
                      setIsNewModalOpen(false);
                      setIsOvertimePageOpen(true);
                    } else {
                      setIsNewModalOpen(true);
                    }
                  }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', border: '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: '#FFFFFF', color: '#334155', fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', boxShadow: 'none' }}>
                    <span style={{ width: '38px', height: '38px', flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '10px', backgroundColor: '#EAF7FF', color: '#09B2FF' }}><Icon size={22} weight="fill" /></span>
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: REQUEST_FONT.body, fontWeight: 600 }}>{option.label}</span>
                      <span style={{ fontSize: REQUEST_FONT.caption, fontWeight: 400, lineHeight: 1.5, color: '#64748B' }}>{option.description[language] || option.description.en}</span>
                    </span>
                    <CaretRight size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}

      {renderReviewSheet()}

      {/* =========================================================================
          BOTTOM SHEET: SUCCESS SUBMISSION
          ========================================================================= */}
      {isSuccessSheetOpen && submittedRequest && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSuccessSheetOpen(false);
          }}
          style={{
            position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-sheet-title"
            style={{
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '16px 20px 24px',
              maxHeight: '90%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Handle Bar */}
            <div
              aria-hidden="true"
              style={{
                width: '48px',
                height: '4px',
                borderRadius: '999px',
                backgroundColor: '#E2E8F0',
                alignSelf: 'center',
                flexShrink: 0,
              }}
            />

            {/* 3D Success Illustration (Mentok ke padding container) */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '4px 0 2px 0' }}>
              <img
                src={successCheck}
                alt="Success"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Header Content */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <h3
                id="success-sheet-title"
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#334155',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {language === 'id' ? 'Permohonan Berhasil Dikirim!' : 'Request Successfully Submitted!'}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748B',
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: '320px',
                }}
              >
                {language === 'id'
                  ? 'Pengajuan izin Anda telah tercatat dan sedang menunggu peninjauan.'
                  : 'Your request has been successfully recorded and is awaiting review.'}
              </p>
            </div>

            {/* Actions: View Detail & Close */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsSuccessSheetOpen(false);
                  setSelectedDetail(submittedRequest);
                }}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  backgroundColor: '#053079',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <FileText size={18} weight="bold" />
                <span>{language === 'id' ? 'Lihat Detail Permohonan' : 'View Detail Request'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSuccessSheetOpen(false)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {language === 'id' ? 'Kembali ke Daftar Permohonan' : 'Back to Request List'}
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}

      {/* =========================================================================
          MODAL: AJUKAN PERMOHONAN BARU (NEW REQUEST)
          ========================================================================= */}
      {isNewModalOpen && createPortal(
        <div
          style={{
            position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-request-title"
            onKeyDown={(event) => handleRequestSheetKeys(event, () => setIsNewModalOpen(false))}
            style={{
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px',
              maxHeight: '90%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button type="button" autoFocus aria-label={language === 'id' ? 'Kembali ke jenis request' : 'Back to request types'} onClick={() => { setIsNewModalOpen(false); setIsRequestTypeOpen(true); }} style={{ border: 'none', background: 'transparent', padding: '4px', color: '#334155', display: 'flex', cursor: 'pointer' }}><CaretLeft size={20} weight="bold" /></button>
                <h3 id="new-request-title" style={{ fontSize: REQUEST_FONT.heading, fontWeight: 800, color: '#334155', margin: 0 }}>
                  {REQUEST_TYPE_OPTIONS.find((option) => option.id === formType)?.label}
                </h3>
              </div>
              <button
                type="button"
                aria-label={language === 'id' ? 'Tutup formulir' : 'Close request form'}
                onClick={() => setIsNewModalOpen(false)}
                style={{
                  border: 'none',
                  background: '#F1F5F9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
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

            {renderRequestFormContent(true)}
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}

      {/* =========================================================================
          FILTER MODAL (BOTTOM SHEET)
          ========================================================================= */}
      {isFilterModalOpen && createPortal(
        <div
          style={{ position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}
          onClick={(event) => { if (event.target === event.currentTarget) setIsFilterModalOpen(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-filter-title"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsFilterModalOpen(false);
              if (event.key === 'Tab') {
                const controls = event.currentTarget.querySelectorAll('button, input');
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
            style={{ width: '100%', maxHeight: '92%', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: '22px', fontFamily: 'var(--font-sans)' }}
          >
            <div aria-hidden="true" style={{ width: '60px', height: '5px', borderRadius: '999px', backgroundColor: '#F1F5F9', alignSelf: 'center', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <h3 id="request-filter-title" style={{ margin: 0, fontSize: REQUEST_FONT.heading, fontWeight: 700, color: '#334155' }}>
                {language === 'id' ? 'Filter Permohonan' : 'Filter Requests'}
              </h3>
              <button type="button" autoFocus onClick={() => { setTempStatusFilter('ALL'); setTempActiveTab('ALL'); setTempDateFilter(''); }} style={{ border: 'none', background: 'transparent', padding: '6px 0 6px 8px', fontFamily: 'inherit', fontSize: REQUEST_FONT.body, fontWeight: 500, color: '#88929D', cursor: 'pointer' }}>
                Reset
              </button>
            </div>

            {[
              {
                title: language === 'id' ? 'Status Permohonan' : 'Request Status',
                value: tempStatusFilter,
                onChange: setTempStatusFilter,
                options: [
                  { id: 'PENDING', label: 'Waiting Approval' },
                  { id: 'APPROVED', label: language === 'id' ? 'Disetujui' : 'Approved' },
                  { id: 'REJECTED', label: language === 'id' ? 'Ditolak' : 'Rejected' },
                ],
              },
              {
                title: language === 'id' ? 'Filter berdasarkan Tipe Request' : 'Filter by Request Type',
                value: tempActiveTab,
                onChange: setTempActiveTab,
                options: [
                  { id: 'PERMIT', label: language === 'id' ? 'Izin / Cuti' : 'Permit' },
                  { id: 'MANUAL_ATTENDANCE', label: language === 'id' ? 'Presensi Manual' : 'Manual Attendance' },
                  { id: 'OVERTIME', label: language === 'id' ? 'Lembur' : 'Overtime' },
                  { id: 'CHANGE_SHIFT', label: language === 'id' ? 'Tukar Shift' : 'Change Shift' },
                ],
              },
            ].map((group) => (
              <fieldset key={group.title} style={{ padding: 0, margin: 0, border: 'none', minWidth: 0 }}>
                <legend style={{ padding: 0, marginBottom: '10px', fontSize: REQUEST_FONT.body, fontWeight: 500, color: '#334155' }}>{group.title}</legend>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {group.options.map((option) => {
                    const selected = group.value === option.id;
                    return (
                      <button key={option.id} type="button" aria-pressed={selected} onClick={() => group.onChange(selected ? 'ALL' : option.id)} style={{ minHeight: '34px', padding: '6px 12px', border: `1px solid ${selected ? '#053079' : '#E2E8F0'}`, borderRadius: '10px', backgroundColor: selected ? '#EAF7FF' : '#FFFFFF', color: selected ? '#053079' : '#64748B', fontFamily: 'inherit', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="request-filter-date" style={{ fontSize: REQUEST_FONT.body, fontWeight: 500, color: '#334155' }}>{language === 'id' ? 'Tanggal' : 'Date'}</label>
              <div style={{ position: 'relative', minHeight: '44px', border: '1px solid #DDE2E7', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                <span aria-hidden="true" style={{ fontSize: REQUEST_FONT.body, color: tempDateFilter ? '#334155' : '#A8B2BD' }}>{tempDateFilter ? new Date(`${tempDateFilter}T00:00:00`).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (language === 'id' ? 'Pilih tanggal' : 'Choose date')}</span>
                <CalendarBlank aria-hidden="true" size={20} color="#88929D" style={{ marginLeft: 'auto' }} />
                <input id="request-filter-date" type="date" value={tempDateFilter} onChange={(event) => setTempDateFilter(event.target.value)} onClick={(event) => { try { event.currentTarget.showPicker?.(); } catch { /* Native input remains keyboard accessible. */ } }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', boxSizing: 'border-box', fontSize: REQUEST_FONT.body, opacity: 0, cursor: 'pointer' }} />
              </div>
            </div>

            <button type="button" onClick={() => { setStatusFilter(tempStatusFilter); setActiveTab(tempActiveTab); setDateFilter(tempDateFilter); setIsFilterModalOpen(false); }} style={{ width: '100%', minHeight: '48px', padding: '12px', border: 'none', borderRadius: '12px', backgroundColor: '#053079', color: '#FFFFFF', fontFamily: 'inherit', fontSize: REQUEST_FONT.body, fontWeight: 600, cursor: 'pointer' }}>
              Filter
            </button>
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}
    </div>
  );
};

export default RequestPermissionView;

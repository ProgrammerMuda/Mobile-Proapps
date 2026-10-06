import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CalendarBlank,
  Check,
  X,
  Clock,
  CalendarCheck,
  Briefcase,
  Wrench,
  FileText,
  FilePdf,
  FileDoc,
  FileCsv,
  FileImage,
  Eye,
  Trash,
  UploadSimple,
  ArrowClockwise,
  CaretDown,
  Calendar,
  WarningCircle,
} from '@phosphor-icons/react';
import { CustomDatePickerPopover } from '../components/common';

const SHIFT_OPTIONS = [
  'Shift Pagi (08:00 - 17:00)',
  'Shift Siang (13:00 - 21:00)',
  'Shift Malam (20:00 - 05:00)',
  'Shift Normal (08:30 - 17:30)',
  'Libur Reguler (Day Off)',
];

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

export default function OvertimeView({
  onBack,
  language = 'id',
  onSubmit,
}) {
  const pageRef = useRef(null);
  const isId = language === 'id';

  // Mode: 'OVERTIME_BKO' (BKO Overtime) vs 'OVERTIME_STAFF' (Staff Overtime)
  const [overtimeMode, setOvertimeMode] = useState('OVERTIME_BKO');

  // Form State
  const [scheduleDate, setScheduleDate] = useState('');

  // BKO Form State
  const [bkoShift, setBkoShift] = useState('');

  // Staff Overtime Form State
  const [staffShift, setStaffShift] = useState('');
  const [endTime, setEndTime] = useState('');

  // Common Form State
  const [detailedReason, setDetailedReason] = useState('');

  // Attachment State (matching Permit Permission)
  const [formAttachments, setFormAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // UI state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Scroll to top inside container
  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  // Format date display (e.g. 28 Sep 2026)
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = isId ? monthsId[monthIndex] : monthsEn[monthIndex];
        return `${day} ${m} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleDateSelect = (selectedDateStr) => {
    setScheduleDate(selectedDateStr);
    setIsDatePickerOpen(false);

    // Auto-detect shift based on day of week for Staff
    try {
      const d = new Date(selectedDateStr);
      const day = d.getDay();
      if (day === 0 || day === 6) {
        setStaffShift('Libur Reguler (Day Off)');
        setEndTime('');
      } else {
        setStaffShift('Shift Normal (08:30 - 17:30)');
      }
    } catch {
      setStaffShift('Shift Normal (08:30 - 17:30)');
    }
  };

  const handleModeChange = (mode) => {
    setOvertimeMode(mode);
  };

  // Helper to extract shift end time (used as automatic start time for staff overtime)
  const getShiftEndTime = (shiftStr) => {
    if (!shiftStr || shiftStr === 'Libur Reguler (Day Off)') return '';
    const match = shiftStr.match(/-\s*(\d{2}:\d{2})/);
    return match ? match[1] : '17:30';
  };

  const autoStartTime = getShiftEndTime(staffShift);

  // Calculate Overtime Duration for Staff
  const calculateDuration = (start, end) => {
    if (!start || !end) return { hours: 0, text: '-', badgeText: '-' };
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      return { hours: 0, text: '-', badgeText: '-' };
    }

    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60; // Cross midnight
    }

    const diffMinutes = endMinutes - startMinutes;
    if (diffMinutes <= 0) return { hours: 0, text: '0h', badgeText: '0h' };

    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;

    let text = '';
    if (hours > 0 && mins > 0) {
      text = `${hours}h ${mins}m`;
    } else if (hours > 0) {
      text = `${hours}h`;
    } else if (mins > 0) {
      text = `${mins}m`;
    } else {
      text = '0h';
    }

    return {
      diffMinutes,
      hours: diffMinutes / 60,
      text,
      badgeText: text,
    };
  };

  const durationInfo = calculateDuration(autoStartTime, endTime);

  // Time mask helper (HH:mm)
  const handleTimeInput = (setter) => (e) => {
    let val = e.target.value.replace(/[^0-9:]/g, '');
    if (val.length === 2 && !val.includes(':') && e.nativeEvent?.inputType !== 'deleteContentBackward') {
      val = val + ':';
    }
    if (val.length > 5) val = val.slice(0, 5);
    setter(val);
  };

  // Multiple File Upload Simulation (identical to Permit Permission)
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
    const fileInput = document.getElementById('overtime-attachment-file');
    if (fileInput) fileInput.value = '';
  };

  // Day off detection for staff overtime
  const isStaffDayOff = overtimeMode === 'OVERTIME_STAFF' && Boolean(scheduleDate && staffShift === 'Libur Reguler (Day Off)');

  // Form Validity
  const isFormValid = overtimeMode === 'OVERTIME_BKO'
    ? Boolean(scheduleDate && bkoShift && bkoShift !== 'Libur Reguler (Day Off)' && detailedReason.trim().length > 0)
    : Boolean(
        scheduleDate &&
        staffShift &&
        staffShift !== 'Libur Reguler (Day Off)' &&
        !isStaffDayOff &&
        endTime.length === 5 &&
        durationInfo.hours > 0 &&
        detailedReason.trim().length > 0
      );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsReviewOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsReviewOpen(false);
    if (onSubmit) {
      const primaryFile = formAttachments[0];
      onSubmit({
        mode: overtimeMode,
        scheduleDate,
        formattedDate: formatDisplayDate(scheduleDate),
        shift: overtimeMode === 'OVERTIME_BKO' ? bkoShift : staffShift,
        startTime: overtimeMode === 'OVERTIME_STAFF' ? autoStartTime : null,
        endTime: overtimeMode === 'OVERTIME_STAFF' ? endTime : null,
        duration: overtimeMode === 'OVERTIME_BKO' ? '1 Shift' : durationInfo.badgeText,
        title: overtimeMode === 'OVERTIME_BKO' ? 'BKO Overtime' : 'Staff Overtime',
        reason: detailedReason.trim(),
        attachment: formAttachments.length > 0 ? formAttachments.map((f) => f.name).join(', ') : null,
        attachmentInfo: primaryFile ? {
          name: primaryFile.name,
          type: primaryFile.name.split('.').pop().toUpperCase(),
          size: primaryFile.formattedSize,
        } : null,
        attachments: formAttachments,
      });
    }
  };

  // Reusable Attachment Section (identical to Permit Permission)
  const renderAttachmentSection = (disabled = false) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label htmlFor={disabled ? undefined : "overtime-attachment-file"} style={{ fontSize: '14px', fontWeight: 600, color: disabled ? '#94A3B8' : '#334155', margin: 0 }}>
          Attachment
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8', marginLeft: '6px' }}>
            {isId ? '(Opsional)' : '(Optional)'}
          </span>
        </label>
        {formAttachments.length > 0 && (
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#053079' }}>
            {formAttachments.length} {isId ? 'File Terpilih' : 'Files Selected'}
          </span>
        )}
      </div>

      <input
        id="overtime-attachment-file"
        type="file"
        multiple
        disabled={disabled}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={(e) => {
          if (!disabled && e.target.files && e.target.files.length > 0) {
            handleFilesSelected(e.target.files);
          }
        }}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
      />

      {/* Dropzone Card */}
      <label
        htmlFor={disabled ? undefined : "overtime-attachment-file"}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
          }
        }}
        style={{
          border: `1.5px dashed ${disabled ? '#E2E8F0' : (isDragging ? '#09B2FF' : '#CBD5E1')}`,
          borderRadius: '16px',
          padding: '24px 20px',
          textAlign: 'center',
          backgroundColor: disabled ? '#F8FAFC' : (isDragging ? '#F0F9FF' : '#FFFFFF'),
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          boxSizing: 'border-box',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isDragging) {
            e.currentTarget.style.borderColor = '#09B2FF';
            e.currentTarget.style.backgroundColor = '#F8FAFC';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isDragging) {
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
            {isId ? 'Format didukung: PDF, JPG, PNG, DOC' : 'Supported formats: PDF, JPG, PNG, DOC'}
          </div>
          <div>
            {isId ? '(maks 10 MB)' : '(max 10MB)'}
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
                    Date: {item.uploadDate || '2026-10-05'} &nbsp; Size: {item.formattedSize}
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
                      aria-label={isId ? 'Unggah ulang' : 'Retry upload'}
                      title={isId ? 'Unggah ulang' : 'Retry'}
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

                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(item.id)}
                    aria-label={isId ? 'Hapus file' : 'Delete file'}
                    title={isId ? 'Hapus file' : 'Delete'}
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
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={pageRef}
      className="overtime-page"
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'var(--font-sans)',
        fontSize: '16px',
        color: '#334155',
      }}
    >
      <style>{`
        .overtime-page input::placeholder,
        .overtime-page textarea::placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .overtime-page input:focus,
        .overtime-page select:focus,
        .overtime-page textarea:focus {
          border-color: #09B2FF !important;
          box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;
          outline: none !important;
        }
      `}</style>

      {/* =========================================================================
          STICKY HEADER APP BAR
          ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'grid',
          gridTemplateColumns: '36px minmax(0, 1fr) 36px',
          alignItems: 'center',
          gap: '8px',
          minHeight: '56px',
          padding: '0 16px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label={isId ? 'Kembali ke daftar request' : 'Back to request list'}
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '36px',
            height: '36px',
            padding: 0,
            border: 'none',
            borderRadius: '8px',
            background: 'transparent',
            color: '#334155',
            cursor: 'pointer',
          }}
        >
          <CaretLeft size={22} weight="bold" />
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 700,
            textAlign: 'center',
            color: '#334155',
          }}
        >
          Overtime
        </h1>
        <div style={{ width: '36px' }} />
      </header>

      {/* =========================================================================
          SCROLLABLE FORM CONTENT
          ========================================================================= */}
      <div style={{ flex: 1, padding: '16px 16px 32px' }}>
        {/* SEGMENTED TAB TOGGLE: BKO OVERTIME VS STAFF OVERTIME */}
        <div
          style={{
            backgroundColor: '#F1F5F9',
            padding: '4px',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => handleModeChange('OVERTIME_BKO')}
            style={{
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: overtimeMode === 'OVERTIME_BKO' ? '#FFFFFF' : 'transparent',
              color: overtimeMode === 'OVERTIME_BKO' ? '#053079' : '#64748B',
              fontSize: '13px',
              fontWeight: overtimeMode === 'OVERTIME_BKO' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: overtimeMode === 'OVERTIME_BKO' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Calendar size={16} weight={overtimeMode === 'OVERTIME_BKO' ? 'bold' : 'regular'} />
            <span>BKO Overtime</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('OVERTIME_STAFF')}
            style={{
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: overtimeMode === 'OVERTIME_STAFF' ? '#FFFFFF' : 'transparent',
              color: overtimeMode === 'OVERTIME_STAFF' ? '#053079' : '#64748B',
              fontSize: '13px',
              fontWeight: overtimeMode === 'OVERTIME_STAFF' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: overtimeMode === 'OVERTIME_STAFF' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Clock size={16} weight={overtimeMode === 'OVERTIME_STAFF' ? 'bold' : 'regular'} />
            <span>Staff Overtime</span>
          </button>
        </div>

        {/* MAIN FORM */}
        <form id="overtime-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* =========================================================================
              BKO FORM FIELDS
              1. Overtime Date*
              2. Shift*
              3. Detailed Reason*
              4. Attachment
              ========================================================================= */}
          {overtimeMode === 'OVERTIME_BKO' ? (
            <>
              {/* FIELD 1: Overtime Date* */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Overtime Date <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '10px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: scheduleDate ? '#1E293B' : '#94A3B8',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span>{scheduleDate ? formatDisplayDate(scheduleDate) : (isId ? 'Pilih tanggal lembur' : 'Select overtime date')}</span>
                    <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  </button>

                  {isDatePickerOpen && (
                    <CustomDatePickerPopover
                      isOpen={isDatePickerOpen}
                      value={scheduleDate}
                      language={language}
                      onSelect={handleDateSelect}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* FIELD 2: Shift* */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Shift <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={bkoShift}
                    onChange={(e) => setBkoShift(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '10px 36px 10px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: bkoShift ? '#1E293B' : '#94A3B8',
                      fontWeight: 500,
                      appearance: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="" disabled hidden>
                      {isId ? 'Pilih shift lembur' : 'Select overtime shift'}
                    </option>
                    {SHIFT_OPTIONS.filter((shift) => shift !== 'Libur Reguler (Day Off)').map((shift) => (
                      <option key={shift} value={shift} style={{ color: '#1E293B' }}>
                        {shift}
                      </option>
                    ))}
                  </select>
                  <CaretDown
                    size={16}
                    color="#64748B"
                    weight="bold"
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* FIELD 3: Detailed Reason* */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Detailed Reason <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={isId ? 'Tuliskan alasan rinci pengajuan lembur BKO...' : 'Enter detailed reason for BKO overtime...'}
                  value={detailedReason}
                  onChange={(e) => setDetailedReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1E293B',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* FIELD 4: Attachment (identical to Permit Permission) */}
              {renderAttachmentSection()}
            </>
          ) : (
            /* =========================================================================
                STAFF OVERTIME FORM FIELDS
                1. Overtime Date*
                2. Shift (auto)
                3. Start Time*
                4. End Time*
                5. Overtime Duration (auto)
                6. Detailed Reason*
                7. Attachment
                ========================================================================= */
            <>
              {/* FIELD 1: Overtime Date* */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Overtime Date <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '10px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: scheduleDate ? '#1E293B' : '#94A3B8',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span>{scheduleDate ? formatDisplayDate(scheduleDate) : (isId ? 'Pilih tanggal lembur' : 'Select overtime date')}</span>
                    <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  </button>

                  {isDatePickerOpen && (
                    <CustomDatePickerPopover
                      isOpen={isDatePickerOpen}
                      value={scheduleDate}
                      language={language}
                      onSelect={handleDateSelect}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* FIELD 2: Shift (auto) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#334155',
                    }}
                  >
                    Shift
                  </label>
                  <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#64748B' }}>
                    (auto)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    padding: '10px 14px',
                    backgroundColor: isStaffDayOff ? '#FEF2F2' : '#F8FAFC',
                    border: isStaffDayOff ? '1px solid #FECACA' : '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: isStaffDayOff ? '#DC2626' : (staffShift ? '#334155' : '#94A3B8'),
                    fontWeight: staffShift ? 500 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={17} color={isStaffDayOff ? '#DC2626' : (staffShift ? 'var(--color-secondary, #09B2FF)' : '#94A3B8')} weight="bold" />
                    <span>{staffShift || (isId ? 'Otomatis terisi setelah memilih tanggal' : 'Auto-filled after selecting date')}</span>
                  </div>
                  {staffShift && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isStaffDayOff ? '#DC2626' : '#0284C7',
                        backgroundColor: isStaffDayOff ? '#FEE2E2' : '#EAF7FF',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: isStaffDayOff ? '1px solid #FCA5A5' : '1px solid #BAE6FD',
                      }}
                    >
                      {isStaffDayOff ? (isId ? 'Hari Libur' : 'Day Off') : 'Auto'}
                    </span>
                  )}
                </div>

                {isStaffDayOff && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginTop: '8px',
                      color: '#DC2626',
                      fontSize: '13px',
                      lineHeight: '1.4',
                    }}
                  >
                    <WarningCircle size={18} color="#DC2626" weight="fill" style={{ flexShrink: 0 }} />
                    <span>
                      {isId
                        ? 'Anda berstatus Libur Reguler (Day Off) pada tanggal ini. Lembur staff hanya dapat diajukan pada hari kerja aktif.'
                        : 'You are on Day Off on this date. Staff overtime can only be requested on an active working day.'}
                    </span>
                  </div>
                )}
              </div>

              {/* FIELD 3: End Time* */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  End Time <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="21:00"
                    value={endTime}
                    disabled={!scheduleDate || isStaffDayOff}
                    onChange={handleTimeInput(setEndTime)}
                    maxLength={5}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '10px 38px 10px 14px',
                      border: (!scheduleDate || isStaffDayOff) ? '1px solid #E2E8F0' : '1px solid #CBD5E1',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: (!scheduleDate || isStaffDayOff) ? '#94A3B8' : '#1E293B',
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      backgroundColor: (!scheduleDate || isStaffDayOff) ? '#F8FAFC' : '#FFFFFF',
                      cursor: (!scheduleDate || isStaffDayOff) ? 'not-allowed' : 'text',
                      boxSizing: 'border-box',
                    }}
                  />
                  <Clock
                    size={17}
                    color={(!scheduleDate || isStaffDayOff) ? '#94A3B8' : 'var(--color-secondary, #09B2FF)'}
                    weight="bold"
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                {autoStartTime && !isStaffDayOff && (
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '5px' }}>
                    {isId
                      ? `* Jam lembur otomatis terhitung sejak akhir shift (${autoStartTime})`
                      : `* Overtime starts automatically from shift end time (${autoStartTime})`}
                  </div>
                )}
              </div>

              {/* FIELD 5: Overtime Duration (auto) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#334155',
                    }}
                  >
                    Overtime Duration
                  </label>
                  <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#64748B' }}>
                    (auto)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    padding: '10px 14px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: !isStaffDayOff && durationInfo.hours > 0 ? '#1E293B' : '#94A3B8',
                    fontWeight: !isStaffDayOff && durationInfo.hours > 0 ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxSizing: 'border-box',
                  }}
                >
                  <Clock size={18} color={!isStaffDayOff && durationInfo.hours > 0 ? 'var(--color-secondary, #09B2FF)' : '#94A3B8'} weight="bold" />
                  <span>
                    {isStaffDayOff
                      ? '-'
                      : (durationInfo.hours > 0
                        ? durationInfo.text
                        : (isId ? 'Otomatis terhitung dari jam lembur' : 'Auto-calculated from overtime hours'))}
                  </span>
                </div>
              </div>

              {/* FIELD 6: Detailed Reason* */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Detailed Reason <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  disabled={!scheduleDate || isStaffDayOff}
                  placeholder={
                    isStaffDayOff
                      ? (isId ? 'Tidak dapat mengajukan lembur pada hari libur' : 'Cannot request overtime on a day off')
                      : (isId ? 'Tuliskan alasan rinci lembur staff...' : 'Enter detailed reason for staff overtime...')
                  }
                  value={detailedReason}
                  onChange={(e) => setDetailedReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: (!scheduleDate || isStaffDayOff) ? '1px solid #E2E8F0' : '1px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: (!scheduleDate || isStaffDayOff) ? '#94A3B8' : '#1E293B',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    resize: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: (!scheduleDate || isStaffDayOff) ? '#F8FAFC' : '#FFFFFF',
                    cursor: (!scheduleDate || isStaffDayOff) ? 'not-allowed' : 'text',
                  }}
                />
              </div>

              {/* FIELD 7: Attachment (identical to Permit Permission) */}
              {renderAttachmentSection(isStaffDayOff)}
            </>
          )}
        </form>
      </div>

      {/* =========================================================================
          STICKY BOTTOM APP BAR (FOOTER)
          ========================================================================= */}
      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 35,
          backgroundColor: '#FFFFFF',
          padding: '12px 16px 16px 16px',
          borderTop: '1px solid #F1F5F9',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        <button
          type="submit"
          form="overtime-form"
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
          {isId ? 'Kirim Permohonan Sekarang' : 'Submit Request Now'}
        </button>
      </footer>

      {/* =========================================================================
          REVIEW BOTTOM SHEET MODAL
          ========================================================================= */}
      {isReviewOpen &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsReviewOpen(false);
            }}
            style={{
              position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div
              style={{
                width: '100%',
                maxHeight: '90vh',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px 24px 0 0',
                padding: '12px 20px 24px',
                boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box',
                overflowY: 'auto',
              }}
            >
              {/* Drag Handle Pill */}
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '2px',
                  margin: '0 auto 2px',
                }}
              />

              {/* Title & Close */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>
                    {isId ? 'Review Pengajuan Lembur' : 'Review Overtime Request'}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                    {isId ? 'Periksa kembali detail pengajuan lembur Anda sebelum konfirmasi.' : 'Verify your overtime details before confirmation.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* REVIEW DETAIL CARD */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Header Summary with 36px Secondary Badge */}
                {/* Category / Type Row with Icon Box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#EAF7FF',
                      border: '1px solid #BAE6FD',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--color-secondary, #09B2FF)',
                      flexShrink: 0,
                    }}
                  >
                    {overtimeMode === 'OVERTIME_BKO' ? (
                      <Wrench size={20} weight="fill" />
                    ) : (
                      <Briefcase size={20} weight="fill" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-secondary, #09B2FF)', marginBottom: '3px' }}>
                      Overtime
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                      {overtimeMode === 'OVERTIME_BKO' ? 'BKO Overtime' : 'Staff Overtime'}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1.5px dashed #CBD5E1', margin: '2px 0' }} />

                {/* Overtime Date */}
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                    Overtime Date
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <CalendarCheck size={16} color="var(--color-secondary, #09B2FF)" />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                      {formatDisplayDate(scheduleDate)}
                    </span>
                  </div>
                </div>

                {/* BKO Specific: Shift */}
                {overtimeMode === 'OVERTIME_BKO' ? (
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                      Shift
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                        {bkoShift}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Staff Overtime Specific: Shift (auto), Start/End Time, Duration (auto) */
                  <>
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        Shift (auto)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {staffShift}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        End Time & Duration
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                            {endTime}
                          </span>
                        </div>
                        <span
                          style={{
                            backgroundColor: '#EAF7FF',
                            color: '#0284C7',
                            border: '1px solid #BAE6FD',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '11.5px',
                          }}
                        >
                          {durationInfo.text}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Detailed Reason */}
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                    Detailed Reason
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#1E293B', marginTop: '3px', lineHeight: 1.45, fontWeight: 500 }}>
                    {detailedReason}
                  </div>
                </div>

                {/* Attachment */}
                {formAttachments.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                      Attachment
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                      {formAttachments.map((att) => {
                        const iconInfo = getFileIconInfo(att.name);
                        const IconComponent = iconInfo.Icon;
                        return (
                          <div
                            key={att.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 10px',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
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
                                <IconComponent size={18} weight="bold" />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1E293B',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '180px',
                                  }}
                                >
                                  {att.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748B' }}>
                                  {att.formattedSize}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => alert(isId ? `Membuka berkas: ${att.name}` : `Opening: ${att.name}`)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: '#EFF6FF',
                                border: 'none',
                                display: 'grid',
                                placeItems: 'center',
                                cursor: 'pointer',
                                color: '#053079',
                              }}
                            >
                              <Eye size={17} weight="bold" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit Request vs Confirm */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
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
        )}
    </div>
  );
}

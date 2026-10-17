import React from 'react';
import {
  CaretLeft,
  CalendarBlank,
  FilePdf,
  Eye,
} from '@phosphor-icons/react';
import { getAnnouncementById } from '../data/announcementsData';

/**
 * Announcement Detail Header Bar
 */
export const AnnouncementDetailHeader = ({ onBack }) => {
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--color-text-primary, #0F172A)',
        height: '52px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #E2E8F0',
        flexShrink: 0,
        zIndex: 40,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          style={{
            width: '36px',
            height: '36px',
            background: 'none',
            border: 'none',
            borderRadius: '50%',
            color: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <CaretLeft size={22} weight="bold" />
        </button>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Detail Pengumuman
        </h2>
      </div>
    </header>
  );
};

/**
 * Announcement Detail View Screen
 */
export const AnnouncementDetailView = ({ announcement: initialAnnouncement, onBack, onViewDocument }) => {
  // Fallback to financial banner data if not passed
  const announcement = initialAnnouncement && initialAnnouncement.contentSections
    ? initialAnnouncement
    : getAnnouncementById(initialAnnouncement?.id || 'banner-financial');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* 1. Header Bar */}
      <AnnouncementDetailHeader onBack={onBack} />

      {/* 2. Main Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 32px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* 1. Header Info: Judul & Tanggal */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* Tanggal Announcement */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#64748B',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <CalendarBlank size={15} weight="bold" color="#0284C7" />
            <span>{announcement.date || '17 Oktober 2026'}</span>
            {announcement.publishedTime && (
              <>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span>{announcement.publishedTime}</span>
              </>
            )}
          </div>

          {/* Judul Announcement */}
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.35,
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            {announcement.title}
          </h1>
        </div>

        {/* 2. Deskripsi Announcement */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Deskripsi Pengumuman
          </div>

          {/* Summary / Main Description */}
          {announcement.summary && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#334155',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {announcement.summary}
            </p>
          )}

          {/* Section details */}
          {announcement.contentSections?.map((section, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <h3
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                {section.heading}
              </h3>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {section.body}
              </p>

              {section.bulletPoints && (
                <ul
                  style={{
                    margin: '4px 0 0 0',
                    paddingLeft: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.8125rem',
                    color: '#475569',
                    lineHeight: 1.5,
                  }}
                >
                  {section.bulletPoints.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* 3. Attachment File */}
        {announcement.attachment && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Attachment File
            </div>

            {/* Attachment Card */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {/* PDF Icon Badge */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #FCA5A5',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FilePdf size={24} weight="fill" />
                </div>

                {/* File Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.3,
                      wordBreak: 'break-word',
                    }}
                  >
                    {announcement.attachment.fileName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      color: '#64748B',
                      marginTop: '3px',
                    }}
                  >
                    {announcement.attachment.fileSize} • {announcement.attachment.fileType}
                  </div>
                </div>
              </div>

              {/* Action Button: "View Document" Navigates to Dedicated Document Page */}
              <div
                style={{
                  paddingTop: '6px',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => onViewDocument && onViewDocument(announcement)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Eye size={18} weight="bold" />
                  <span>View Document</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementDetailView;

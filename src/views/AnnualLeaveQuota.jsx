import React from 'react';
import { CalendarCheck, ClockCounterClockwise, Hourglass } from '@phosphor-icons/react';
import { ANNUAL_LEAVE_PERIOD, dayUnit, formatQuotaDate, getQuotaSummary } from '../data/leaveQuota';

const FONT = { body: '16px', heading: '16px', caption: '12px' };

export const QuotaSummaryCard = ({ ledger, language }) => {
  const { total, used, remaining, pendingCount } = getQuotaSummary(ledger);
  const usedPercent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const remainingPercent = 100 - usedPercent;
  const isLowQuota = remaining <= 2;
  const remainingColor = isLowQuota ? '#FDBA74' : '#38BDF8';
  const stats = [
    { label: 'Total', value: `${total}`, color: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.12)', border: 'rgba(255, 255, 255, 0.22)', labelColor: 'rgba(255, 255, 255, 0.85)' },
    { label: language === 'id' ? 'Terpakai' : 'Used', value: used > 0 ? `−${used}` : '0', color: '#FCA5A5', bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(252, 165, 165, 0.45)', labelColor: 'rgba(255, 255, 255, 0.9)' },
  ];

  return (
    <article style={{ background: 'linear-gradient(135deg, #053079 0%, #0344A8 55%, #0284C7 100%)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', overflow: 'hidden', color: '#FFFFFF' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px', color: '#FFFFFF' }}>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '6px', color: remainingColor }}>
            <strong style={{ fontSize: '32px', lineHeight: 1, fontWeight: 800 }}>{remaining}</strong>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{dayUnit(remaining, language)}</span>
          </span>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            {language === 'id' ? `tersisa dari ${total}` : `left of ${total}`}
          </span>
        </p>

        <div role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={used} aria-label={language === 'id' ? 'Kuota terpakai' : 'Quota used'} style={{ width: '100%', height: '6px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.25)', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${remainingPercent}%`, height: '100%', backgroundColor: '#FFFFFF' }} />
          <div style={{ width: `${usedPercent}%`, height: '100%', backgroundColor: '#F87171' }} />
        </div>
      </div>

      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ minWidth: 0, padding: '10px 8px', borderRadius: '8px', backgroundColor: stat.bg, border: `1px solid ${stat.border}`, textAlign: 'center', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column' }}>
            <dd style={{ order: 1, margin: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', color: stat.color, lineHeight: 1.2 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.3px' }}>{stat.value}</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600 }}>{dayUnit(Number(stat.value.replace('−', '')), language)}</span>
            </dd>
            <dt style={{ order: 2, marginTop: '3px', fontSize: '0.6875rem', fontWeight: 600, color: stat.labelColor }}>{stat.label}</dt>
          </div>
        ))}
      </dl>

      {pendingCount > 0 && (
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', borderRadius: '8px', backgroundColor: '#FFF7ED', color: '#C2410C', fontSize: FONT.caption, lineHeight: 1.4 }}>
          <Hourglass size={14} weight="fill" aria-hidden="true" style={{ flexShrink: 0 }} />
          {language === 'id' ? `${pendingCount} permohonan penyesuaian menunggu persetujuan` : `${pendingCount} adjustment ${pendingCount === 1 ? 'request is' : 'requests are'} waiting for approval`}
        </p>
      )}
    </article>
  );
};

export const AnnualLeaveQuotaSection = ({ ledger, language, onOpenLeaveQuota }) => (
  <section aria-labelledby="permit-quota-title" style={{ padding: '12px 16px 16px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
      <div style={{ minWidth: 0 }}>
        <h2 id="permit-quota-title" style={{ margin: '0 0 3px', fontSize: FONT.body, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarCheck size={20} weight="fill" color="#09B2FF" aria-hidden="true" />
          {language === 'id' ? 'Kuota Cuti Tahunan' : 'Annual Leave Quota'}
        </h2>
        <p style={{ margin: 0, fontSize: FONT.caption, color: '#64748B', lineHeight: 1.4 }}>
          {language === 'id' ? 'Periode' : 'Period'} {formatQuotaDate(ANNUAL_LEAVE_PERIOD.start, language)} – {formatQuotaDate(ANNUAL_LEAVE_PERIOD.end, language)}
        </p>
      </div>
      <button type="button" onClick={onOpenLeaveQuota} style={{ flexShrink: 0, minHeight: '36px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #CBD5E1', borderRadius: '10px', backgroundColor: '#FFFFFF', color: '#334155', fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
        <ClockCounterClockwise size={18} color="#09B2FF" aria-hidden="true" />
        {language === 'id' ? 'Lihat Riwayat' : 'View History'}
      </button>
    </div>

    <QuotaSummaryCard ledger={ledger} language={language} />
  </section>
);

export default AnnualLeaveQuotaSection;

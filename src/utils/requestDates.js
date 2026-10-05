// Request dates in the current demo are displayed as DD MMM YYYY, optionally a range.
export const formatRequestSubmission = (language, date = new Date()) => {
  const day = date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return `${day} • ${time}`;
};

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, ags: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };

export const matchesRequestDate = (dateDisplay, selectedDate) => {
  if (!selectedDate) return true;
  const dates = Array.from(String(dateDisplay || '').matchAll(/\b(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\b|\b(\d{4}-\d{2}-\d{2})\b/g), (match) => {
    if (match[4]) return match[4];
    const month = MONTHS[match[2].toLowerCase()];
    return month ? `${match[3]}-${String(month).padStart(2, '0')}-${match[1].padStart(2, '0')}` : null;
  }).filter(Boolean);
  return dates.length > 0 && selectedDate >= dates[0] && selectedDate <= (dates[1] || dates[0]);
};

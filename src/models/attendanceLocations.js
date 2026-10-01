// Illustrative demo coordinates; replace with recorded GPS/site coordinates from the API.
export const MULTI_SITE_ATTENDANCE_DEMO = {
  clockInSiteName: 'Thamrin Executive Residences',
  // North-west of the building, about 75m from the geofence center.
  clockInLat: -6.1962,
  clockInLng: 106.81905,
  clockInRadius: '75m',
  clockInSiteLat: -6.19665,
  clockInSiteLng: 106.81955,
  clockInLocation: 'Thamrin Executive Residences • Lobby',
  clockOutSiteName: 'Paladian Park Apartment',
  // South-east of the building, about 110m from the geofence center.
  clockOutLat: -6.1532,
  clockOutLng: 106.89338,
  clockOutRadius: '110m',
  clockOutSiteLat: -6.15265,
  clockOutSiteLng: 106.89255,
  clockOutLocation: 'Paladian Park Apartment • Lobby',
};

const coordinates = (lat, lng) => {
  if ([lat, lng].some((value) => value == null || String(value).trim() === '')) return null;
  const pair = [Number(lat), Number(lng)];
  return pair.every(Number.isFinite) && Math.abs(pair[0]) <= 90 && Math.abs(pair[1]) <= 180 ? pair : null;
};

export const getAttendanceLocations = (data = {}) => {
  const inactive = ['LIBUR', 'OFF', 'LEAVE', 'IZIN', 'ALPHA'].includes(String(data.status).toUpperCase());
  return ['in', 'out'].map((key) => {
    const prefix = key === 'in' ? 'clockIn' : 'clockOut';
    const time = data[prefix];
    const hasTime = typeof time === 'string' && /^\d{1,2}:\d{2}(?:\s*WIB)?$/i.test(time.trim());
    const explicitLocation = data[`${prefix}SiteName`] != null || data[`${prefix}Lat`] != null || data[`${prefix}Lng`] != null;
    // Older demo records only contain a shared site label. Show the two-site
    // scenario for those records, including a detail already open during HMR.
    // Explicit per-clock GPS/site data always takes precedence.
    const locationData = explicitLocation ? data : MULTI_SITE_ATTENDANCE_DEMO;
    const coords = coordinates(locationData[`${prefix}Lat`], locationData[`${prefix}Lng`]);
    return {
      key, time, coords,
      siteName: locationData[`${prefix}SiteName`] || data.siteName || data.site || '—',
      siteCoords: coordinates(locationData[`${prefix}SiteLat`], locationData[`${prefix}SiteLng`]),
      distanceLabel: locationData[`${prefix}Radius`],
      available: !inactive && hasTime && !!coords,
    };
  });
};

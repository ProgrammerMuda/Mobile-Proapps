/**
 * Utils & Helpers Layer
 * Reusable helper functions, formatting, and constants.
 */

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Galaxy Hotel - Local Timezone Date Utilities
 * Ensures dates are consistently formatted as YYYY-MM-DD in local time (UTC+7 in Vietnam)
 * without the UTC midnight timezone drift caused by toISOString().
 */

export const getLocalDateStr = (d: Date | number = new Date()): string => {
  const date = typeof d === 'number' ? new Date(d) : d;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowDateStr = (d: Date | number = new Date()): string => {
  const date = typeof d === 'number' ? new Date(d) : new Date(d.getTime());
  date.setDate(date.getDate() + 1);
  return getLocalDateStr(date);
};

export const formatDateVi = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

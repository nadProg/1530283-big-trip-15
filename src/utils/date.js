import dayjs from 'dayjs';

export const formdatEventDate = (date) => dayjs(date).format('MMM DD');

export const formatTime = (date) => dayjs(date).format('HH:mm');

export const formatDateTime = (date, { isTime = true } = {}) => dayjs(date).format(`YYYY-MM-DD${isTime ? '[T]HH:mm' : ''}`);

export const formatDuration = (startDate, endDate) => {
  startDate = dayjs(startDate);
  endDate = dayjs(endDate);

  return dayjs(endDate.diff(startDate)).format('DD[D] HH[H] mm[M]');
};

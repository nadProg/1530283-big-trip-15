import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const formdatEventDate = (date) => dayjs(date).format('MMM DD');

export const formatTime = (date) => dayjs(date).format('HH:mm');

export const formatDateTime = (date, { isTime = true } = {}) => dayjs(date).format(`YYYY-MM-DD${isTime ? '[T]HH:mm' : ''}`);

export const formatDuration = (startDate, endDate) => {
  startDate = dayjs(startDate);
  endDate = dayjs(endDate);

  return dayjs.duration(endDate.diff(startDate)).format('DD[D] HH[H] mm[M]');
};

export const formatInputDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export const isPointDuringToday = ({ start, end }) => {
  const today = dayjs();
  end = dayjs(end);
  start = dayjs(start);
  return today.isAfter(start) && today.isBefore(end);
};

export const isStartInFuture = ({ start }) => dayjs(start).isAfter(dayjs());

export const isEndInPast= ({ end }) => dayjs(end).isBefore(dayjs());

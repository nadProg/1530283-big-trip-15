import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

export const formdatEventDate = (date) => dayjs(date).format('MMM DD');

export const formatTime = (date) => dayjs(date).format('HH:mm');

export const formatDateTime = (date, { isTime = true } = {}) => dayjs(date).format(`YYYY-MM-DD${isTime ? '[T]HH:mm' : ''}`);

export const getDuration = (startDate, endDate) => {
  startDate = dayjs(startDate);
  endDate = dayjs(endDate);

  return dayjs.duration(endDate.diff(startDate));
};

export const formatDuration = (duration) => {
  if (typeof duration === 'number') {
    duration = dayjs.duration(duration);
  }

  const [days, hours, minutes] = duration.format('DD[D] HH[H] mm[M]').split(' ');

  if (days.startsWith('00')) {
    return [hours, minutes].join(' ');
  }

  if (hours.startsWith('00')) {
    return minutes;
  }

  return [days, hours, minutes].join(' ');
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

export const formatTripDate = (date) => {
  if (!date) {
    return '';
  }

  let { start, end } = date;
  start = dayjs(start).format('MMM DD');
  end = dayjs(end).format('MMM DD');

  const [ endMonth, endDay ] = end.split(' ');
  if (start.startsWith(endMonth)) {
    end = endDay;
  }

  return `${start}&nbsp;&mdash;&nbsp;${end}`;
};

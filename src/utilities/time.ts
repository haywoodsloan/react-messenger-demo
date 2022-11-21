import moment from 'moment';

export function toAbsoluteTime(datetime: string) {
  const parsed = moment(datetime);
  const now = moment();

  return now.isSame(parsed, 'year')
    ? parsed.format('h:mm A, MMM D')
    : parsed.format('MMM D, YYYY (h:mm A)');
}

export function toRelativeTime(datetime: string) {
  const parsed = moment(datetime);
  const now = moment();

  const duration = moment.duration(now.diff(parsed));
  if (duration.asMinutes() < 1) {
    return 'Just now';
  } else if (duration.asHours() < 1) {
    const minutes = duration.minutes();
    return minutes > 1 ? `${minutes} mins ago` : `${minutes} min ago`;
  } else if (now.isSame(parsed, 'day')) {
    return parsed.format('h:mm A');
  } else if (now.isSame(parsed, 'week')) {
    return parsed.format('ddd');
  } else if (now.isSame(parsed, 'year')) {
    return parsed.format('MMM D');
  }

  return parsed.format('MM/DD/YY');
}

export function dataFormatter(date: Date, isHours?: boolean) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  if (!isHours) {
    return formattedDate;
  }
  const result = `${formattedDate} at ${formattedTime}`;

  return result;
}

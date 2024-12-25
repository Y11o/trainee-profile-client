export const formatDisplayedTimeRange = (startTime: Date, finishTime: Date): string => {
  const formattedStartTime = startTime.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  const formattedFinishTime = finishTime.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  return `${formattedStartTime}-${formattedFinishTime}`;
};

export const formatDateTimeRequest = (date: Date, currentDate: Date): string =>
  `${String(currentDate.getFullYear())}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

export const formatTimeRequest = (time: string | undefined | null): Date => new Date((new Date).toLocaleDateString('en') + ' ' + time);

// FIXME: для фильтрации интервалов по времени не привязываемся к конкретной дате
export const replaceDate = (dateTime: Date): Date => formatTimeRequest(dateTime.toLocaleTimeString('ru'));

export const formatLinksInText = (str: string) => {
  /* eslint-disable-next-line no-useless-escape */
  const pattern = /(\b(http?|https):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return str.replace(pattern, '<a href="$1" class="text-link" target="_blank" rel="noreferrer noopener">$1</a>');
};

export const toISO = (date: Date | string) => {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return `${localDate.toISOString().split('.')[0]}Z`;
};

export const parseDateTime = (item: string) => {
  const dateTime = new Date(item);
  const time = dateTime.toLocaleTimeString('ru-RU').slice(0, -3);
  const date = `${dateTime.toLocaleString('ru-RU').split(',')[0]} (${dateTime.toLocaleString('ru-ru', { weekday: 'short' }).toUpperCase()})`;
  return `${date}, ${time}`;
};

export const sortByProperty = <T>(arr: T[], property: keyof T | `-${string & keyof T}`) => {
  let sortOrder = 1;

  if (typeof property === 'string' && property.startsWith('-')) {
    sortOrder = -1;
    property = property.substring(1) as keyof T;
  }

  return arr.sort((a, b) => {
    const AProp = String(a[property as keyof T]);
    const BProp = String(b[property as keyof T]);

    return AProp.localeCompare(BProp) * sortOrder;
  });
};

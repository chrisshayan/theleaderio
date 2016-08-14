
export const getLocalDate = (date, timezone) => {
  const localTimezone = 'Asia/Ho_Chi_Minh';
  const timezoneDate = moment.tz(date, timezone);
  const localDate = timezoneDate.clone().tz(localTimezone);
  return localDate.format();
}
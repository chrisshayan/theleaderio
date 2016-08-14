import {Meteor} from 'meteor/meteor';

/**
 * Get local datetime
 * @param date
 * @param timezone
 * @returns a datetime for local timezone
 */
export const getLocalDate = (date, timezone) => {
  const localTimezone = Meteor.settings.public.localTimezone;
  const timezoneDate = moment.tz(date, timezone);
  const localDate = timezoneDate.clone().tz(localTimezone);
  return localDate.format();
}
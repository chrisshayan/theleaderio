import {Meteor} from 'meteor/meteor';
import winston from 'winston';

/**
 * Logger instance
 * error: [Function],
 * warn: [Function],
 * info: [Function],
 * verbose: [Function],
 * debug: [Function],
 * silly: [Function],
 */
export const Logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)(Meteor.settings.logger.file)
  ]
});
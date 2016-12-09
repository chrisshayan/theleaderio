import {Meteor} from 'meteor/meteor';
import {JOB_FREQUENCY, MINUTE_OF_AN_HOUR} from '/imports/utils/defaults';

export const IDValidator = {
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
};

/**
 * Function validate alias
 * Only allow a-z, A-Z and Number 0-9
 * @param alias
 * @return true if alias's characters is allowed
 */
export const aliasValidator = (alias) => {
  const regex = new RegExp("^[a-zA-Z0-9]*$");

  return regex.test(alias);
}

export const getErrors = err => {
  let error = {};
  try {
    if (err.details) {
      if (_.isObject(err.details)) {
        details = err.details;
      } else {
        details = JSON.parse(err.details);
      }
      _.each(details, e => error[e.name] = e.reason);
    } else {
      error.GENERAL = err.reason;
    }
  } catch (e) {
    error.GENERAL = e.toString();
  }
  return error;
}


export const getRandomColor = () => {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const arraySum = (array) => {
  if (_.isEmpty(array)) {
    return 0;
  }
  return array.reduce(function (a, b) {
    return Number(a) + Number(b);
  });
}

export const arrayAverage = (array) => {
  let count = 0; // calculate the number of element which value > 0
  if (_.isEmpty(array)) {
    return 0;
  }
  if (arraySum(array) === 0) {
    return 0;
  }

  array.map(value => {
    if (Number(value) > 0) {
      count++;
    }
  });
  return arraySum(array) / count;
}

export const addMonths = (date, months) => {
  date.setMonth(date.getMonth() + months);
  return date;
}

export const timestampToDate = (timestamp) => {
  return new Date(timestamp * 1000);
}

/**
 * Function get cron expression
 * @param {Object} params Object with properties about frequency, day, hour, minute
 * @param {String} expression cron expression
 */
export const getCronExpression = ({params}) => {
  const
    {
      frequency,
      day,
      hour = 0,
      minute = 0
    } = params
    ;
  let
    result = {
      min: MINUTE_OF_AN_HOUR[minute], // 0 - 59
      hour, // 0 - 23
      dayOfMonth: 1, // 1 - 31
      month: "*", // 1 - 12
      dayOfWeek: 0 // 0 - 6 (0 is Monday, 7 is Sunday too)
    }
    ;

  if (JOB_FREQUENCY[frequency] === "Every Month") {
    result.dayOfMonth = `${day}`;
    result.dayOfWeek = "*";
  } else if (JOB_FREQUENCY[frequency] === "Every 2 Weeks") {
    result.dayOfMonth = "*";
    result.dayOfWeek = `${day}/2`;
  } else {
    result.dayOfMonth = "*";
    result.dayOfWeek = `${day}`;
  }

  return result;
};

export const googleTrackConversion = () => {
  const {
    googleTrackConversion
  } = Meteor.settings.public;
  window.google_trackConversion(googleTrackConversion);
};

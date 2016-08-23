import _ from 'lodash';
import moment from 'moment';

const intervalDay = {
  'EVERY_WEEK': 7,
  'EVERY_TWO_WEEKS': 14,
  'EVERY_MONTH': 30
};

const getQuarter = () => {
  const now = new moment();
  const q1 = now.clone(),
        q2 = now.clone(),
        q3 = now.clone(),
        q4 = now.clone();

  q1.date(1).month(0);
  q2.date(1).month(3);
  q3.date(1).month(6);
  q4.date(1).month(9);
  return {
    QUARTER_1: q1,
    QUARTER_2: q2,
    QUARTER_3: q3,
    QUARTER_4: q4
  }
}

export const getScheduleAvailable = (
  start, end, interval = 'EVERY_WEEK', result = []
  ) => {
  const intervalDay = {
    'EVERY_WEEK': 7,
    'EVERY_TWO_WEEKS': 14,
    'EVERY_MONTH': 30
  };
  let startTime = new moment(start);
  let endTime = new moment(end);
  let nextTime = startTime.clone();
  nextTime.add(intervalDay[interval], 'day');
  if(nextTime.valueOf() <= endTime.valueOf()) {
    result.push(nextTime.toDate());
    return getScheduleAvailable(nextTime.toDate(), end, interval, result);
  }
  return result;
}

export const generateSendingPlan = (quarter, interval) => {
  const quarters = getQuarter();
  const start = quarters[quarter];
  const end = start.clone();
  end.add(3, 'month');
  return getScheduleAvailable(start.toDate(), end.toDate(), interval);
}

export const validate = (quarter, numOfMetric, interval) => {
  let startTime;
  const now = new moment();
  const quarters = getQuarter();
  const start = quarters[quarter];
  const end = start.clone();
  end.add(3, 'month');

  if(now.isBefore(start)) {
    return numOfMetric <= 3;
  } if(now.isBetween(start, end)) {
    const numOfSending = getScheduleAvailable(now.toDate(), end.toDate(), interval);
    return numOfSending.length >= numOfMetric;
  } else {
    return false;
  }
}

export const isQuarterActive = (quarter) => {
  const now = new moment();
  const quarters = getQuarter();
  const start = quarters[quarter];
  const end = start.clone();
  end.add(3, 'month');
  return now.isBefore(end);
}
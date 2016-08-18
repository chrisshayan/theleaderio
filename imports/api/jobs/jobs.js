import {later} from 'meteor/mrt:later';

// Job Collections
import {MetricsJobs, QueueJobs} from './collections';
import {getLocalDate} from '/imports/api/time/functions';

const createMetricSurveysJob = function() {
  const metricSurveysJob = new Job(MetricsJobs, 'metricsSurveys', {});

  const runTime = Meteor.settings.jobs.runTime.metricEmailSurvey;
  metricSurveysJob.priority('high')
    .repeat({
      schedule: MetricsJobs.later.parse.text('every 5 minutes')
      // schedule: MetricsJobs.later.parse.recur().on(runTime).time()
    })
    .save();
}

const createQueueJob = ({type, data}) => {
  const {date, timezone, planId, employeeId, leaderId, organizationId, metric} = data;
  const runTime = getLocalDate(date, timezone);

  const jobData = {planId, employeeId, leaderId, organizationId, metric};
  const queueJob = new Job(QueueJobs, type, jobData);
  queueJob.priority('normal')
    .after(new Date(runTime))
    .save();
}

export const jobs = {
  metricsSurveys: {
    create: createMetricSurveysJob,
    remove: () => null
  },
  queue: {
    create: createQueueJob,
    remove: () => null
  }
};
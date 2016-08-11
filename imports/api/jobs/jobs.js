import {MetricsJobs} from './collections';
import {later} from 'meteor/mrt:later';

const createMetricRequestsJob = function() {
  const metricRequestsJob = new Job(MetricsJobs, 'metricsRequests', {});

  const runTime = Meteor.settings.jobs.runTime.metricEmailRequest;
  metricRequestsJob.priority('high')
    .repeat({
      schedule: MetricsJobs.later.parse.text('every 20 seconds')
      // schedule: MetricsJobs.later.parse.recur().on(runTime).time()
    })
    .save();
}

export const jobs = {
  metricsRequests: {
    create: createMetricRequestsJob,
    delete: () => null
  }
};
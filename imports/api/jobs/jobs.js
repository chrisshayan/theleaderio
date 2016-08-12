import {MetricsJobs} from './collections';
import {later} from 'meteor/mrt:later';

const createMetricSurveysJob = function() {
  const metricSurveysJob = new Job(MetricsJobs, 'metricsSurveys', {});

  const runTime = Meteor.settings.jobs.runTime.metricEmailSurvey;
  metricSurveysJob.priority('high')
    .repeat({
      schedule: MetricsJobs.later.parse.text('every 20 seconds')
      // schedule: MetricsJobs.later.parse.recur().on(runTime).time()
    })
    .save();
}

export const jobs = {
  metricsSurveys: {
    create: createMetricSurveysJob,
    remove: () => null
  }
};
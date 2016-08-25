/**
 * @summary Job Collections Definitions
 * @DailyJobs system jobs which will be run daily
 * @QueueJobs queue jobs which will be used as a message queue system
 */

// Daily jobs
export const DailyJobs = new JobCollection('daily');

// Queue Jobs
export const QueueJobs = new JobCollection('queue');
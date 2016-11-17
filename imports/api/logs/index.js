import {
  LogsSendingPlanCollection,
  LogsDigestCollection,
  LogsEmailCollection
} from './collections';

export const LogsSendingPlan = new LogsSendingPlanCollection("logs.sending_plan");

export const LogsDigest = new LogsDigestCollection("logs.digest");

export const LogsEmail = new LogsEmailCollection("logs.email");
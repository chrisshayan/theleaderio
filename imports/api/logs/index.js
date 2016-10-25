import {
  LogsSendingPlanCollection,
  LogsDigestCollection
} from './collections';

export const LogsSendingPlan = new LogsSendingPlanCollection("logs.sending_plan");

export const LogsDigest = new LogsDigestCollection("logs.digest");
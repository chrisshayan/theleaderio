import {
  LogsSendingPlanCollection,
  LogsDigestCollection,
  LogsEmailCollection,
  LogsDisabledAccountsCollection
} from './collections';

export const LogsSendingPlan = new LogsSendingPlanCollection("logs.sending_plan");

export const LogsDigest = new LogsDigestCollection("logs.digest");

export const LogsEmail = new LogsEmailCollection("logs.email");

export const LogsDisabledAccounts = new LogsDisabledAccountsCollection("logs.disabled_accounts");


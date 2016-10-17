import {METRICS, QUARTER} from '/imports/api/scheduler/index';


// the content of this file should be import into database
export const DEFAULT_METRICS = [
  "purpose",
  "mettings",
  "rules",
  "communications",
  "leadership",
  "workload",
  "energy",
  "stress",
  "decision",
  "respect",
  "conflict"
];

export const MONTH_OF_QUARTER = {
  QUARTER_1: [0, 1, 2],
  QUARTER_2: [3, 4, 5],
  QUARTER_3: [6, 7, 8],
  QUARTER_4: [9, 10, 11],
};


export const DEFAULT_PUBLIC_INFO_PREFERENCES = {
  basic: {
    name: true,
    industry: true
  },
  headline: {
    title: true
  },
  contact: {
    phone: true,
    email: true
  },
  summary: {
    noOrg: true,
    noEmployees: true,
    noFeedbacks: true
  },
  picture: {
    imageUrl: true
  },
  about: {
    aboutMe: true
  },
  organizations: {
    show: true,
    list: []
  },
  metrics: {
    overall: true,
    purpose: true,
    mettings: true,
    rules: true,
    communications: true,
    leadership: true,
    workload: true,
    energy: true,
    stress: true,
    decision: true,
    respect: true,
    conflict: true
  }
};

export const TEMPLATE_IMPORT_EMPLOYEES = '/templates/employees.csv';

export const DEFAULT_PROFILE_PHOTO = '/img/default-profile-pic.png';

export const DEFAULT_ORGANIZATION_PHOTO = '/img/default_firm.jpg';

export const DEFAULT_SCHEDULER = [
  {
    metrics: [METRICS.PURPOSE, METRICS.MEETINGS, METRICS.RULES],
    quarter: QUARTER.QUARTER_1
  },
  {
    metrics: [METRICS.COMMUNICATIONS, METRICS.LEADERSHIP, METRICS.WORKLOAD],
    quarter: QUARTER.QUARTER_2
  },
  {
    metrics: [METRICS.ENERGY, METRICS.STRESS, METRICS.DECISION],
    quarter: QUARTER.QUARTER_3
  },
  {
    metrics: [METRICS.RESPECT, METRICS.CONFLICT],
    quarter: QUARTER.QUARTER_4
  }
];

export const EMAIL_TEMPLATE_CONTENT = {
  metrics: {
    survey: {
      title: "",
      message: {
        purpose: `Purpose is an important metric for blah blah blah, reply this email with the number of score`,
        mettings: "Mettings is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
        rules: "",
        communications: "",
        leadership: "",
        workload: "",
        energy: "",
        stress: "",
        decision: "",
        respect: "",
        conflict: ""
      }
    },
    feedback: {
      title: "",
      message: ""
    },
    error: {
      title: "",
      message: ""
    }
  },
};

/**
 * CONSTANT JOB FREQUENCY
 */
export const JOB_FREQUENCY = ["Every Week", "Every 2 Weeks", "Every Month"];

/**
 * CONSTANT DAY OF WEEK
 */
export const DAY_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


/**
 * CONSTANT DAY OF MONTH
 * only allow day from 1 - 28, incase of the month is different from 29 - 31
 */
export const DAY_OF_MONTH = ["day 1", "day 2", "day 3", "day 4", "day 5", "day 6", "day 7", "day 8",
                             "day 9", "day 10", "day 11", "day 12", "day 13", "day 14", "day 15", "day 16",
                             "day 17", "day 18", "day 19", "day 20", "day 21", "day 22", "day 23", "day 24",
                             "day 25", "day 26", "day 27", "day 28"];

/**
 * CONSTANT HOUR OF A DAY
 */
export const HOUR_OF_DAY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                            13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

/**
 * CONSTANT MINUTE OF AN HOUR
 */
export const MINUTE_OF_AN_HOUR = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

/**
 * Job Collection log levels
 * @type {{INFO: string, SUCCESS: string, WARNING: string, CRITICAL: string}}
 */
export const LOG_LEVEL = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "danger"
};

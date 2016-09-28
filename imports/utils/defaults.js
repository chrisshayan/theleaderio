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

export const SCHEDULE_INTERVAL = ["every week", ]

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
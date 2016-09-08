import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import SchedulerCollection from './collection';

// constants
export const INTERVAL = {
  EVERY_WEEK: "EVERY_WEEK",
  EVERY_2_WEEKS: "EVERY_2_WEEKS",
  EVERY_MONTH: "EVERY_MONTH"
};
export const METRICS = {
  PURPOSE: "PURPOSE",
  MEETINGS: "MEETINGS",
  RULES: "RULES",
  COMMUNICATIONS: "COMMUNICATIONS",
  LEADERSHIP: "LEADERSHIP",
  WORKLOAD: "WORKLOAD",
  ENERGY: "ENERGY",
  STRESS: "STRESS",
  DECISION: "DECISION",
  RESPECT: "RESPECT",
  CONFLICT: "CONFLICT"
};
export const QUARTER = {
  QUARTER_1: "QUARTER_1",
  QUARTER_2: "QUARTER_2",
  QUARTER_3: "QUARTER_3",
  QUARTER_4: "QUARTER_4",
};
export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
}

export const MEETINGS_UI_INFO = [{
    key: METRICS.PURPOSE,
    name: 'Purpose',
    shortName: 'Purpose',
    icon: 'flaticon-metric-purpose',
    tooltip: 'One of the key elements of inspiration is setting purpose to the work. When employees “clearly know their role, have what they need to fulfill their role, and can see the connection between their role and the overall organizational purpose,” says <a href="https://hbr.org/2013/07/employee-engagement-does-more/" rel="nofollow" target="_blank">Harter</a>, that’s the recipe for creating greater levels of engagement.'
  }, {
    key: METRICS.MEETINGS,
    name: 'Meetings',
    shortName: 'Meetings',
    icon: 'flaticon-metric-meeting',
    tooltip: 'There are few signs that shows teams are drifting. One of the main indicators is meetings. You leave meetings feeling like they’ve been a waste of time, or you decide to stop having team meetings because they’re not productive anymore.'
  }, {
    key: METRICS.RULES,
    name: 'Ground Rules and Norms',
    shortName: 'Rules',
    icon: 'flaticon-metric-rule',
    tooltip: 'Ground rules are an important tool for helping individuals function together as a <a href="http://www1.umn.edu/ohr/toolkit/workgroup/forming/rules/" rel="nofollow" target="_blank">team</a>. They reflect what is important to the members about how they work together.Ground rules should focus on three elements:  Tasks – Expected activities and deliverables for the team; Process – How the activities will be carried out; and Norms – Ways in which team members will interact with each other'
  }, {
    key: METRICS.COMMUNICATIONS,
    name: 'Communications',
    shortName: 'Communications',
    icon: 'flaticon-metric-communication',
    tooltip: '. It is simply impossible to become a great leader without being a great <a href="http://www.forbes.com/sites/mikemyatt/2012/04/04/10-communication-secrets-of-great-leaders/" rel="nofollow" target="_blank">communicator</a>'
  }, {
    key: METRICS.LEADERSHIP,
    name: 'Leadership',
    shortName: 'Leadership',
    icon: 'flaticon-metric-leadership',
    tooltip: 'It can be hard to define and it means different things to different people. This is why it is important to be measured in point of view of your team members, are you leading them properly?'
  }, {
    key: METRICS.WORKLOAD,
    name: 'Workload/ Distribution of work',
    shortName: 'Workload',
    icon: 'flaticon-metric-workload',
    tooltip: 'As the <a href="http://www.inc.com/mike-figliuolo/5-steps-for-doing-more-with-less-without-the-stress.html" rel="nofollow" target="_blank">leader</a> of a high-performing team, how you distribute and balance work across the members of that team is a critical success factor. It needs to be done fairly. Note, I didn\'t say equally.'
  }, {
    key: METRICS.ENERGY,
    name: 'Energy/Commitment Level',
    shortName: 'Energy',
    icon: 'flaticon-metric-energy',
    tooltip: 'Commitment of a leader inspires and motivates the followers and helps them to be more stronger towards the purpose and vision of the organization and team.'
  }, {
    key: METRICS.STRESS,
    name: 'Management of Stress',
    shortName: 'Stress',
    icon: 'flaticon-metric-stress',
    tooltip: 'It is acceptable to have stress in the business in fact today\'s business is very stressful. However a good leader must be able to manage the stress in order to ensure the team is performing in their best focus.'
  }, {
    key: METRICS.DECISION,
    name: 'Decision Making',
    shortName: 'Decision',
    icon: 'flaticon-metric-decision',
    tooltip: 'We believe the time has come to broaden the traditional approach to leadership and decision making and form a new perspective based on <a href="https://hbr.org/2007/11/a-leaders-framework-for-decision-making" rel="nofollow" target="_blank">complexity science</a>. Do your followers think you are able to make a decision?'
  }, {
    key: METRICS.RESPECT,
    name: 'Respect',
    shortName: 'Respect',
    icon: 'flaticon-metric-respect',
    tooltip: ' Too many people today assume <a href="http://www.inc.com/kevin-daum/7-ways-to-earn-respect-as-a-leader.html" rel="nofollow" target="_blank">leadership positions</a> without consideration for their impact on others. The <a href="http://www.nigeriavillagesquare.com/guest/leading-in-the-21st-century-grooming-the-next-generation-of-leaders.html" target="_blank" rel="nofollow">leadership vacuum</a> in business today allows them to stay as long they manage acceptable results. Ultimately, your personal leadership legacy will not be remembered for your M.B.A., your sales numbers, or the toys you acquired. Most likely, it will be the positive, personal impact you created, one follower at a time.'
  }, {
    key: METRICS.CONFLICT,
    name: 'Management of conflict',
    shortName: 'Conflict',
    icon: 'flaticon-metric-conflict',
    tooltip: '<a href="http://www.forbes.com/sites/glennllopis/2014/11/28/4-ways-leaders-effectively-manage-employee-conflict/" rel="nofollow" target="_blank">Conflict resolution</a> is a daily occurrence at work that can either propel or disrupt the momentum for a leader, a team or the entire organization. The workplace can become a toxic environment when leaders allow conflict to fester rather than confront it head-on.'
  }];


// Collection
export const Scheduler = new SchedulerCollection('scheduler');

// Schema
Scheduler.schema = new SimpleSchema({
  userId: {
    type: String
  },
  metrics: {
    type: [String],
    minCount: 1,
    maxCount: 3,
    allowedValues: [
      METRICS.PURPOSE, METRICS.MEETINGS, METRICS.RULES, METRICS.COMMUNICATIONS,
      METRICS.LEADERSHIP, METRICS.WORKLOAD, METRICS.ENERGY, METRICS.STRESS,
      METRICS.DECISION, METRICS.RESPECT, METRICS.CONFLICT
    ],
  },
  year: {
    type: Number
  },
  quarter: {
    type: String,
    allowedValues: [QUARTER.QUARTER_1, QUARTER.QUARTER_2, QUARTER.QUARTER_3, QUARTER.QUARTER_4]
  },
  interval: {
    type: String,
    allowedValues: [INTERVAL.EVERY_WEEK, INTERVAL.EVERY_2_WEEKS, INTERVAL.EVERY_MONTH],
    defaultValue: INTERVAL.EVERY_WEEK
  },
  status: {
    type: String,
    allowedValues: [STATUS.ACTIVE, STATUS.INACTIVE],
    defaultValue: STATUS.INACTIVE
  }
});

Scheduler.attachSchema(Scheduler.schema);

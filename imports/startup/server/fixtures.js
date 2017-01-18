import {Meteor} from 'meteor/meteor';
import {EJSON} from 'meteor/ejson';
import {Roles} from 'meteor/alanning:roles';

// collections
import {Industries} from '/imports/api/industries/index';
import {Defaults} from '/imports/api/defaults/index';
import {Accounts} from 'meteor/accounts-base';
import {Administration} from '/imports/api/admin/index';

// methods
import * as IndustriesActions from '/imports/api/industries/methods';
import * as DefaultsActions from '/imports/api/defaults/methods';
import {editAdminJob} from '/imports/api/jobs/methods';
import {add as addJobSchedule, edit as editJobSchedule} from '/imports/api/admin/methods';

// functions
import {getCronExpression} from '/imports/utils/index';

// constants
import {METRICS, QUARTER} from '/imports/api/scheduler/index';

/**
 * Create default industries
 */
function setupIndustries() {
  if (Industries.find().count() > 0) return;

  const rawJson = Assets.getText("industries.json");
  const data = EJSON.parse(rawJson);
  _.each(data.industries, function (i) {
    const _item = {
      name: i.label
    };
    IndustriesActions.insert.call(_item);
  });
}

/**
 * Create default values
 */
export function createDefaults() {
  let selector = {},
    modifier = {}
    ;

  // METRICS
  selector = {name: "METRICS"}
  if (Defaults.find(selector).count() == 0) {
    const name = "METRICS",
      content = [
        "purpose",
        "meetings",
        "rules",
        "communications",
        "leadership",
        "workload",
        "energy",
        "stress",
        "decision",
        "respect",
        "conflict"
      ]
      ;
    DefaultsActions.add.call({name, content});
  }

  // SCORES
  selector = {name: "SCORES"}
  if (Defaults.find(selector).count() == 0) {
    const name = "SCORES",
      content = {
        minScore: 0,
        maxScore: 5,
        averageScore: 5
      };
    DefaultsActions.add.call({name, content});
  }

  // PUBLIC_INFO_PREFERENCES
  selector = {name: "PUBLIC_INFO_PREFERENCES"}
  if (Defaults.find(selector).count() == 0) {
    const name = "PUBLIC_INFO_PREFERENCES",
      content = {
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
          meetings: true,
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
    DefaultsActions.add.call({name, content});
  }

  // PROFILE_PHOTO
  selector = {name: "PROFILE_PHOTO"}
  if (Defaults.find(selector).count() == 0) {
    const name = "PROFILE_PHOTO",
      content = '/img/default-profile-pic.png';
    DefaultsActions.add.call({name, content});
  }

  // ORGANIZATION_PHOTO
  selector = {name: "ORGANIZATION_PHOTO"}
  if (Defaults.find(selector).count() == 0) {
    const name = "ORGANIZATION_PHOTO",
      content = '/img/default_firm.png';
    DefaultsActions.add.call({name, content});
  }

  // SCHEDULER
  selector = {name: "SCHEDULER"}
  if (Defaults.find(selector).count() == 0) {
    const name = "SCHEDULER",
      content = [
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
    DefaultsActions.add.call({name, content});
  }

  // EMAIL_TEMPLATE_CONTENT
  selector = {name: "EMAIL_TEMPLATE_CONTENT"}
  if (Defaults.find(selector).count() == 0) {
    const
      name = "EMAIL_TEMPLATE_CONTENT",
      content = {
        // mail send to leader
        leader: {
          feedback: {
            replyGuideHeader: "How to feedback?",
            replyGuideMessage: `Simply reply this email with your suggestion and write whatever you think about your employee.`,
          }
        },
        // mail send to employee
        employee: {
          feedback: {
            replyGuideHeader: "How to feedback?",
            replyGuideMessage: `Simply reply this email with your suggestion and write whatever you think is good.`,
          },
          metrics: {
            replyGuideHeader: "How to score?",
            replyGuideMessage: "Simply reply this email and score your leader from scale of 1 to 5, 1 is bad and 5 is awesome.",
            purpose: `One of the key elements of inspiration is setting purpose to the work. When employees “clearly know their role, have what they need to fulfill their role, and can see the connection between their role and the overall organizational purpose,” says Harter, that’s the recipe for creating greater levels of engagement.`,
            meetings: `There are few signs that shows teams are drifting. One of the main indicators is meetings. You leave meetings feeling like they’ve been a waste of time, or you decide to stop having team meetings because they’re not productive anymore.`,
            rules: `Ground rules are an important tool for helping individuals function together as a team. They reflect what is important to the members about how they work together.Ground rules should focus on three elements:  Tasks – Expected activities and deliverables for the team; Process – How the activities will be carried out; and Norms – Ways in which team members will interact with each other.`,
            communications: `It is simply impossible to become a great leader without being a great communicator.`,
            leadership: `It can be hard to define and it means different things to different people. This is why it is important to be measured in point of view of your team members, are you leading them properly?`,
            workload: `As the leader of a high-performing team, how you distribute and balance work across the members of that team is a critical success factor. It needs to be done fairly. Note, I didn't say equally.`,
            energy: `Commitment of a leader inspires and motivates the followers and helps them to be more stronger towards the purpose and vision of the organization and team.`,
            stress: `It is acceptable to have stress in the business in fact today's business is very stressful. However a good leader must be able to manage the stress in order to ensure the team is performing in their best focus.`,
            decision: `We believe the time has come to broaden the traditional approach to leadership and decision making and form a new perspective based on complexity science. Do your followers think you are able to make a decision?`,
            respect: `Too many people today assume leadership positions without consideration for their impact on others. The leadership vacuum in business today allows them to stay as long they manage acceptable results. Ultimately, your personal leadership legacy will not be remembered for your M.B.A., your sales numbers, or the toys you acquired. Most likely, it will be the positive, personal impact you created, one follower at a time.`,
            conflict: `Conflict resolution is a daily occurrence at work that can either propel or disrupt the momentum for a leader, a team or the entire organization. The workplace can become a toxic environment when leaders allow conflict to fester rather than confront it head-on.`
          },
          inform_feedback: {}
        }
      }
      ;
    DefaultsActions.add.call({name, content});
  }
}

// create role for user
const initiateRoles = () => {
  const
    users = Accounts.users.find({roles: {$exists: false}}).fetch(),
    adminEmails = ["jackiekhuu.work@gmail.com", "mrphu3074@gmail.com", "christopher.shayan@gmail.com"]
    ;

  users.map(user => {
    Roles.addUsersToRoles(user._id, ["user"]);
  });

  adminEmails.map(adminEmail => {
    const admin = Accounts.users.findOne({emails: {$elemMatch: {address: adminEmail}}});
    if (!_.isEmpty(admin)) {
      Roles.addUsersToRoles(admin._id, ["admin"]);
    }
  });
}

// initiate for admin jobs
const initiateAdminJobs = () => {
  // initiate for admin jobs feedback_for_employee
  if (Administration.find({type: "job", name: "feedback_for_employee"}).count() == 0) {
    editJobSchedule.call({
      type: "job",
      name: "feedback_for_employee",
      data: {
        frequency: 0, // index of the frequency
        day: 0,
        hour: 0,
        minute: 0,
        disableDayOfWeek: false,
        disableDayOfMonth: true
      }
    }, (error) => {
      if (!error) {
        editAdminJob.call({
          params: {
            type: "feedback_for_employee",
            schedule: getCronExpression({
              params: {
                frequency: 0, // index of the frequency
                day: 0,
                hour: 0,
                minute: 0,
                disableDayOfWeek: false,
                disableDayOfMonth: true
              }
            }),
            data: {}
          }
        });
      }
    });
  }

// initiate for admin jobs statistic_for_leader
  if (Administration.find({type: "job", name: "statistic_for_leader"}).count() == 0) {
    editJobSchedule.call({
      type: "job",
      name: "statistic_for_leader",
      data: {
        frequency: 0, // index of the frequency
        day: 0,
        hour: 0,
        minute: 0,
        disableDayOfWeek: false,
        disableDayOfMonth: true
      }
    }, (error) => {
      if (!error) {
        editAdminJob.call({
          params: {
            type: "statistic_for_leader",
            schedule: getCronExpression({
              params: {
                frequency: 0, // index of the frequency
                day: 0,
                hour: 0,
                minute: 0,
                disableDayOfWeek: false,
                disableDayOfMonth: true
              }
            }),
            data: {}
          }
        });
      }
    });
  }
}

Meteor.startup(() => {
  setupIndustries();

  // create defaults for app
  createDefaults();

  // initiate Admin Jobs
  initiateAdminJobs();

  // initiateRoles();
});


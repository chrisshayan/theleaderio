import {Meteor} from 'meteor/meteor';
import {EJSON} from 'meteor/ejson';

// collections
import {Industries} from '/imports/api/industries/index';
import {Defaults} from '/imports/api/defaults/index';

// methods
import * as IndustriesActions from '/imports/api/industries/methods';
import * as DefaultsActions from '/imports/api/defaults/methods';

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
        averageScore: 3
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
    const name = "EMAIL_TEMPLATE_CONTENT",
      content = {
        metrics: {
          survey: {
            PURPOSE: {
              title: ``,
              message: `One of the key elements of inspiration is setting purpose to the work. When employees “clearly know their role, have what they need to fulfill their role, and can see the connection between their role and the overall organizational purpose,” says <a href="https://hbr.org/2013/07/employee-engagement-does-more/" rel="nofollow" target="_blank">Harter</a>, that’s the recipe for creating greater levels of engagement.`
            },
            METTINGS: {
              title: ``,
              message: `There are few signs that shows teams are drifting. One of the main indicators is meetings. You leave meetings feeling like they’ve been a waste of time, or you decide to stop having team meetings because they’re not productive anymore.`
            },
            RULES: {
              title: ``,
              message: `Ground rules are an important tool for helping individuals function together as a <a href="http://www1.umn.edu/ohr/toolkit/workgroup/forming/rules/" rel="nofollow" target="_blank">team</a>. They reflect what is important to the members about how they work together.Ground rules should focus on three elements:  Tasks – Expected activities and deliverables for the team; Process – How the activities will be carried out; and Norms – Ways in which team members will interact with each other.`
            },
            COMMUNICATIONS: {
              title: ``,
              message: `It is simply impossible to become a great leader without being a great <a href="http://www.forbes.com/sites/mikemyatt/2012/04/04/10-communication-secrets-of-great-leaders/" rel="nofollow" target="_blank">communicator</a>.`
            },
            LEADERSHIP: {
              title: ``,
              message: `It can be hard to define and it means different things to different people. This is why it is important to be measured in point of view of your team members, are you leading them properly?`
            },
            workload: {
              title: ``,
              message: `As the <a href="http://www.inc.com/mike-figliuolo/5-steps-for-doing-more-with-less-without-the-stress.html" rel="nofollow" target="_blank">leader</a> of a high-performing team, how you distribute and balance work across the members of that team is a critical success factor. It needs to be done fairly. Note, I didn\'t say equally.`
            },
            energy: {
              title: ``,
              message: `Commitment of a leader inspires and motivates the followers and helps them to be more stronger towards the purpose and vision of the organization and team.`
            },
            stress: {
              title: ``,
              message: `It is acceptable to have stress in the business in fact today\'s business is very stressful. However a good leader must be able to manage the stress in order to ensure the team is performing in their best focus.`
            },
            decision: {
              title: ``,
              message: `We believe the time has come to broaden the traditional approach to leadership and decision making and form a new perspective based on <a href="https://hbr.org/2007/11/a-leaders-framework-for-decision-making" rel="nofollow" target="_blank">complexity science</a>. Do your followers think you are able to make a decision?`
            },
            respect: {
              title: ``,
              message: `Too many people today assume <a href="http://www.inc.com/kevin-daum/7-ways-to-earn-respect-as-a-leader.html" rel="nofollow" target="_blank">leadership positions</a> without consideration for their impact on others. The <a href="http://www.nigeriavillagesquare.com/guest/leading-in-the-21st-century-grooming-the-next-generation-of-leaders.html" target="_blank" rel="nofollow">leadership vacuum</a> in business today allows them to stay as long they manage acceptable results. Ultimately, your personal leadership legacy will not be remembered for your M.B.A., your sales numbers, or the toys you acquired. Most likely, it will be the positive, personal impact you created, one follower at a time.`
            },
            conflict: {
              title: ``,
              message: `<a href="http://www.forbes.com/sites/glennllopis/2014/11/28/4-ways-leaders-effectively-manage-employee-conflict/" rel="nofollow" target="_blank">Conflict resolution</a> is a daily occurrence at work that can either propel or disrupt the momentum for a leader, a team or the entire organization. The workplace can become a toxic environment when leaders allow conflict to fester rather than confront it head-on.`
            }
          },
          survey_error: {
            purpose: {
              title: ``,
              message: `purpose is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            mettings: {
              title: ``,
              message: `Mettings is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            rules: {
              title: ``,
              message: `rules is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            communications: {
              title: ``,
              message: `communications is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            leadership: {
              title: ``,
              message: `leadership is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            workload: {
              title: ``,
              message: `workload is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            energy: {
              title: ``,
              message: `energy is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            stress: {
              title: ``,
              message: `stress is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            decision: {
              title: ``,
              message: `decision is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            respect: {
              title: ``,
              message: `respect is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            },
            conflict: {
              title: ``,
              message: `conflict is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`
            }
          },
          feedback: {
            title: "",
            message: "Your feedback will help the leader to improve their ability. Please reply this email with idea or comment for helping your leader."
          },
          thankyou: {
            title: "Thank you for helping your leader.",
            message: "We could improve together"
          },
        },
      };
    DefaultsActions.add.call({name, content});
  }
}

Meteor.startup(() => {
  setupIndustries();

  // create defaults for app
  createDefaults();
});


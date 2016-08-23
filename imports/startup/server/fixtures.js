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
            title: "",
            message: {
              purpose: `Purpose is an important metric for blah blah blah, reply this email with the number of score`,
              mettings: "Mettings is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              rules: "rules is an important metric for blah blah blah, reply this email with the number of score",
              communications: "communications is an important metric for blah blah blah, reply this email with the number of score",
              leadership: "leadership is an important metric for blah blah blah, reply this email with the number of score",
              workload: "workload is an important metric for blah blah blah, reply this email with the number of score",
              energy: "energy is an important metric for blah blah blah, reply this email with the number of score",
              stress: "stress is an important metric for blah blah blah, reply this email with the number of score",
              decision: "decision is an important metric for blah blah blah, reply this email with the number of score",
              respect: "respect is an important metric for blah blah blah, reply this email with the number of score",
              conflict: "conflict is an important metric for blah blah blah, reply this email with the number of score"
            }
          },
          survey_error: {
            title: "",
            message: {
              purpose: `purpose is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.`,
              mettings: "Mettings is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              rules: "rules is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              communications: "communications is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              leadership: "leadership is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              workload: "workload is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              energy: "energy is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              stress: "stress is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              decision: "decision is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              respect: "respect is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader.",
              conflict: "conflict is a core metric, which will estimate the ability of a leader. Reply this email with the number of score for scoring your leader."
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


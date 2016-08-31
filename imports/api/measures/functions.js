
// collections
import {Measures} from './index';
import {Metrics} from '/imports/api/metrics/index';

// functions
import {arraySum} from '/imports/utils/index';

/**
 * @summary this function used to insert/update the measure data which collect data for measurement
 * @param {Object} data include leaderId, organizationId, type, interval, year, month, day, key, value
 * @return {Number} the result of updating data into Measures Collection
 */
export const measure = ({data}) => {
  const {leaderId, organizationId, type, interval, year, month, day, key, value} = data;
  let
    query = {},
    update = {},
    options = {}
  ;

  switch (type) {
    case "metric": {
      query = {leaderId, organizationId, type, interval, year, month, key};
      update = {$set: {value}};
      options = {upsert: true};
      break;
    }
    case "feedback": {

      break;
    }
    default: {
      return `unknown type: ${type}`;
    }
  }

  return Measures.update(query, update, options);
};

/**
 * @summary collect measure data of a month for metric
 * @description collect all score in current month, 
 * @description get average score for every metric in every organization of every leader
 * @return true if success, false if failed
 */
export const measureMonthlyMetricScore = () => {
  // create mini mongo collection
  const MiniMongo = new Mongo.Collection(null);
  MiniMongo.remove({});
  const
  // {} = job.data,
    runDate = new Date(),
    year = runDate.getFullYear(),
    month = runDate.getMonth(),
    nextMonth = month + 1
    ;
  let
    jobMessage = "",
    selector = {},
    modifier = {},
    leaderList = [],
    result = false
    ;

  // Get list of leaders
  selector = {
    date: {
      $gte: new Date(year, month, 1),
      $lt: new Date(year, nextMonth, 1)
    }
  }; // only get data in current month
  modifier = {
    fields: {
      _id: 0,
      leaderId: 1,
      organizationId: 1,
      metric: 1,
      score: 1
    }
  }; // only return necessary fields

  // get leaders data in current month
  const docs = Metrics.find(selector, modifier).fetch();
  if(!_.isEmpty(docs)) {

    docs.map(doc => {
      MiniMongo.insert(doc);
      leaderList.push(doc.leaderId);
    });
    leaderList = _.uniq(leaderList); // get unique leader only

    // get average score for every leader
    leaderList.map(leaderId => {
      var orgList = [];
      var leaderDocs = MiniMongo.find({leaderId}).fetch();

      //get list of organization for specific leader
      leaderDocs.map(leaderDoc => {
        orgList.push(leaderDoc.organizationId);
        orgList = _.uniq(orgList);
      });
      // get list of metric for specific organization
      orgList.map(organizationId => {
        var metricList = [];
        var orgDocs = MiniMongo.find({leaderId, organizationId}).fetch();
        orgDocs.map(orgDoc => {
          metricList.push(orgDoc.metric);
          metricList = _.uniq(metricList);
        });
        // get list of score for specific metric
        metricList.map(metric => {
          var scoreList = [];
          var measureDoc = {}; // data of measure for leader
          var metricDocs = MiniMongo.find({leaderId, organizationId, metric}).fetch();
          metricDocs.map(metricDoc => {
            scoreList.push(metricDoc.score);
          });

          // calculate average score of metric
          var averageScore = arraySum(scoreList) / scoreList.length;
          averageScore = Number(averageScore.toFixed(1));

          measureDoc = {
            leaderId,
            organizationId,
            type: "metric",
            interval: "monthly",
            year,
            month,
            key: metric,
            value: averageScore
          };

          measure({data: measureDoc});
        });
      });
    });
    return true;
  } else {
    return false;
  }
}


import moment from 'moment';
import _ from 'lodash';

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
    case "metric":
    {
      query = {leaderId, organizationId, type, interval, year, month, key};
      update = {$set: {value}};
      options = {upsert: true};
      break;
    }
    case "feedback":
    {

      break;
    }
    default:
    {
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
  if (!_.isEmpty(docs)) {

    docs.map(doc => {
      MiniMongo.insert(doc);
      leaderList.push(doc.leaderId);
    });
    leaderList = _.uniq(leaderList); // get unique leader only

    // get average score for every leader
    leaderList.map(leaderId => {
      const leaderDocs = MiniMongo.find({leaderId}).fetch();
      let orgList = [];

      //get list of organization for specific leader
      leaderDocs.map(leaderDoc => {
        orgList.push(leaderDoc.organizationId);
        orgList = _.uniq(orgList);
      });
      // get list of metric for specific organization
      orgList.map(organizationId => {
        let
          metricList = [],
          orgDocs = MiniMongo.find({leaderId, organizationId}).fetch()
          ;
        orgDocs.map(orgDoc => {
          metricList.push(orgDoc.metric);
          metricList = _.uniq(metricList);
        });
        // get list of score for specific metric
        metricList.map(metric => {
          const metricDocs = MiniMongo.find({leaderId, organizationId, metric}).fetch();
          let
            scoreList = [],
            averageScore = 0,
            noOfScores = 0,
            noOfGoodScores = 0, // count the number of score from 4 to 5
            noOfBadScores = 0, // count the number of score from 1 to 3
            measureDoc = {} // data of measure for leader
            ;

          metricDocs.map(metricDoc => {
            const {score} = metricDoc;
            if(score > 3) {
              noOfGoodScores++;
            } else {
              noOfBadScores++;
            }
            scoreList.push(score);
          });

          noOfScores = scoreList.length;
          if(noOfScores > 0) {
            averageScore = Number(arraySum(scoreList) / scoreList.length).toFixed(1);
          }

          measureDoc = {
            leaderId,
            organizationId,
            type: "metric",
            interval: "monthly",
            year,
            month,
            key: metric,
            value: {
              averageScore,
              noOfScores,
              noOfGoodScores,
              noOfBadScores
            }
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

import {Meteor} from 'meteor/meteor';
import MonkeyLearn from 'monkeylearn';

const monkeyClassifyTopicAsync = (text_list, callback) => {
  const
    {key, moduleId} = Meteor.settings.monkeyLearn,
    ml = new MonkeyLearn(key),
    module_id = moduleId,
    p = ml.classifiers.classify(module_id, text_list, true);

  p.then(res => {
    //
    const {result} = res;
    const [tags] = result;
    callback(null, tags);
  });
}

const monkeyClassifyTopicSync = Meteor.wrapAsync(monkeyClassifyTopicAsync);

export const monkeyClassifyTopic = ({text_list}) => {
  check(text_list, Array);
  const topics = monkeyClassifyTopicSync(text_list) || [];

  return topics;
};
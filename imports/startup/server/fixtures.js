import { Meteor } from 'meteor/meteor';

import { EJSON } from 'meteor/ejson';

import { Industries } from '/imports/api/industries/index';
import * as IndustriesActions from '/imports/api/industries/methods';

function setupIndustries() {
  if(Industries.find().count() > 0) return;

  const rawJson = Assets.getText("industries.json");
  const data = EJSON.parse(rawJson);
  _.each(data.industries, function(i) {
    const _item = {
      name: i.label
    };
    IndustriesActions.insert.call(_item);
  });
}

Meteor.startup(() => {
  setupIndustries();
});

import {Meteor} from 'meteor/meteor';
import {Organizations} from '/imports/api/organizations/index';
import {updateFields} from '/imports/api/organizations/methods';
import {generateRandomCode} from '/imports/utils/index';

Migrations.add({
  version: 5,
  name: "generate question url code",
  up() {
    const
      orgs = Organizations.find({randomCode: {$exists: false}}, {fields: {_id: true}}).fetch()
      ;

    if (!_.isEmpty(orgs)) {
      orgs.map(org => {
        const
          {_id} = org,
          randomCode = generateRandomCode(8)
          ;

        updateFields.call({_id, randomCode});
      });
    }

  }
});
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

    console.log(orgs);
    if (!_.isEmpty(orgs)) {
      orgs.map(org => {
        const
          {_id} = org,
          randomCode = generateRandomCode(4)
          ;

        updateFields.call({_id, randomCode});
      });
    }

  }
});
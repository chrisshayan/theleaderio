import {Preferences} from '/imports/api/users/index';
import { DEFAULT_PUBLIC_INFO_PREFERENCES } from '/imports/utils/defaults';

Migrations.add({
  version: 1,
  name: "change default preferences for user's public profile",
  up: function () {
    Preferences.update({}, { $set: {configs: DEFAULT_PUBLIC_INFO_PREFERENCES}});
  }
});
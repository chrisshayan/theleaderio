import { Session } from 'meteor/session';
import { getSubdomain } from '/imports/utils/subdomain';
import { createStore } from '/imports/store'

Session.setDefault('alias', getSubdomain());

createStore().then(() => {
	require('./routes');
});
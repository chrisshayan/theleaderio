import { Session } from 'meteor/session';
import { getSubdomain } from '/imports/utils';
Session.setDefault('leaderAlias', getSubdomain());

import './routes';
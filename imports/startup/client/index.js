import { Session } from 'meteor/session';
import { getSubdomain } from '/imports/utils/subdomain';
Session.setDefault('alias', getSubdomain());

import './routes';
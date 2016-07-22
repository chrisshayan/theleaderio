import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// collections
import ConfigsColleciton from './collection';

export const Configs = new ConfigsColleciton('configs');

import {MetricsJobs} from './collections';

MetricsJobs.allow({
  // Grant full permission to any authenticated user
  // will control detail later
  admin: function (userId, method, params) {
    return (userId ? true : false);
  }
});
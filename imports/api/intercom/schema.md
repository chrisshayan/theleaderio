## User model for intercom

user_id {String}
email {String}
name: {String}
signed_up_at {String}
avatar {Object}
  type {String} should be 'avatar',
  image_url {String} image url
custom_attributes {Object} only for custom attributes
  username {String} theLeader username
  profile {String} profile user like http://chrisshayan.theleader.io
  job_title {String}
  phone {String}
  organization_count {Number}
  organization_latest {Date}
  employee_count {Number}
  employee_latest {Date}

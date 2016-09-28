import {Mongo} from 'meteor/mongo';

export const MUsers = new Mongo.Collection("old_users");

export const MProfiles = new Mongo.Collection("old_profiles");

export const MIndustries = new Mongo.Collection("old_industries");

export const MRelationships = new Mongo.Collection("old_relationships");

export const MSurveys = new Mongo.Collection("old_surveys");

export const MFeedbacks = new Mongo.Collection("old_feedbacks");

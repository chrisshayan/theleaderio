import {
  MUsers,
  MProfiles,
  MRelationships,
  MSurveys,
  MFeedbacks
} from './collections';

/**
 * Function collect migration data for a user
 * @param params
 */
export const getUserData = ({params}) => {
  if (typeof params.userId === 'undefined') {
    return;
  }
  const
    {userId} = params,
    newUser = {
      userId: "",
      organizationId: "",
      email: "",
      firstName: "",
      lastName: "",
      industries: [],
      employees: []
    },
    metricsName = {
      goalRating: "purpose",
      groundRulesRating: "",
      communicationRating: "",
      leadershipRating: "",
      workloadRating: "",
      energyRating: "",
      stressRating: "",
      decisionRating: "",
      respectRating: "",
      conflictRating: ""
    },
    user = MUsers.findOne({_id: userId}),
    profile = MProfiles.findOne({userId}),
    employees = MRelationships.find({userId, type: 1}, {fields: {elseId: true}}).fetch(),
    surveys = MSurveys.find({leaderId: userId}).fetch()
    ;

  // get user info
  newUser.email = user.emails[0].address;
  newUser.firstName = profile.firstName;
  newUser.lastName = profile.lastName;
  newUser.industries = profile.industries;

  /**
   * Function create new account
   * @param {String} email
   * @param {String} firstName
   * @param {String} lastName
   * @param {Array} industries
   * @return {String} newUser.userId
   */

  /**
   * Function create default organization
   * @param {String} name - 'default'
   * @param {String} leaderId = newUser.userId
   * @return {String} newUser.organizationId
   */

  // get list of employees
  employees.map(employee => {
    const
      employeeId = employee.elseId,
      employeeData = {}
    ;
    let
      employeeProfile = {}
    ;

    employeeData.email = MUsers.findOne({_id: employeeId}).emails[0].address;
    employeeProfile = MProfiles.findOne({userId: employeeId});
    employeeData.firstName = employeeProfile.firstName;
    employeeData.lastName = employeeProfile.lastName;

    /**
     * Function create employee
     * @param {String} leaderId
     * @param {String} organizationId
     * @param {String} firstName
     * @param {String} lastName
     * @param {String} email
     * @return {String} newUser.employees.push(newEmployeeId)
     */
    console.log(employeeData)
    // userData.employees.push(employee.elseId);
  });
  // get user metrics
  surveys.map(survey => {

  });

  // console.log(metrics);
  // console.log(userData);
}
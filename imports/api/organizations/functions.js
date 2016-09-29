// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

/**
 * Function get 1 employee from organization randomly
 * @param leaderId
 * @param organizationId
 * @return employeeId
 */
export const getRandomEmployee = ({params}) => {
  const
    {organizationId} = params,
    organization = Organizations.findOne({_id: organizationId})
    ;

  if(!_.isEmpty(organization)) {
    const
      {employees, pickedEmployees} = organization,
      total = employees.length
      ;
    let
      picked = -1,
      currentPickedEmployee = "",
      currentOrganization = {},
      currentPickedEmployees = []
    ;

    // get random employee who isn't exists in pickedEmployees
    do {
      picked = Math.floor((Math.random() * total));
      currentPickedEmployee = employees[picked];
    } while (_.indexOf(pickedEmployees, currentPickedEmployee) > -1);


    // add current picked employee into list pickedEmployees
    Organizations.update({_id: organizationId}, {$push: {pickedEmployees: currentPickedEmployee}});

    // if all employees had been picked, clear the list pickedEmployees
    currentOrganization = Organizations.findOne({_id: organizationId});
    if(!_.isEmpty(currentOrganization)) {
      currentPickedEmployees = currentOrganization.pickedEmployees;
      if(employees.length === currentPickedEmployees.length) {
        Organizations.update({_id: organizationId}, {$set: {pickedEmployees: []}});
      }
    }

    return {employeeId: currentPickedEmployee};
  } else {
    return {};
  }
}


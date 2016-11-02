import {Mongo} from 'meteor/mongo';
import {Organizations} from '/imports/api/organizations';

class EmployeesCollection extends Mongo.Collection {
  /**
   * Insert hooks
   *
   * after insert employee, add employees array of that organization
   */
  insert(doc, callback) {
    const
      employeeId = super.insert(doc, callback),
      updatedAt = new Date()
      ;

    if (employeeId) {
      Organizations.update({_id: doc.organizationId}, {
        $addToSet: {
          employees: employeeId
        },
        $set: {
          updatedAt
        }
      })
    }
    return employeeId;
  }

  /**
   * remove hooks
   *
   * afterRemove : pull employee id in organization's employees
   */
  remove(selector, callback) {
    const
      doc = this.findOne(selector),
      updatedAt = new Date(),
      result = super.remove(selector, callback)
      ;
    if (result) {
      Organizations.update({_id: doc.organizationId}, {
        $pull: {
          employees: doc._id
        },
        $set: {
          updatedAt
        }
      });
    }
    return result;
  }
}

export default EmployeesCollection;

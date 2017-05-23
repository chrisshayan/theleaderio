import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// components
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import ThankyouPage from '/imports/ui/common/ThankyouPage';

// collections
import {eNPS} from '/imports/api/enps/index';

// methods
import {verify as verifyLeader} from '/imports/api/users/methods';
import {addScore as addENPSScore} from '/imports/api/enps/methods';

export default class GetENPSScore extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      isVerified: false,
      error: ""
    };
  }

  componentWillMount() {
    const {alias, organizationId, employeeId, eNPSId, score} = this.props;

    // verify alias
    verifyLeader.call({alias}, (error, result) => {
      if (error) {
        this.setState({
          ready: true,
          error: error.reason
        });
      } else {
        // add score
        addENPSScore.call({_id: eNPSId, alias, organizationId, employeeId, score: Number(score)}, (error, result) => {
          if(!error) {
            this.setState({
              ready: true,
              isVerified: true,
              error: ""
            });
          } else {
            this.setState({
              ready: true,
              isVerified: false,
              error: error.reason
            });
          }
        });
      }
    });
  }

  render() {
    const
      {alias, organizationId, employeeId, eNPSId, score} = this.props,
      {ready, isVerified, error} = this.state
      ;

    if (ready) {
      if (isVerified) {
        return (
          <ThankyouPage
            description="With your help, the leader can improve the employee satisfaction."
          />
        );
      } else {
        return (
          <div>
            <NoticeForm
              description={error}
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          <Spinner/>
        </div>
      );
    }

  }
}
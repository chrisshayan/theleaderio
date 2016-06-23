import React, { Component } from 'react';

import CreateUser from '../components/CreateUser';
import * as ProfileActions from '/imports/api/profiles/methods';

export default class SignUpPage extends Component {

  onSubmit({ firstName, lastName, email, password }) {
    const userId = Accounts.createUser({ email, password }, (error) => {
      if(!error) {
        ProfileActions.create.call(userId, firstName, lastName);
      } else {
        console.log(error);
      }
    });
    console.log(userId);
  }

  render() {
    return (
      <div>
        <CreateUser
          onSubmit = { this.onSubmit.bind(this) }
        />
      </div>
    );
  }
}
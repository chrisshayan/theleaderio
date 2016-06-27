import React, { Component } from 'react';

import SingleInputFrom from '/imports/ui/common/SingleInputForm';

export default class ForgotPasswordPage extends Component {
  constructor() {
    super();

    this.state = {
      errors: null
    };
  }

  _inputSubmit() {
    console.log(`button Send new password clicked.`);
  }

  render() {
    return (
      <div>
        <SingleInputFrom
          logoName='TL+'
          formTitle='Forgot password'
          formDescription='Enter your email address and your password will be reset and emailed to you.'
          inputType='email'
          inputHolder='Email address'
          buttonLabel='Send new password'
          errors={ this.state.errors }
          onSubmit={ this._inputSubmit.bind(this) }
        />
      </div>
    );
  }
}
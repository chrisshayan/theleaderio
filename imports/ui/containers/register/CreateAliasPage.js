import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Meteor} from 'meteor/meteor';

import SingleInputForm from '/imports/ui/common/SingleInputForm';
import NoticeForm from '/imports/ui/common/NoticeForm';
import * as UserActions from '/imports/api/users/methods';
import * as TokenActions from '/imports/api/tokens/methods';
import * as SubdomainActions from '/imports/utils/subdomain';
import { signinRoute } from '/imports/startup/client/routes';

export default class CreateAliasPage extends Component {
  constructor() {
    super();

    this.state = {
      errors: null,
      tokenVerified: null
    };
  }

  _inputSubmit({inputValue}) {
    const alias = inputValue;
    const tokenId = FlowRouter.getQueryParam("token");
    console.log('suppose to create alias');
    // Call methods createAlias
    UserActions.createAlias.call({tokenId, alias}, (error) => {
      if (_.isEmpty(error)) {
        console.log(`token: ${tokenId} will be removed`);
        TokenActions.remove.call({tokenId});
        // Redirect to user's login page
        SubdomainActions.addSubdomain({ alias, route: 'signin' });
      } else {
        this.setState({
          errors: error.reason
        });
      }
    });
  }

  componentWillMount() {
    const tokenId = FlowRouter.getQueryParam("token");
    TokenActions.verify.call({tokenId}, (error) => {
      if (_.isEmpty(error)) {
        this.setState({
          tokenVerified: true
        });
      } else {
        this.setState({
          errors: error.reason,
          tokenVerified: false
        });
      }
    });
    if (tokenId) {
      // call verify Token
      this.setState({
        tokenVerified: true
      });
    } else {
      this.setState({
        tokenVerified: false
      });
    }
  }

  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      if (this.state.tokenVerified) {
        return (
          <div>
            <SingleInputForm
              logoName='TL+'
              formTitle='Create your alias'
              formDescription='This alias will be used as your web address.'
              inputType='text'
              inputHolder='Alias'
              buttonLabel='Create'
              errors={ this.state.errors }
              onSubmit={ this._inputSubmit.bind(this) }
            />
          </div>
        );
      } else {
        return (
          <div>
            <NoticeForm
              code='404'
              message={ this.state.errors }
              description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
              buttonLabel='Come back to HomePage'
              redirectUrl='/'
            />
          </div>
        );
      }
    }
  }
}
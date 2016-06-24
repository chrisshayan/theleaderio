import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Meteor} from 'meteor/meteor';

import SingleInputForm from '/imports/ui/common/SingleInputForm';
import InvalidUrlForm from '/imports/ui/common/InvalidUrlForm';
import * as UserActions from '/imports/api/users/methods';
import * as TokenActions from '/imports/api/tokens/methods';

export default class CreateAliasPage extends Component {
  constructor() {
    super();

    this.state = {
      errors: null,
      tokenVerified: null
    };
  }

  _invalidUrlSubmit(redirectUrl) {
    FlowRouter.go(redirectUrl);
  }

  _inputSubmit({inputValue}) {
    const alias = inputValue;
    const tokenId = FlowRouter.getQueryParam("token");
    console.log('suppose to create alias');
    // Call methods createAlias
    UserActions.createAlias.call({tokenId, alias}, (error) => {
      if (_.isEmpty(error)) {
        // Redirect to user's home page
        const setHomepageRoute = `/signup/firstTime/${alias}`;
        // console.log(setHomepageRoute);
        FlowRouter.go(setHomepageRoute);
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
            <InvalidUrlForm
              code='404'
              message={ this.state.errors }
              description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
              buttonLabel='Come back to HomePage'
              redirectUrl='/'
              onSubmit={ this._invalidUrlSubmit.bind(this) }
            />
          </div>
        );
      }
    }
  }
}
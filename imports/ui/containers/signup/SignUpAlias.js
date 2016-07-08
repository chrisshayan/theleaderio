import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import { createContainer } from 'meteor/react-meteor-data';

import {routes} from '/imports/startup/client/routes';
import SingleInputForm from '/imports/ui/common/SingleInputForm';
import CreateAliasForm from '/imports/ui/common/CreateAliasForm';
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Copyright from '/imports/ui/common/Copyright';
import * as UserActions from '/imports/api/users/methods';
import * as TokenActions from '/imports/api/tokens/methods';
import * as SubdomainActions from '/imports/utils/subdomain';

import { Profiles } from '/imports/api/profiles/index';

// SignUpAlias.propTypes = {
//   aliases: React.PropTypes.array,
//   loading: React.PropTypes.bool,
//   listExists: React.PropTypes.bool
// };

class SignUpAlias extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      errors: null
    };
  }

  componentWillMount() {
    // Get alias collection data
  }

  _inputSubmit({inputValue}) {
    const alias = inputValue;
    const email = FlowRouter.getQueryParam("email");
    // Call methods createAlias
    this.setState({
      loading: true
    });
    UserActions.createAlias.call({email, alias}, (error) => {
      if (_.isEmpty(error)) {
        // Redirect to user's login page
        // Need the cookie sharing login information here
        SubdomainActions.addSubdomain({alias, route: `${routes.home}`});
      } else {
        this.setState({
          errors: error.reason
        });
      }
      this.setState({
        loading: false
      });
    });
  }

  render() {
    const { loading, listExists, aliases } = this.props;
    if (this.state.loading || loading) {
      return (
        <div>
          <Spinner
            message='Loading ...'
          />
        </div>
      );
    } else {
      return (
        <div id="page-top">
          <div className="middle-box text-center loginscreen   animated fadeInDown">
            <div>
              <h1 className="logo-name">TL+</h1>
            </div>
            <h3>Create your alias</h3>
            <p>This alias will be used as your web address.</p>
            <CreateAliasForm
              inputType='text'
              inputHolder='alias'
              buttonLabel='Create'
              errors={ this.state.errors }
              onSubmit={ this._inputSubmit.bind(this) }
            />
            <Copyright />
          </div>
        </div>
      );
      
    }
  }
}

export default SignUpAliasContainer = createContainer(({ params }) => {
  const listAlias = Meteor.subscribe('alias.list');
  const loading = !listAlias.ready();
  const listExists = !loading;
  return {
    loading,
    listExists,
    aliases: listExists ? Meteor.users.find().fetch() : []
  };
}, SignUpAlias);
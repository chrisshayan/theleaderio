import React, {Component} from 'react';

import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';
import ProfileDetail from '/imports/ui/components/ProfileDetail';
import Activities from '/imports/ui/components/Activities';
import TopNav from '/imports/ui/common/TopNav';

import * as UserActions from '/imports/api/users/methods';

export default class PublicProfilePage extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      alias: null
    };
  }

  componentWillMount() {
    this.setState({
      loading: true
    });
    const alias = Session.get('alias');
    UserActions.verify.call({alias}, (error) => {
      if (_.isEmpty(error)) {
        this.setState({
          alias: true,
          loading: false
        });
      } else {
        this.setState({
          alias: false,
          loading: false
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    if (this.state.alias) {
      return (
        <div id="page-top" className="gray-bg">
          <TopNav />
          <div className="wrapper wrapper-content">
            <div className="row animated fadeInRight">
              <div className="col-md-4">
                <ProfileDetail />
              </div>
              <div className="col-md-8">
                <Activities />
              </div>
            </div>
          </div>
        </div>
      );
    } else  if(!this.state.alias) {
      return (
        <div id="page-top" className="gray-bg">
          <NoticeForm
            code='404'
            message="Alias doesn't exists"
            description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
            buttonLabel='Come back to HomePage'
          />
        </div>
      );
    } else {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
  }
}
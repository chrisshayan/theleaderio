import React, {Component} from 'react';

class TopNav extends Component {

  constructor() {
    super();

    this.state = {
      loggedIn: null
    };
  }

  componentWillMount() {
    if (Meteor.loggingIn() || Meteor.userId()) {
      this.setState({
        loggedIn: true
      });
    }
  }

  _onClickMinimalize() {

  }

  render() {
    const { currentUser, userProfile } = this.props;

    const {loggedIn} = this.state;
    return (
      <div className="">
        <div className="col-xs-6">
          <a href="/">
            <div className="main-logo">
              <h2>theLeader.io</h2>
              <h3>Strive for GREAT Leadership</h3>
            </div>
          </a>
        </div>
        <div className="col-xs-6 pull-right">
          <div className="account-info">
            <ul className="nav navbar-top-links navbar-right">
              { currentUser ? (
                <li id="fat-menu" className="dropdown" style={{marginRight: 0}}>
                  <a id="user-info" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                     aria-haspopup="true" aria-expanded="false">
                  <span>
                    {userProfile && (
                      <img
                        src={ userProfile.getPicture() }
                        className="img-rounded"
                        width="32"
                        height="32"
                      />
                    )}
                  </span>
                    <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="user-info">
                    <li><a href={FlowRouter.url('app.preferences')}>Edit profile</a></li>
                    <li><a href={FlowRouter.url('app.dashboard')}>Dashboard</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href={FlowRouter.url('app.logout')}>Sign out</a></li>
                  </ul>
                </li>
              ) : (
                <li>
                  <a href={FlowRouter.url('SignInPage', {action: 'account'})}>
                    <i className="fa fa-sign-in"></i> Sign in
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default TopNav;
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
    const {navClass = "row border-bottom", imageUrl="/img/default-profile-pic.png", name} = this.props;
    const {loggedIn} = this.state;
    return (
      <div className={navClass}>
        <div className="col-md-6 col-sm-6">
          <a href="/">
            <div className="main-logo">
              <h2>theLeader.io</h2>
              <h3>Strive for GREAT Leadership</h3>
            </div>
          </a>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="account-info">
            <ul className="nav navbar-top-links navbar-right">
              {(loggedIn) && (
                <li id="fat-menu" className="dropdown">
                  <a id="user-info" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                     aria-haspopup="true" aria-expanded="false">
                  <span>
                      <img
                        src={imageUrl || '/img/default-profile-pic.png'}
                        className="img-rounded"
                        width="32"
                        height="32"
                      />
                  </span>
                    {" "}
                    {name}
                    <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="user-info">
                    <li><a href={FlowRouter.url('app.profile')}>Edit profile</a></li>
                    <li><a href={FlowRouter.url('app.dashboard')}>Dashboard</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href={FlowRouter.url('app.logout')}>Sign out</a></li>
                  </ul>
                </li>
              )}
              {(!loggedIn) && (
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
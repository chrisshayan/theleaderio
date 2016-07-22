import React, {Component} from 'react';

class TopNav extends Component {

  _onClickMinimalize() {

  }

  render() {
    return (
      <div className="row border-bottom">
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
            <ul className="nav navbar-nav navbar-right">
              <li id="fat-menu" className="dropdown">
                <a id="user-info" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                   aria-haspopup="true" aria-expanded="false">
                  <span>
                      <img
                        src="https://avatars1.githubusercontent.com/u/4226119?v=3&s=460"
                        className="img-rounded"
                        width="32"
                        height="32"
                      />
                  </span>
                  {" "}
                  Chris Shayan
                  <span className="caret"></span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="user-info">
                  <li><a href={FlowRouter.url('app.dashboard')}>Dashboard</a></li>
                  <li><a href={FlowRouter.url('app.profile.edit', {action: 'edit'})}>Edit profile</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href={FlowRouter.url('app.logout')}>Sign out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default TopNav;
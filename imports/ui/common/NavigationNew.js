import React, {Component} from 'react';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';

export class Navigation extends Component {
  constructor() {
    super();

    this.state = {
      menuItems: [
        {
          route: 'app.dashboard',
          path: FlowRouter.url('app.dashboard'),
          label: 'Dashboard',
          icon: 'fa fa-dashboard'
        },
        {
          route: 'app.preferences',
          path: FlowRouter.url('app.preferences'),
          label: 'Preferences',
          icon: 'fa fa-gears'
        },
        {
          route: 'app.organizations',
          path: FlowRouter.url('app.organizations'),
          label: 'Organizations',
          icon: 'fa fa-sitemap'
        },
        {
          route: 'app.feedback',
          path: FlowRouter.url('app.feedback'),
          label: 'Feedback',
          icon: 'fa fa-gift'
        },
        {
          route: 'app.referrals',
          path: FlowRouter.url('app.referrals'),
          label: 'Referrals',
          icon: 'fa fa-users'
        },
        {
          route: 'app.articles',
          path: FlowRouter.url('app.articles'),
          label: 'Articles',
          icon: 'fa fa-newspaper-o'
        },
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAdmin !== nextProps.isAdmin) {
      let menuItems = this.state.menuItems;
      if (nextProps.isAdmin) {
        this.setState({
          menuItems: [
            ...menuItems,
            {
              route: 'admin.management',
              path: FlowRouter.url('admin.management'),
              label: 'Admin',
              icon: 'fa fa-user-md'
            }
          ]
        })
        ;
      }
    }
  }

  componentDidMount() {
    $('#side-menu').metisMenu();
  }

  render() {
    const
      {activeRoute, userProfile} = this.props,
      {menuItems} = this.state
      ;
    let
      name = "",
      jobTitle = "",
      avatar = ""
      ;

    if (!_.isEmpty(userProfile)) {
      const {firstName, lastName, title, imageUrl} = userProfile;
      name = `${firstName} ${lastName}`;
      jobTitle = title;
      avatar = imageUrl;
    }

    return (
      <nav className="navbar-default navbar-static-side" role="navigation" style={{position: 'fixed'}}>
        <div className="sidebar-collapse">
          <a className="close-canvas-menu"><i className="fa fa-times"></i></a>
          <ul className="nav" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element">
                <span>
                  <ProfilePhoto
                    imageUrl={avatar}
                    imageClass="img-circle"
                    width={50}
                    height={50}
                  />
                </span>
                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <span className="clear"> <span className="block m-t-xs" style={{textTransform: 'capitalize'}}>
                    <strong className="font-bold">{name}</strong>
                  </span>
                    <span className="text-muted text-xs block" style={{textTransform: 'capitalize'}}>{jobTitle}<b className="caret"></b>
                    </span>
                  </span>
                </a>
                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li><a href={FlowRouter.url('app.logout')}>Sign out</a></li>
                </ul>
              </div>
              <div className="logo-element">
                TL+
              </div>
            </li>
            {menuItems.map((menu, key) => (
              <li key={key} className={menu.route == activeRoute ? 'active' : ''}>
                <a href={menu.path}>
                  <i className={menu.icon}></i>
                  <span className="nav-label">{menu.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}
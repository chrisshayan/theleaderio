import {FlowRouter} from 'meteor/kadira:flow-router';
import React, {Component} from 'react';

class Navigation extends Component {

  constructor() {
    super();

    this.state = {
      menuItems: [
        {
          route: 'app.dashboard',
          path: FlowRouter.url('app.dashboard'),
          label: 'Dashboard',
          icon: 'fa fa-dashboard'},
        {
          route: 'app.preferences',
          path: FlowRouter.url('app.preferences'),
          label: 'Preferences',
          icon: 'fa fa-gears'},
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
          route: 'app.articles',
          path: FlowRouter.url('app.articles'),
          label: 'Articles',
          icon: 'fa fa-newspaper-o'
        },
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.isAdmin !== nextProps.isAdmin) {
      let menuItems = this.state.menuItems;
      if(nextProps.isAdmin) {
        menuItems.push({route: 'admin.jobs', path: FlowRouter.url('admin.jobs'), label: 'Admin', icon: 'fa fa-user-md'});
        this.setState({
          menuItems
        });
      }
    }
  }

  render() {
    const {activeRoute, isAdmin} = this.props;

    return (
      <nav id="left-nav" className="left-nav">
        <a href="#" className="logo">L+</a>
        <ul>
          {this.state.menuItems.map((menu, key) => (
            <li key={key} className={menu.route == activeRoute ? 'active' : ''}>
              <a href={menu.path}>
                <i className={menu.icon}></i>
                <span>{menu.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Navigation;
import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';

import {DOMAIN} from '/imports/startup/client/routes';

export class TopNavFull extends Component {

  _minimalizeNavBar() {
    event.preventDefault();

    // Toggle special class
    $("body").toggleClass("mini-navbar");

    // Enable smoothly hide/show menu
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(
        function () {
          $('#side-menu').fadeIn(400);
        }, 200);
    } else if ($('body').hasClass('fixed-sidebar')) {
      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(400);
        }, 100);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  }

  render() {
    const
      homePageUrl = `http://${DOMAIN}`,
      userId = Meteor.userId()
      ;
    return (
      <nav className="navbar navbar-static-top" role="navigation">
        <div className="navbar-header">
          <button aria-controls="navbar" aria-expanded="false" data-target="#navbar" data-toggle="collapse"
                  className="navbar-toggle collapsed" type="button">
            <i className="fa fa-reorder"></i>
          </button>
          <a href={homePageUrl} className="navbar-brand">theLeader.io</a>
        </div>
        <div className="navbar-collapse collapse" id="navbar">
          <ul className="nav navbar-nav">
            <li className="active">
              <a aria-expanded="false" role="button" href={homePageUrl}> Strive for GREAT Leadership</a>
            </li>
          </ul>
          {!_.isEmpty(userId) ? (
              <ul className="nav navbar-top-links navbar-right">
                <li>
                  <a href={FlowRouter.url('app.dashboard')}>
                    <i className="fa fa-dashboard"></i> View dashboard
                  </a>
                </li>
              </ul>
            ) : (
              <ul className="nav navbar-top-links navbar-right">
                <li>
                  <a href={FlowRouter.url('SignInPage', {action: 'account'})}>
                    <i className="fa fa-sign-in"></i> Sign in
                  </a>
                </li>
              </ul>
            )}
        </div>
      </nav>
    );
  }
}
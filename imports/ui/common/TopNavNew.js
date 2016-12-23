import React, {Component} from 'react';

export class TopNav extends Component {

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
    return (
      <div className="row border-bottom">
        <nav className="navbar navbar-static-top white-bg" role="navigation" style={{marginBottom: 0}}>
          <div className="navbar-header">
            <a id="navbar-minimalize"
               ref="navbarMinimalize"
               className="minimalize-styl-2 btn btn-primary "
               onClick={this._minimalizeNavBar.bind(this)}
            >
              <i className="fa fa-bars"></i>
            </a>
            <form role="search" className="navbar-form-custom" action="search_results">
              <div className="form-group">
                <input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search"/>
              </div>
            </form>
          </div>
          <ul className="nav navbar-top-links navbar-right">
            <li>
              <a href="#">
                <i className="fa fa-sign-out"></i> Log out
              </a>
            </li>

          </ul>

        </nav>
      </div>
    );
  }
}
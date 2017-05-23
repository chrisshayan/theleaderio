import React, {Component} from 'react';

// components
import {TopNavFull} from '/imports/ui/common/TopNavFull';
import {Footer} from '/imports/ui/common/Footer';

export class MainLayoutFull extends Component {
  render() {
    const {
      showSignIn = true,
      showDashboard = true,
      content = () => null,
      bgClass = 'white-bg'
    } = this.props;
    return (
      <div className="top-navigation">
        <div id="wrapper">
          <div id="page-wrapper" className={bgClass}>
            <div className="row border-bottom white-bg">
              <TopNavFull
                showSignIn={showSignIn}
                showDashboard={showDashboard}
              />
            </div>

            {content()}

            <Footer fixed={true}/>
          </div>
        </div>
      </div>
    );
  }
}
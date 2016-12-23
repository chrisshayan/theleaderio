import React, {Component} from 'react';

// components
import {TopNavFull} from '/imports/ui/common/TopNavFull';
import {Footer} from '/imports/ui/common/Footer';

export class MainLayoutFull extends Component {
  render() {
    const {content = () => null} = this.props;
    return (
      <div className="top-navigation">
        <div id="wrapper">
          <div id="page-wrapper" className="white-bg">
            <div className="row border-bottom">
              <TopNavFull />
            </div>

            {content()}

            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
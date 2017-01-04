import React, {Component} from 'react';

// components
import {TopNavFull} from '/imports/ui/common/TopNavFull';
import {Footer} from '/imports/ui/common/Footer';

export class MainLayoutFull extends Component {
  render() {
    const {
      content = () => null,
      bgClass = 'white-bg'
    } = this.props;
    return (
      <div className="top-navigation">
        <div id="wrapper">
          <div id="page-wrapper" className={bgClass}>
            <div className="row border-bottom white-bg">
              <TopNavFull />
            </div>

            {content()}

            <Footer fixed={true}/>
          </div>
        </div>
      </div>
    );
  }
}
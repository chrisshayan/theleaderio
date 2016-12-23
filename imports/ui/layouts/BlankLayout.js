import React, {Component} from 'react';

export default class BlankLayout extends Component {
  render() {
    const {content = () => null} = this.props;
    return (
      <div className="top-navigation">
        <div id="wrapper">
          <div id="page-wrapper" className="gray-bg">
            {content()}
          </div>
        </div>
      </div>
    );
  }
}
import React, { Component } from 'react';

export default class CardDescription extends Component {
  render() {
    const {cardTitle, cardContent, height} = this.props;
    return (
      <div className="ibox float-e-margins" style={{marginBottom: 18}}>
        <div className="ibox-title">
          <h5>{cardTitle}</h5>
        </div>
        <div className="ibox-content" style={{height}}>
          <div>
            {cardContent}
          </div>
        </div>
      </div>
    );
  }
}
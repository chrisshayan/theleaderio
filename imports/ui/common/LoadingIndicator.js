import React, { Component } from 'react';

export default class LoadingIndicator extends Component {
  render() {
    return (
      <div className="sk-spinner sk-spinner-chasing-dots">
        <div className="sk-dot1"></div>
        <div className="sk-dot2"></div>
      </div>
    );
  }
}
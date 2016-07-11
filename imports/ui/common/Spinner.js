import React, { Component } from 'react';

export default class Spinner extends Component {
  render() {
    const { message = 'Loading ...' } = this.props;
    return (
      <div className="middle-box text-center animated fadeInDown">
        <div>
          <h3>{message}</h3>
        </div>
        <div className="sk-spinner sk-spinner-chasing-dots">
          <div className="sk-dot1"></div>
          <div className="sk-dot2"></div>
        </div>
      </div>
    );
  }
}
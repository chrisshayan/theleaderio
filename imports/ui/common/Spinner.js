import React, { Component } from 'react';

export default class Spinner extends Component {
  render() {
    return (
      <div>
        <div class="sk-spinner sk-spinner-chasing-dots">
          <div class="sk-dot1"></div>
          <div class="sk-dot2"></div>
        </div>
      </div>
    );
  }
}
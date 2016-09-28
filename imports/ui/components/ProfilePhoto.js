import React, {Component} from 'react';

// constants
import {DEFAULT_PROFILE_PHOTO} from '/imports/utils/defaults';

export default class ProfilePhoto extends Component {
  render() {
    const {imageUrl, imageClass = 'img-circle', width = 200, height = 200} = this.props;
    return (
        <img
          src={!!imageUrl ? imageUrl : DEFAULT_PROFILE_PHOTO}
          alt="profile photo"
          className={imageClass}
          style={{
          width,
          height,
          margin: '0 auto'
        }}
        />
    );
  }
}
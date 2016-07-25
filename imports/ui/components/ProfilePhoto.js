import React, {Component} from 'react';

export default class ProfilePhoto extends Component {
  render() {
    const defaultPhoto = '/img/default-profile-pic.png';
    const {imageUrl, imageClass = 'img-circle', width = 200, height = 200} = this.props;
    return (
        <img
          src={!!imageUrl ? imageUrl : defaultPhoto}
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
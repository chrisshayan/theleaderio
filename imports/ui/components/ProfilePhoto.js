import React, {Component} from 'react';

export default class ProfilePhoto extends Component {
  render() {
    const defaultPhoto = '/img/default-profile-pic.png';
    const {imageUrl, width = 100, height = 100} = this.props;
    return (
      <div
        className="img-circle"
        style={{
          width,
          height,
          background: `url(${!!imageUrl ? imageUrl : defaultPhoto}) no-repeat`,
          backgroundSize: 'cover',
          margin: '0 auto'
        }}
      />
    );
  }
}
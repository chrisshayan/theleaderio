import React, {Component} from 'react';

export default class ProfilePhoto extends Component {
  render() {
    const defaultPhoto = '/img/default-profile-pic.png';
    const {imageUrl, width = 100, height = 100} = this.props;
    return (
      <div>
        <img
          src={!!imageUrl ? imageUrl : defaultPhoto}
          alt="profile photo"
          className="img-circle"
          style={{
          width,
          height,
          margin: '0 auto'
        }}
        />
      </div>
    );
  }
}
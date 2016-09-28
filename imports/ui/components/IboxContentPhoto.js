import React, {Component} from 'react';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';

export default class IboxContentProfilePhoto extends Component {
  render() {
    const {imageClass, imageUrl, width, height} = this.props;
    return (
      <div className="ibox-content">
        <ProfilePhoto
          imageClass={imageClass}
          imageUrl={imageUrl}
          width={width}
          height={height}
        />
      </div>
    );
  }
}
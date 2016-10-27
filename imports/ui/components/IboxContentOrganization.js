import React, {Component} from 'react';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';

// constants
import {DEFAULT_ORGANIZATION_PHOTO} from '/imports/utils/defaults';

export default class IboxContentOrganization extends Component {
  render() {
    const {
      imageUrl,
      imageClass,
      dataClass,
      imageWidth = 100, 
      imageHeight = 100
    } = this.props;
    
    const {
      title,
      name,
      isPresent,
      startTime,
      endTime,
      noEmployees
    } = this.props.data;
    return (
      <div className="ibox-content">
        <div className="row">
          <div className={imageClass}>
            <ProfilePhoto
              imageClass='img-thumbnail'
              imageUrl={imageUrl || DEFAULT_ORGANIZATION_PHOTO}
              width={imageWidth}
              height={imageHeight}
            />
          </div>
          <div className={dataClass}>
            <h4>{title}</h4>
            <p className="stats-label">{name}</p>
            <span className="vertical-date">
              <small>{startTime} {' - '} {isPresent ? "Current" : endTime}</small>
            </span>
            {(noEmployees > 0) && (
              <p className="stats-label" style={{marginTop: 10}}>
                <strong>{noEmployees}</strong> Employees
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
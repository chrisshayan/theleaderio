import React, {Component} from 'react';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';

export default class IboxContentOrganization extends Component {
  render() {
    const {title, name, startTime, endTime, noEmployees, overallPercent, imageUrl} = this.props;
    return (
      <div className="ibox-content">
        <div className="row">
          <div className="col-md-4">
            <ProfilePhoto
              imageClass='img-thumbnail'
              imageUrl={imageUrl}
              width={220}
              height={220}
            />
          </div>
          <div className="col-md-8">
            <h4>{title}</h4>
            <p className="stats-label">{name}</p>
            <span className="vertical-date">
              <small>{startTime} {' - '} {endTime}</small>
            </span>
            {(noEmployees > 0) && (
              <p className="stats-label" style={{marginTop: 10}}>
                <strong>{noEmployees}</strong> Employees
              </p>
            )}
            <p className="stats-label">Overall</p>
            <div className="stat-percent">{overallPercent}</div>
            <div className="progress progress-mini">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
import React, {Component} from 'react';

export default class Information extends Component {

  render() {
    const {
      logo = 'TL+',
      message = 'Thank you',
      description = 'Our Vision in theLeader.io is to help leaders like you to become a better leader. '
    } = this.props;

    return (
      <div className="middle-box text-center animated fadeInDown">
        <div>
          <div>
            <h1 className="logo-name">{ logo }</h1>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="ibox-content">
                <h2 className="font-bold">{ message }</h2>
                <p>
                  { description }
                </p>
              </div>
            </div>
          </div>
          <p className="m-t text-center">
            <small>theLeader.io, strive for great leadership &copy; 2016</small>
          </p>
        </div>
      </div>
    );
  }
}
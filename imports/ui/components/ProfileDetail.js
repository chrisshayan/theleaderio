import React, {Component} from 'react';

export default class ProfileDetail extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h5>Profile Detail</h5>
        </div>
        <div>
          <div className="ibox-content no-padding border-left-right">
            <img alt="image" className="img-responsive" src="img/profile_big.jpg"/>
          </div>
          <div className="ibox-content profile-content">
            <h4><strong>Monica Smith</strong></h4>
            <p><i className="fa fa-map-marker"></i> Riviera State 32/106</p>
            <h5>
              About me
            </h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitat.
            </p>
            <div className="row m-t-lg">
              <div className="col-md-4">
                <span className="bar">5,3,9,6,5,9,7,3,5,2</span>
                <h5><strong>169</strong> Posts</h5>
              </div>
              <div className="col-md-4">
                <span className="line">5,3,9,6,5,9,7,3,5,2</span>
                <h5><strong>28</strong> Following</h5>
              </div>
              <div className="col-md-4">
                <span className="bar">5,3,2,-1,-3,-2,2,3,5,2</span>
                <h5><strong>240</strong> Followers</h5>
              </div>
            </div>
            <div className="user-button">
              <div className="row">
                <div className="col-md-6">
                  <button type="button" className="btn btn-primary btn-sm btn-block"><i className="fa fa-envelope"></i> Send Message</button>
                </div>
                <div className="col-md-6">
                  <button type="button" className="btn btn-default btn-sm btn-block"><i className="fa fa-coffee"></i> Buy a coffee</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
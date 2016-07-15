import React, {Component} from 'react';

export default class Activities extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h5>Activites (not implemented)</h5>
        </div>
        <div className="ibox-content">
          <div>
            <div className="feed-activity-list">

              <div className="feed-element">
                <a href="#" className="pull-left">
                  <img alt="image" className="img-circle" src="img/a1.jpg"/>
                </a>
                <div className="media-body ">
                  <small className="pull-right text-navy">1m ago</small>
                  <strong>Sandra Momot</strong> started following <strong>Monica Smith</strong>. <br/>
                  <small className="text-muted">Today 4:21 pm - 12.06.2014</small>
                  <div className="actions">
                    <a className="btn btn-xs btn-white"><i className="fa fa-thumbs-up"></i> Like </a>
                    <a className="btn btn-xs btn-danger"><i className="fa fa-heart"></i> Love</a>
                  </div>
                </div>
              </div>

              <div className="feed-element">
                <a href="#" className="pull-left">
                  <img alt="image" className="img-circle" src="img/profile.jpg"/>
                </a>
                <div className="media-body ">
                  <small className="pull-right">5m ago</small>
                  <strong>Monica Smith</strong> posted a new blog. <br/>
                  <small className="text-muted">Today 5:60 pm - 12.06.2014</small>
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-block m"><i className="fa fa-arrow-down"></i> Show More</button>
          </div>
        </div>
      </div>
    );
  }
}
import React, {Component} from 'react';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// components
import CreateArticle from '/imports/ui/containers/articles/EditArticle';

export default class Articles extends Component {
  constructor() {
    super();

    const
      actions = (
        <a href={FlowRouter.url('app.articles.create')} className="btn btn-primary">
          <i className="fa fa-plus"/>
          {' '}
          Create Article
        </a>
      )
      ;

    setPageHeading({
      title: 'Articles',
      breadcrumb: [{
        label: 'Articles',
        active: true
      }],
      actions
    });
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  render() {
    return (
      <div className="row animated fadeInRight">
        <div className="col-md-8">
          <div className="ibox float-e-margins" style={{marginBottom: 10}}>
            <div className="ibox-title">
              <h5>Leadership in action</h5>
              <div className="ibox-tools">
                <a href="/app/articles/edit/abdc" className="btn btn-white btn-xs">
                  <i className="fa fa-pencil-square-o"></i>
                  Edit
                </a>
              </div>
            </div>
            <div className="feed-activity-list">
              <div className="feed-element no-padding">
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
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitat.
                  </p>
                  <div className="user-button">
                    <div className="row">
                      <div className="col-md-2 text-right">
                        <a type="button" className="btn btn-primary btn-sm btn-block"><i
                          className="fa fa-thumbs-up"></i> Like it
                        </a>
                      </div>
                      <div className="col-md-2 text-left" style={{paddingLeft: 0}}>
                        <a href="/app/articles/view/abcd" type="button" className="btn btn-info btn-sm btn-block ">Read more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
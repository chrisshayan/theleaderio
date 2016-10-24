import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Articles} from '/imports/api/articles/index';

class ViewArticle extends Component {
  constructor() {
    super();

    const
      _id = FlowRouter.getParam("_id")
      ;
    setPageHeading({
      title: 'View article',
      breadcrumb: [
        {
          label: 'Articles',
          route: FlowRouter.url('app.articles')
        },
        {
          label: 'view',
          active: true
        }]
    });
  }

  componentWillUnmoun() {
    resetPageHeading();
  }

  _createMarkup({content}) {
    return {__html: content};
  }

  render() {
    const
      {ready, article} = this.props

    if (ready) {
      return (
        <div className="col-lg-10 col-lg-offset-1">
          <div className="ibox">
            <div className="ibox-content" style={{padding: 40}}>
              <div className="pull-right">
                <button className="btn btn-white btn-xs" type="button">Purpose</button>
                <button className="btn btn-white btn-xs" type="button">Leadership</button>
                <button className="btn btn-white btn-xs" type="button">Engagement</button>
              </div>
              <div className="text-center article-title">
                <span className="text-muted"><i className="fa fa-clock-o"></i> October 18, 2016</span>

                <h1>
                  Employee Engagement Framework
                </h1>
              </div>
              {!!article.content && (
                <div dangerouslySetInnerHTML={this._createMarkup({content: article.content})}/>
              )}
              <div className="hr-line-dashed"/>
              <div className="row">
                <div className="col-md-6">
                  <h5>Tags:</h5>
                  <button className="btn btn-primary btn-xs" type="button">Model</button>
                  <button className="btn btn-white btn-xs" type="button">Publishing</button>
                </div>
                <div className="col-md-6">
                  <div className="small text-right">
                    <h5>Stats:</h5>

                    <div><i className="fa fa-thumbs-o-up"> </i> 56 likes</div>
                    <i className="fa fa-eye"> </i> 144 views
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

export default ViewArticleContainer = createContainer((params) => {
  const
    {_id} = params,
    sub = Meteor.subscribe('articles'),
    ready = sub.ready(),
    article = Articles.findOne({_id})
    ;

  return {
    ready,
    article
  };

}, ViewArticle);
import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Articles} from '/imports/api/articles/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';
import CopyRight from '/imports/ui/common/Copyright';
import TopNav from '/imports/ui/common/TopNav';

// methods
import * as ArticleActions from '/imports/api/articles/methods';

class ViewArticle extends Component {
  constructor() {
    super();

    const
      seoUrl = FlowRouter.getQueryParam("seoUrl"),
      _id = FlowRouter.getQueryParam("_id")
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

  _onLikeArticle() {
    const {_id} = this.props.article;
    ArticleActions.like.call({_id});
  }

  _onUnlikeArticle() {
    const {_id} = this.props.article;
    ArticleActions.unlike.call({_id});
  }

  render() {
    const
      userId = Meteor.userId(),
      {ready, article} = this.props
      ;
    if (ready) {
      if (!_.isEmpty(article)) {
        const
          {
            tags,
            createdAt,
            subject,
            content,
            likes = [],
            noOfLikes = likes.length
          } = article
          ;
        return (
          <div className="row">
            <div className="col-md-10 col-md-offset-1 col-xs-12">
              <div className="ibox float-e-margins">
                <div className="ibox-content" style={{padding: 40}}>
                  <div className="pull-right">
                    {tags.map(tag => (
                      <button key={tag} className="btn btn-white btn-xs" type="button">{tag}</button>
                    ))}
                  </div>
                  <div className="text-center article-title">
                      <span className="text-muted"><i
                        className="fa fa-clock-o"></i>{" "}{moment(createdAt).format('MMMM Do, YYYY')}</span>

                    <h1>
                      {subject}
                    </h1>
                  </div>
                  {!!content && (
                    <div dangerouslySetInnerHTML={this._createMarkup({content})}/>
                  )}
                  <div className="hr-line-dashed"/>
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Stats:</h5>
                      {(_.indexOf(likes, userId) === -1) ? (
                        <button className="btn btn-primary btn-xs" type="button"
                                onClick={this._onLikeArticle.bind(this)}
                        ><i className="fa fa-thumbs-o-up"></i>{" "}{Number(noOfLikes)} likes
                        </button>
                      ) : (
                        <button className="btn btn-primary btn-xs" type="button"
                                onClick={this._onUnlikeArticle.bind(this)}
                        ><i className="fa fa-thumbs-up"></i>{" "}{Number(noOfLikes)} likes
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <NoticeForm
              code='404'
              message='Article Not Found'
              description='Sorry, but the article you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
              buttonLabel='Come back to HomePage'
              redirectUrl='/'
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          <Spinner/>
        </div>
      );
    }
  }
}

export default ViewArticleContainer = createContainer((params) => {
  const
    {_id} = params,
    sub = Meteor.subscribe('articles.public'),
    ready = sub.ready(),
    article = Articles.findOne({_id})
    ;

  return {
    ready,
    article
  };

}, ViewArticle);
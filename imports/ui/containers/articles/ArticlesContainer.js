import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Articles} from '/imports/api/articles/index';

// components
import ArticleBox from '/imports/ui/containers/articles/ArticleBox';
import NoArticle from '/imports/ui/containers/articles/NoArticle';

class ArticlesComponent extends Component {
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
    const
      {ready, articles} = this.props
      ;

    console.log(this.props)
    if (ready) {
      if (!_.isEmpty(articles)) {
        return (
          <div className="row animated fadeInRight">
            <div className="col-md-8">
              {articles.map(article => (
                <ArticleBox
                  key={article._id}
                  article={article}
                />
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <NoArticle />
          </div>
        );
      }
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

export default ArticlesContainer = createContainer((params) => {
  const
    sub = Meteor.subscribe("articles"),
    ready = sub.ready(),
    articles = Articles.find().fetch()
    ;

  return {
    ready,
    articles
  };
}, ArticlesComponent);
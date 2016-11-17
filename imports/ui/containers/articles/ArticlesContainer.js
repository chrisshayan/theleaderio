import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Articles, STATUS} from '/imports/api/articles/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import ArticleBox from '/imports/ui/containers/articles/ArticleBox';
import NoArticle from '/imports/ui/components/NoContent';

// methods
import {verifyAdminRole} from '/imports/api/users/methods';

class ArticlesComponent extends Component {
  constructor() {
    super();

    this.state = {
      isAdmin: false
    };
  }

  componentWillMount() {
    const
      actions = (
        <a href={FlowRouter.url('app.articles.create')} className="btn btn-primary">
          <i className="fa fa-plus"/>
          {' '}
          Create Article
        </a>
      )
      ;
    this.setState({
      isAdmin: false
    });
    if (!!Meteor.userId()) {
      verifyAdminRole.call({userId: Meteor.userId()}, (error, result) => {
        if (!error) {
          if(result.isAdmin) {
            setPageHeading({
              title: 'Articles',
              breadcrumb: [{
                label: 'Articles',
                active: true
              }],
              actions
            });
          } else {
            setPageHeading({
              title: 'Articles',
              breadcrumb: [{
                label: 'Articles',
                active: true
              }]
            });
          }
          this.setState({
            isAdmin: result.isAdmin
          });
        }
      });
    }
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  render() {
    const
      {isAdmin} = this.state,
      {ready, articles} = this.props
      ;

    // console.log(this.state)
    if (ready) {
      if (!_.isEmpty(articles)) {
        return (
          <div className="row animated fadeInRight">
            <div className="col-md-8">
              {articles.map(article => (
                <ArticleBox
                  key={article._id}
                  article={article}
                  allowEdit={isAdmin}
                />
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <NoArticle
              icon="fa fa-newspaper-o"
              message="There is no article."
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
  }
}

export default ArticlesContainer = createContainer((params) => {
  const
    sub = Meteor.subscribe("articles"),
    ready = sub.ready(),
    query = {status: STATUS.ACTIVE},  // not implemented yet
    options = {
      sort: {
        createdAt: -1
      }
    },
    articles = Articles.find({}, options).fetch()
    ;

  return {
    ready,
    articles
  };
}, ArticlesComponent);
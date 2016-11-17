import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Articles} from '/imports/api/articles/index';

// components
import SummerNoteEditor from '/imports/ui/components/SummerNoteEditor';
import FormChosen from '/imports/ui/components/FormChosen';

// methods
import * as ArticleActions from '/imports/api/articles/methods';
import * as Notifications from '/imports/api/notifications/methods';

// functions
import {encodeKeyword} from '/imports/utils/urlBuilder';

// constants
import {DEFAULT_METRICS} from '/imports/utils/defaults';

class EditArticle extends Component {
  constructor() {
    super();

    const
      _id = FlowRouter.getQueryParam("_id")
      ;
    setPageHeading({
      title: !_id ? 'Create new article' : 'Edit article',
      breadcrumb: [
        {
          label: 'Articles',
          route: FlowRouter.url('app.articles')
        },
        {
          label: !_id ? 'create' : 'edit',
          active: true
        }]
    });

    this.state = {
      articleId: _id,
      subject: "",
      error: ""
    };
  }

  componentWillUpdate(nextState) {
    const
      {error, subject} = nextState;
    if (!_.isEmpty(error)) {
      const
        closeButton = true,
        title = "Article",
        message = error
        ;
      Notifications.error.call({closeButton, title, message});
    }

  }

  componentWillUnmount() {
    resetPageHeading();
  }

  _editArticle({status, data}) {
    const
      {articleId} = this.state,
      {subject, content, tags, seoUrl} = data
      ;
    let
      articleStatus = ""
      ;
    switch (status) {
      case "save": {
        articleStatus = "ACTIVE";
        break;
      }
      case "draft": {
        articleStatus = "DRAFT";
        break;
      }
      default: {
        return this.setState({
          error: `Unknown Action ${action}`
        });
      }
    }

    if (!articleId) {
      // console.log(`create new article as ${action}`)
      ArticleActions.create.call({
        subject,
        content,
        tags,
        status: articleStatus,
        seoUrl
      }, (error, _id) => {
        if (!error) {
          const
            closeButton = true,
            title = "Article",
            message = "Saved"
            ;
          Notifications.success.call({closeButton, title, message});
          // route to view article
          FlowRouter.go('app.articles.action', {action: 'view', seoUrl}, {_id});
        } else {
          const
            closeButton = true,
            title = "Article",
            message = error.reason
            ;
          Notifications.error.call({closeButton, title, message});
        }
      });
    } else {
      // console.log(`update article ${articleId} as ${action}`)
      ArticleActions.edit.call({
        _id: articleId,
        subject,
        content,
        tags,
        status: articleStatus
      }, (error) => {
        if (!error) {
          const
            closeButton = true,
            title = "Article",
            message = "Saved"
            ;
          Notifications.success.call({closeButton, title, message});
        } else {
          const
            closeButton = true,
            title = "Article",
            message = error.reason
            ;
          Notifications.error.call({closeButton, title, message});
        }
      });
    }
    // console.log({subject, content, tags, articleStatus})
  }

  _getArticleData() {
    const
      {articleId} = this.state,
      articleData = {
        subject: this.refs.subject.value,
        content: this.refs.summernote.getContent() || "",
        tags: this.refs.selectedTags.getValue() || []
      }
      ;

    if (typeof articleId === "undefined") {
      articleData.seoUrl = encodeKeyword(articleData.subject.toLowerCase())
    }

    return articleData;
  }

  _onSaveAsDraft() {
    this._editArticle({status: "draft", data: this._getArticleData()});
    // console.log(this._getArticleData())
  }

  _onSave() {
    this._editArticle({status: "save", data: this._getArticleData()});
    // console.log(this._getArticleData())
  }

  _onDelete() {
    const
      {articleId} = this.state;

    if(!articleId) {
      FlowRouter.go('app.articles.create');
    } else {
      ArticleActions.discard.call({_id: articleId}, (error, result) => {
        if (!error) {
          const
            closeButton = true,
            title = "Article",
            message = "Discarded"
            ;
          Notifications.success.call({closeButton, title, message});
          FlowRouter.go('app.articles');
        } else {
          const
            closeButton = true,
            title = "Article",
            message = error.reason
            ;
          Notifications.error.call({closeButton, title, message});
        }
      });
    }
  }

  render() {
    const
      {ready, article} = this.props,
      action = FlowRouter.getParam("action"),
      seoUrl = FlowRouter.getParam("seoUrl"),
      _id = FlowRouter.getQueryParam("_id"),
      chosenTags = []
      ;

    // get chosenTags values
    DEFAULT_METRICS.map((value, key) => {
      chosenTags.push({
        _id: key,
        name: value
      });
    });

    if (ready) {
      return (
        <div className="col-md-10 white-bg">
          <div className="mail-body" style={{borderTopWidth: 0}}>
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-1 control-label text-left">Subject:</label>
                <div className="col-sm-11" style={{paddingRight: 0}}>
                  <input ref="subject" type="text" className="form-control"
                         defaultValue={!_.isEmpty(article) ? article.subject : ""}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-1 control-label text-left">Tags:</label>
                <div className="col-sm-11" style={{paddingRight: 0}}>
                  <FormChosen
                    ref="selectedTags"
                    placeHolder="Select tags ..."
                    options={chosenTags}
                    selectedElements={!_.isEmpty(article) ? article.tags : []}
                    isMultiple={true}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="clearfix"></div>
          <div className="mail-text">
            <SummerNoteEditor
              ref="summernote"
              content={!_.isEmpty(article) ? article.content : "<p>write your article ...</p>"}
              height={350}
            />
          </div>
          <div className="mail-body text-right" style={{borderTopWidth: 0}}>
            <a
              ref="save"
              className="btn btn-sm btn-primary"
              onClick={this._onSave.bind(this)}
            >
              <i className="fa fa-floppy-o"></i> Save</a>
            {" "}
            <a
              ref="draft"
              className="btn btn-white btn-sm"
              onClick={this._onSaveAsDraft.bind(this)}
            >
              <i className="fa fa-pencil"></i> Draft</a>
            {" "}
            <a
              ref="delete"
              className="btn btn-danger btn-sm"
              onClick={this._onDelete.bind(this)}
            >
              <i className="fa fa-times"></i> Discard</a>
          </div>
          <div className="clearfix"></div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

export default EditArticleContainer = createContainer((params) => {
  const
    {_id} = params
    ;
  if (!_id) {
    return {
      ready: true
    };
  } else {
    const
      sub = Meteor.subscribe('articles'),
      ready = sub.ready(),
      article = Articles.findOne({_id})
      ;

    return {
      ready,
      article
    };
  }
}, EditArticle);
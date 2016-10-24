import React, {Component} from 'react';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// components
import SummerNoteEditor from '/imports/ui/components/SummerNoteEditor';

// methods
import {add as addArticle} from '/imports/api/articles/methods';

export default class EditArticle extends Component {
  constructor() {
    super();

    const
      _id = FlowRouter.getParam("_id")
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
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  _onClick() {
    // console.log(this.refs.summernote.getContent())
    addArticle.call({
      subject: "Employee Engagement Framework",
      content: this.refs.summernote.getContent(),
      tags: ["purpose", "leadership", "engagement"]
    });
  }

  render() {
    return (
      <div className="col-md-10 white-bg">
        <div className="mail-body" style={{borderTopWidth: 0}}>
          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-1 control-label text-left">Subject:</label>
              <div className="col-sm-11" style={{paddingRight: 0}}>
                <input type="text" className="form-control" value=""/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-1 control-label text-left">Tags:</label>
              <div className="col-sm-11" style={{paddingRight: 0}}>
                <input type="text" className="form-control" value=""/>
              </div>
            </div>
          </form>
        </div>
        <div className="clearfix"></div>
        <div className="mail-text">
          <SummerNoteEditor
            ref="summernote"
            height={350}
          />
        </div>
        <div className="mail-body text-right" style={{borderTopWidth: 0}}>
          <a
            ref="save"
            className="btn btn-sm btn-primary"
            onClick={this._onClick.bind(this)}
          >
            <i className="fa fa-floppy-o"></i> Save</a>
          {" "}
          <a href="{{pathFor route='mailbox'}}" className="btn btn-danger btn-sm">
            <i className="fa fa-times"></i> Discard</a>
          {" "}
          <a href="{{pathFor route='mailbox'}}" className="btn btn-white btn-sm">
            <i className="fa fa-pencil"></i> Draft</a>
          {" "}
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
}
import React, {Component} from 'react';

export default class ArticleBox extends Component {
  _createMarkup({content}) {
    return {__html: content};
  }

  render() {
    const
      {
        article,
        allowEdit = true
      } = this.props,
      {
        _id,
        subject,
        content,
        tags,
        createdAt,
      } = article,
      editUrl = FlowRouter.path("app.articles.edit", {_id}),
      viewUrl = FlowRouter.path("app.articles.view", {_id})
      ;

    return (
      <div className="ibox float-e-margins" style={{marginBottom: 10}}>
        <div className="ibox-title">
          <h5>{subject}</h5>
          {allowEdit && (
            <div className="ibox-tools">
              <a href={editUrl} className="btn btn-white btn-xs">
                <i className="fa fa-pencil-square-o"></i>
                Edit
              </a>
            </div>
          )}
        </div>
        <div className="feed-activity-list">
          <div className="feed-element no-padding">
            <div className="ibox-content">
              <div className="pull-right">
                {tags.map(tag => (
                  <button key={tag} className="btn btn-white btn-xs" type="button">{tag}</button>
                ))}
              </div>
              <br/>
              <span className="text-muted"><i className="fa fa-clock-o"></i>{" "}{moment(createdAt).format('MMMM Do, YYYY')}</span>
              <div dangerouslySetInnerHTML={this._createMarkup({content})}/>
              <div className="hr-line-dashed"/>
              <div className="user-button">
                <div className="row">
                  <div className="col-md-2 text-right">
                    <a type="button" className="btn btn-primary btn-sm btn-block"><i
                      className="fa fa-thumbs-up"></i> Like it
                    </a>
                  </div>
                  <div className="col-md-2 text-left" style={{paddingLeft: 0}}>
                    <a href={viewUrl} type="button" className="btn btn-info btn-sm btn-block ">Read more
                    </a>
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
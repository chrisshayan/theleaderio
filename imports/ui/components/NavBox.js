import React, {Component} from 'react';
import moment from 'moment';

export default class NavBox extends Component {

  constructor() {
    super();

    this.state = {
      mediaId: ""
    };
  }

  _onClickMedia(mediaId) {
    this.props.onClickMedia(mediaId);
  }

  _onReadMore() {

  }

  render() {
    const
      {
        icon = "fa fa-envelope",
        label = "label label-warning",
        labelContent = 0,
        mediaBody = [],
        readMore = {
          url: "/",
          icon: "fa fa-envelope",
          message: "Read All Messages"
        }
      } = this.props;

    return (
      <li className="dropdown">
        <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
          <i className={icon}></i>
          {(labelContent > 0) ? (
            <span className={label}>{labelContent}</span>
          ) : (
            ""
          )}
        </a>
        <ul className="dropdown-menu dropdown-messages">
          {mediaBody.map(media => (
            <div key={media._id}
                 onClick={() => {this._onClickMedia(media._id);}}
            >
              <li>
                <div className="dropdown-messages-box">
                  <div className="media-body">
                    <strong>{media.message.name}</strong>
                    <br/>
                    {media.message.detail}
                    <br/>
                    <small className="text-muted">{"on "}{moment(media.date).format('MMMM Do, YYYY')}</small>
                  </div>
                </div>
              </li>
              <li className="divider"></li>
            </div>
          ))}
          <li>
            <div className="text-center link-block">
              <a href={readMore.url}>
                <i className={readMore.icon}></i> <strong>{readMore.message}</strong>
              </a>
            </div>
          </li>
        </ul>
      </li>
    );

  }
}
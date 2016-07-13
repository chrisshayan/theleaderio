import React, { Component } from 'react';

import ReactFilepicker from 'react-filepicker';

export default class UploadImage extends Component {
  // constructor() {
  //   super();
  //
  //   this.state = {
  //     imageUrl: this.props.imageUrl
  //   };
  // }

  _onSuccess(fpfiles) {
    // console.log(this.props);
    this.props.onUploadedImage(fpfiles.url);
  }

  getImageUrl() {
    return !!(this.state.imageUrl !== "") ? this.state.imageUrl : this.props.imageUrl;
  }

  render() {
    // File Picker Options
    // File Stack API key, this should be in settings with theleader.io's account
    const datFpApikey = "AIa2uMZpGStiCqHEXwVulz";
    const options = {
      buttonText: 'Upload new photo',
      buttonClass: 'btn btn-primary',
      mimetype: 'image/*',
    };
    const imgStyle = {
      width: 293
    };


    const { imageUrl } = this.props;
    return (
    <div>
      <div className="ibox-content no-padding border-left-right">
        <img alt="image" className="img-responsive img-preview img-preview-md"
              style={imgStyle}
             src={imageUrl}/>
      </div>
      <div className="ibox-content btn-group">
        <ReactFilepicker
          apikey={datFpApikey}
          defaultWidget={false}
          options={options}
          onSuccess={this._onSuccess.bind(this)}
        />
      </div>
    </div>

    );
  }
}
import React, { Component } from 'react';
import ReactFilepicker from 'react-filepicker';


export default class ButtonUpload extends Component {

  _onUploadSuccess(fpfiles) {
    const url = fpfiles.url
    this.props.onUploaded({url});
  }

  render() {
    const {
      buttonText = 'Upload new photo',
      buttonClass = 'btn btn-primary',
      mimeType = 'image/*',
      onUploaded = () => null
    } = this.props;
    const apikey = "AIa2uMZpGStiCqHEXwVulz";
    const options = {
      buttonText: buttonText,
      buttonClass: buttonClass,
      mimetype: mimeType,
    };

    return (
      <ReactFilepicker
        apikey={apikey}
        defaultWidget={false}
        options={options}
        onSuccess={this._onUploadSuccess.bind(this)}
      />
    );
  }
}
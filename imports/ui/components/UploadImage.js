import React, { Component } from 'react';

export default class UploadImage extends Component {
  render() {
    const { imageUrl } = this.props;
    return (
    <div>
      <div className="ibox-content no-padding border-left-right">
        <img alt="image" className="img-responsive" src={imageUrl}/>
      </div>
      <div className="ibox-content btn-group">
        <label title="Upload image file" for="inputImage" className="btn btn-primary">
          <input type="file" accept="image/*" name="file" id="inputImage" className="hide"/>
          Upload new image
        </label>
      </div>
    </div>

    );
  }
}
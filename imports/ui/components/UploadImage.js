import React, {Component} from 'react';
import ReactFilepicker from 'react-filepicker';

import ProfilePhoto from '/imports/ui/components/ProfilePhoto';

export default class UploadImage extends Component {

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


    const {imageUrl} = this.props;
    return (
      <div>
        <div className="ibox-content no-padding border-left-right ">
          <ProfilePhoto
            imageUrl={imageUrl}
            width={293}
            height={293}
          />
        </div>
        <div className="ibox-content btn-group">
          <div className="hr-line-dashed">
            <ReactFilepicker
              apikey={datFpApikey}
              defaultWidget={false}
              options={options}
              onSuccess={this._onSuccess.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
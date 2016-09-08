import React, {Component} from 'react';
import ReactFilepicker from 'react-filepicker';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';
import ButtonUpload from '/imports/ui/components/ButtonUpload';

export default class UploadImage extends Component {

  _onUploaded({url}) {
    // console.log(this.props);
    this.props.onUploadedImage(url);
  }

  render() {

    const {imageUrl} = this.props;
    return (
      <div>
        <div className="ibox-content no-padding border-left-right ">
          <ProfilePhoto
            imageUrl={imageUrl}
            imageClass="img-responsive"
            width={325}
            height={325}
          />
        </div>
        <div className="ibox-content form-group">
          <ButtonUpload
            buttonText='Upload new photo'
            buttonClass='btn btn-primary'
            mimeType='image/*'
            onUploaded={this._onUploaded.bind(this)}
          />
        </div>
      </div>
    );
  }
}
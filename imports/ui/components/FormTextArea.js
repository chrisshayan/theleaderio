import React, {Component} from 'react';

export default class FormTextArea extends Component {
  render() {
    const {
      label,
      type,
      placeHolder="Tell us something about you ....",
      defaultValue,
      disabled,

      height = 100,
      onTextChange = () => null
    } = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">{label}</label>
        <div className="col-sm-9">
          <textarea
            type={type}
            className="form-control"
            placeholder={placeHolder}
            defaultValue={defaultValue}
            disabled={disabled}
            style={{height}}
            onChange = {e => onTextChange(e.target.value)}
          />
        </div>
      </div>
    );
  }
}
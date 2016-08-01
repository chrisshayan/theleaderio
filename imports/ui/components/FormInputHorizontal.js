import React, { Component } from 'react';

export default class FormInputHorizontal extends Component {
  render() {
    const {
      label,
      type,
      defaultValue,
      placeHolder,
      disabled,
      onChangeText = () => null
    } = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">{label}</label>
        <div className="col-sm-9">
          <input
            type={type}
            className="form-control"
            placeholder={placeHolder}
            defaultValue={defaultValue}
            onChange={e => onChangeText(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
}
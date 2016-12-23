import React, {Component} from 'react';

export default class FormInputHorizontal extends Component {
  render() {
    const
      {
        label,
        type,
        defaultValue,
        placeHolder,
        disabled,
        required = false,
        grid = [3, 9],
        onChangeText = () => null
      } = this.props,
      labelClass = `col-md-${grid[0]} control-label`,
      inputClass = `col-md-${grid[1]}`;
      ;

    return (
      <div className="form-group">
        <label className={labelClass}>{label}</label>
        <div className={inputClass}>
          <input
            type={type}
            className="form-control"
            placeholder={placeHolder}
            value={defaultValue}
            onChange={e => onChangeText(e.target.value)}
            disabled={disabled}
            required={required}
          />
        </div>
      </div>
    );
  }
}
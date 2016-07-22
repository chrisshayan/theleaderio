import React, { Component } from 'react';

class CheckBox extends Component {
  render() {
    const {
      label,
      checked = false,
      disabled,
      onChange = () => null
    } = this.props;

		return (
      <div>​
        <input
          type="checkbox"
          className="checkbox-success"
          onChange={e => onChange(e.target.checked)}
          checked={checked}
          disabled={!!disabled}
        />
        {' '}
        {label && ( <span>{ label }</span> )}
      </div>
    );
  }
}

export default CheckBox;
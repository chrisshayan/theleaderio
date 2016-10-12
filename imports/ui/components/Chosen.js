import React, {Component} from 'react';
// import {words as capitalize} from 'capitalize';


export default class Chosen extends Component {

  // componentDidMount() {
  //   const el = $(this.refs.selector);
  //   el.chosen({max_selected_options: 3}).change(this._onChange.bind(this));
  // }
  //
  // componentDidUpdate() {
  //   const el = $(this.refs.selector);
  //   el.chosen({max_selected_options: 3}).change(this._onChange.bind(this));
  // }

  _onChange() {
    const selected = this.refs.selector.value;
    this.props.onChange(selected);
  }

  render() {
    const {
      disabled=false,
      options=[],
      selectedOptions = "",
      chosenClass='chosen-select form-control',
      isMultiple = false,
      placeHolder=' Choose one option ...',
      onChange=() => null
    } = this.props;
    return (
      <div>
        <select ref="selector"
                disabled={disabled}
                data-placeholder={placeHolder}
                className={chosenClass}
                value={selectedOptions}
                multiple={isMultiple}
                onChange={this._onChange.bind(this)}
        >
          {options.map((value, key) => (
            <option
              key={key}
              value={value}
            >
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  }
}


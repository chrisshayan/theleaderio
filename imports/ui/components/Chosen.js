import React, {Component} from 'react';
import {words as capitalize} from 'capitalize';


export default class Chosen extends Component {
  constructor() {
    super();

    this.state = {
      selected: null
    }
  }

  _onChange() {
    const selected = this.refs.selector.value;
    this.props.onChange(selected);
  }

  render() {
    const {
      options=[],
      selectedOptions = null,
      chosenClass='chosen-select form-control',
      isMultiple = false,
      placeHolder=' Choose one option ...',
      onChange=() => null
    } = this.props;
    return (
      <div>
        <select ref="selector"
                data-placeholder={placeHolder}
                className={chosenClass}
                defaultValue={selectedOptions}
                multiple={isMultiple}
                onChange={this._onChange.bind(this)}
        >
          {options.map((value, key) => (
            <option
              key={key}
              value={value}
            >
              {capitalize(value)}
            </option>
          ))}
        </select>
      </div>
    );
  }
}


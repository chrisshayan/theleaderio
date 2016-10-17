import React, {Component} from 'react';
// import {words as capitalize} from 'capitalize';


export default class Chosen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: props.defaultValue
    };
  }

  _onChange(selected) {
    this.props.onChange(selected);
  }

  render() {
    const
      {selected} = this.state,
      {
        disabled = false,
        options = [],
        defaultValue="",
        chosenClass = 'chosen-select form-control',
        isMultiple = false,
        placeHolder = ' Choose one option ...',
        onChange = () => null
      } = this.props
      ;

    return (
      <div>
        <select ref="selector"
                disabled={disabled}
                data-placeholder={placeHolder}
                value={selected}
                className={chosenClass}
                multiple={isMultiple}
                onChange={() => {
                  this.setState({selected: this.refs.selector.value});
                  this._onChange(this.refs.selector.value);
                }}
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


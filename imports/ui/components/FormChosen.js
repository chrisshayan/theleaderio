import React, {Component} from 'react';


export default class FormChosen extends Component {

  componentDidMount() {
    const el = $(this.refs.selector);
    el.chosen({max_selected_options: 3});
  }

  getValue() {
    const el = $(this.refs.selector);
    return el.val();
  }

  render() {
    const {
      options,
      selectedElements,
      placeHolder = "Choose your options ...",
      isMultiple
    } = this.props;
    return (
        <select ref="selector"
                data-placeholder={placeHolder}
                className="chosen-select form-control"
                defaultValue={selectedElements}
                multiple={isMultiple}
        >
          {options.map(option => (
            <option
              key={option._id}
              value={option.name}
              style={{textTransform: 'capitalize'}}
            >
              {option.name}
            </option>
          ))}
        </select>
    );
  }
}


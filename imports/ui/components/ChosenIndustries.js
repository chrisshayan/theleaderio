import React, {Component} from 'react';


export default class ChosenIndustries extends Component {

  componentDidMount() {
    const el = $(this.refs.industries);
    el.chosen({max_selected_options: 3});
  }

  getValue() {
    const el = $(this.refs.industries);
    return el.val();
  }

  render() {
    const { options, selectedIndustries } = this.props;
    return (
      <div>
        <select ref="industries"
                data-placeholder="Choose your industries..."
                className="chosen-select form-control"
                defaultValue={selectedIndustries}
                multiple
        >
          {options.map(option => (
            <option
              key={option._id}
              value={option._id}
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}


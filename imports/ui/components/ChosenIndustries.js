import React, {Component} from 'react';


export default class ChosenIndustries extends Component {

  constructor() {
    super();

    this.state = {
      selected: []
    };
  }

  componentDidMount() {
    const el = $(this.refs.industries);
    // el.chosen({max_selected_options: 3}).change(this._onSelected.bind(this));
    el.chosen({max_selected_options: 3});
  }

  _onSelected(event, action) {
    let selected = this.state.selected;
    if(action.selected) {
      selected.push(action.selected);
    } else if(action.deselected) {
      selected = _.without(selected, action.deselected);
    }
    selected = _.uniq(selected);
    this.setState({ selected });
  }

  getValue() {
    const el = $(this.refs.industries);
    return el.val();
  }

  reset() {
    this.setState({selected: []});
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


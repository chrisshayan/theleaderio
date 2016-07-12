import React, {Component} from 'react';

<<<<<<< Updated upstream
export default class SelectIndustries extends Component {
=======
export default class ChosenIndustries extends Component {
>>>>>>> Stashed changes

  constructor() {
    super();

    this.state = {
      selected: []
    };
  }

  componentDidMount() {
    const el = $(this.refs.industries);
    el.chosen().change(this._onSelected.bind(this));

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
    return this.state.selected;
  }

  reset() {
    this.setState({selected: []});
  }

  render() {
    const { options } = this.props;
<<<<<<< Updated upstream
    console.log(this.state.selected)
=======
>>>>>>> Stashed changes

    return (
      <div>
        <select ref="industries"
                data-placeholder="Choose ..."
<<<<<<< Updated upstream
                className="form-control chosen-select"
                multiple
        >
          {options.map(option => (
            <option value={option._id}>{option.name}</option>
=======
                className="chosen-select form-control"
                multiple
        >
          {options.map(option => (
            <option key={option._id} value={option._id}>{option.name}</option>
>>>>>>> Stashed changes
          ))}
        </select>
      </div>
    );
  }
}


import React, {Component} from 'react';
import _ from 'lodash';

export default class AddIndustry extends Component {
  constructor() {
    super();
    this.state = {
      name: ""
    };

    this._onSubmit = this._onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(!_.isEqual(newProps.industry, this.props.industry)) {
      this.setState({
        name: newProps.industry ? newProps.industry.name : ""
      })
    }
  }

  _onSubmit() {
    const { onSave, industry } = this.props;
    if(onSave) {
      onSave({
        _id: industry ? industry._id : null,
        name: this.state.name
      });
      this.setState({name: ""})
    }
  }

  render() {
    const { industry } = this.props;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          this._onSubmit();
        }}
      >
        <input
          type="text"
          ref="name"
          value={this.state.name}
          onChange={e => this.setState({name: e.target.value})}
        />
        <button type="submit">Save</button>
      </form>
    );
  }
}
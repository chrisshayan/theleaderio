import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import React, {Component} from 'react';

import { Industries } from '/imports/api/industries';
import * as Actions from '/imports/api/industries/methods';

// import views
import AddIndustry from '/imports/ui/components/AddIndustry';

class LandingPage extends Component {

  constructor() {
    super();

    this.state = {
      singleIndustry: null
    };

    this._onSelectIndustry = this._onSelectIndustry.bind(this);
    this._onSaveIndustry = this._onSaveIndustry.bind(this);
  }

  _onSelectIndustry(industry) {
    this.setState({ singleIndustry: industry })
  }

  _onSaveIndustry ({_id, name}) {
    if(!_id) {
      Actions.insert.call({name});
    } else {
      Actions.update.call({_id, name});
      this.setState({singleIndustry: null});
    }
  }

  _onDeleteIndustry ({_id}) {
    if(_id) {
      Actions.remove.call({_id});
    }
  }

  render() {
    const { isLoading, industries } = this.props;
    if(isLoading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      return (
        <div>
          <AddIndustry onSave={this._onSaveIndustry.bind(this)} industry={this.state.singleIndustry} />
          <ul>
            {industries.map(industry => (
              <li key={industry._id}>
                <h3>{industry.name}</h3>
                <div>
                  <button onClick={() => this._onSelectIndustry(industry)}>Edit</button>
                  {" | "}
                  <button onClick={() => this._onDeleteIndustry(industry)}>Delete</button>
                </div>
                <hr/>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

const meteorData = params => {
  const sub = Meteor.subscribe('industries.list');
  return {
    isLoading: !sub.ready(),
    industries: Industries.find().fetch(),
  }
};

export default createContainer(meteorData, LandingPage)
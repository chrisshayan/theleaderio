import React, {Component} from 'react';

// components
import LineChart from '/imports/ui/components/LineChart';
import Chosen from '/imports/ui/components/Chosen';

export default class IboxContentChartWithChosen extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      chartData: {}
    }
  }

  componentWillMount() {
    this.setState({
      loading: false,
      chartData: this.props.data.overall
    });
  }

  onChooseMetric(selected) {
    $.map(this.props.data, (value, key) => {
      if(selected === key) {
        this.setState({chartData: value});
      }
    });
  }

  render() {
    // metrics chart
    const {label, data} = this.props;
    const {loading, chartData} = this.state;


    // Chosen metric options
    const options = [];
    $.map(data, (value, key) => {
      if(key !== 'label') {
        options.push(key);
      }
    });

    if (!loading) {
      return (
        <div className="ibox-content">
          <h5><strong>{label}</strong></h5>
          <Chosen
            options={options}
            selectedOptions={null}
            chosenClass="chosen-select"
            isMultiple={false}
            placeHolder='Choose one option ...'
            onChange={this.onChooseMetric.bind(this)}
          />
          <LineChart
            label={data.label}
            data={chartData}
          />
        </div>
      );
    } else {
      return (
        <div className="ibox-content">
          <h5><strong>Getting chart data ...</strong></h5>
        </div>
      );
    }

  }
}
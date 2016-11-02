import React, {Component} from 'react';

// components
import LineChart from '/imports/ui/components/LineChart';
import Chosen from '/imports/ui/components/Chosen';
import EmptyBox from '/imports/ui/components/EmptyBox';

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
      chartData: this.props.value
    });
  }

  onChooseMetric(selected) {
    // console.log(selected)
    $.map(this.props.data, (value, key) => {
      if (selected === key) {
        this.setState({chartData: value});
      }
    });
  }

  render() {
    // metrics chart
    const
      {label, data} = this.props,
      {loading, chartData} = this.state
      ;


    if (!loading) {
      if (!_.isEmpty(data)) {
        // Chosen metric options
        const options = [];
        $.map(data, (value, key) => {
          if (key !== 'label') {
            options.push(key);
          }
        });

        return (
          <div className="ibox-content">
            <h3 className="font-bold no-margins">
              {label}
            </h3>
            <Chosen
              options={options}
              defaultValue={options[0]}
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
            <h3 className="font-bold no-margins">
              {label}
            </h3>
            <EmptyBox
              icon="fa fa-area-chart"
              message="No Chart Data"
            />
          </div>
        );
      }
    } else {
      return (
        <div className="ibox-content">
          <h5><strong>Getting chart data ...</strong></h5>
        </div>
      );
    }


  }
}
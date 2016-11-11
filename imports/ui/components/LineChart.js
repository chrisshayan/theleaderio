import React, {Component} from 'react';

export default class LineChart extends Component {
  constructor() {
    super();

    this.state = {
      label: null,
      data: null
    };
  }

  componentDidMount() {
    // create line chart
    this.lineChart();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.data, this.props.data)) {
      this.lineChart();
    }
  }

  lineChart() {
    const canvas = document.getElementById("lineChart");
    if (canvas) {
      const {labels, datasets} = this.props;
      const lineData = {
        labels,
        datasets
      };
      const lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 3,
        datasetFill: true,
        responsive: true,
      };
      const ctx = canvas.getContext("2d");
      // console.log(lineData)
      // console.log(lineOptions)
      const metricChart = new Chart(ctx).Line(lineData, lineOptions);
    }
  }

  render() {
    return (
      <div>
        <canvas id="lineChart" height="140"></canvas>
      </div>
    );
  }
}
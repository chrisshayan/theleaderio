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
      const {label, data} = this.props;
      const lineData = {
        labels: label,
        datasets: [
          {
            data: data,
            fillColor: "rgba(26,179,148,0.5)",
            strokeColor: "rgba(26,179,148,0.7)",
            pointColor: "rgba(26,179,148,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26,179,148,1)"
          }
        ]
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
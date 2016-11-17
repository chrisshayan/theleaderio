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
    if (!_.isEqual(prevProps.datasets, this.props.datasets)) {
      console.log(`redraw chart`)
      this.lineChart();
    }
  }

  lineChart() {
    const
      {id = ""} = this.props,
      lineChartId = `lineChart${id}`,
      canvas = document.getElementById(lineChartId)
      ;
    if (canvas) {
      const {labels, datasets} = this.props,
        lineData = {
          labels,
          datasets
        },
        lineOptions = {
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
        },
        ctx = canvas.getContext("2d");
      console.log(lineData)
      // console.log(lineOptions)
      const metricChart = new Chart(ctx).Line(lineData, lineOptions);
    }
  }

  render() {
    const
      {id = ""} = this.props,
      lineChartId = `lineChart${id}`
      ;

    return (
      <div>
        <canvas id={lineChartId} height="140"></canvas>
      </div>
    );
  }
}
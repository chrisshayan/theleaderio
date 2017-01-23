import React, {Component} from 'react';

import '/client/plugins/chartNewJs/ChartNew';
import '/client/plugins/chartNewJs/Add-ins/format';

export default class ScatterLineCharts extends Component {
  constructor() {
    super();

    this.state = {
      label: null,
      data: null,
      lineChart: null,
    };
  }

  componentDidMount() {
    // create line chart
    this.lineChart();
  }

  // componentDidUpdate(prevProps) {
  //   if (!_.isEqual(prevProps.datasets, this.props.datasets)) {
  //     const {lineChart} = this.state;
  //     lineChart.destroy();
  //     this.lineChart();
  //   }
  // }

  lineChart() {
    var mydata1 = {
      labels: ["0", 1, "2", 3, 4],
      xBegin: 0,
      xEnd: 6,
      datasets: [
        {
          strokeColor: "rgba(220,220,220,1)",
          data: [],
          xPos: [],
          title: "Normal"
        },
        {
          strokeColor: "rgba(26,179,148,0.5)",
          data: [],
          xPos: [],
          title: "Realitic"
        }
      ]
    }
    var gauss_var = 1;
    var gauss_mean = 3;

    var nbiter = 400;
    for (var i = 0; i < nbiter; i++) {
      mydata1.datasets[0].xPos[i] = mydata1.xBegin + i * (mydata1.xEnd - mydata1.xBegin) / nbiter;
      mydata1.datasets[0].data[i] = (1 / (gauss_var * Math.sqrt(2 * Math.PI))) * Math.exp(-((mydata1.datasets[0].xPos[i] - gauss_mean) * (mydata1.datasets[0].xPos[i] - gauss_mean)) / (2 * gauss_var));
    }

    gauss_var = 1.916961263;
    gauss_mean = 3.176470588;

    var nbiter = 400;
    for (var i = 0; i < nbiter; i++) {
      mydata1.datasets[1].xPos[i] = mydata1.xBegin + i * (mydata1.xEnd - mydata1.xBegin) / nbiter;
      mydata1.datasets[1].data[i] = (1 / (gauss_var * Math.sqrt(2 * Math.PI))) * Math.exp(-((mydata1.datasets[1].xPos[i] - gauss_mean) * (mydata1.datasets[1].xPos[i] - gauss_mean)) / (2 * gauss_var));
    }

    console.log(mydata1);
    var opt1 = {
      canvasBorders: true,
      canvasBordersWidth: 3,
      canvasBordersColor: "white",
      graphTitle: "",
      legend: true,
      datasetFill: false,
      annotateDisplay: true,
      pointDot: false,
      animationLeftToRight: true,
      animationEasing: "linear",
      yAxisMinimumInterval: 0.02,
      graphTitleFontSize: 18
    }

    var myLine = new Chart(document.getElementById("scatterLineChart").getContext("2d")).Line(mydata1, opt1);
  }

  render() {
    const
      {id = ""} = this.props,
      scatterLineChartId = `scatterLineChart${id}`
      ;

    return (
      <div>
        <canvas id={scatterLineChartId} width={400} height={257}></canvas>
      </div>
    );
  }
}
import React, {Component} from 'react';

export default class GaussChart extends Component {

  componentDidMount() {
    this.gaussChart();
  }

  gaussChart() {
    const
      {
        labels = [], data = [],
        defaultDataSets = [],
        xAxisLabel = "",
        id = ""
      } = this.props,
      gaussChartId = `gaussChart${id}`,
      gaussData = {
        labels: labels,
        xBegin: 0,
        xEnd: 6,
        datasets: defaultDataSets
      },
      gaussOptions = {
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
        xAxisLabel: xAxisLabel,
        yAxisLeft: false,
        yAxisMinimumInterval: 0.02,
        graphTitleFontSize: 18
      };

    data.map((gauss, index) => {
      const
        {standardDeviation, mean} = gauss,
        nbiter = 400;

      // get xAxis & yAxis values
      for (var i = 0; i < nbiter; i++) {
        gaussData.datasets[index].xPos[i] = gaussData.xBegin + i * (gaussData.xEnd - gaussData.xBegin) / nbiter;
        gaussData.datasets[index].data[i] = (1 / (standardDeviation * Math.sqrt(2 * Math.PI))) * Math.exp(-((gaussData.datasets[index].xPos[i] - mean) * (gaussData.datasets[index].xPos[i] - mean)) / (2 * standardDeviation));
      }
    });

    console.log(data);

    let gaussChart = new Chart(document.getElementById(gaussChartId).getContext("2d")).Line(gaussData, gaussOptions);
  }

  render() {
    const
      {id = "", width = 400, height = 250, data} = this.props,
      gaussChartId = `gaussChart${id}`
      ;

    if (_.isEmpty(data)) {
      return (
        <EmptyBox
          height="200px"
          icon="fa fa-area-chart"
          message="No Chart Data"
        />
      );
    } else {
      return (
        <div>
          <canvas id={gaussChartId} width={width} height={height}></canvas>
        </div>
      );
    }
  }
}
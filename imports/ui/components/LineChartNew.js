import React, {Component} from 'react';

import '/client/plugins/chartJsNew/ChartNew';
import '/client/plugins/chartJsNew/Add-ins/format.js';

export default class LineChartNew extends Component {
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

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.datasets, this.props.datasets)) {
      const {lineChart} = this.state;
      lineChart.destroy();
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

      var mydata1 = {
        labels : ["0",1,2,"3",4, 5, "6"],
        xBegin : 0,
        xEnd :  6,
        datasets : [
          {
            strokeColor : "rgba(220,220,220,1)",
            data : [],
            xPos : [],
            title : "Sinus"
          }
        ]
      }
      var gauss_var=1.916961263;
      var gauss_mean=3.176470588;

      var nbiter=400;
      for(var i=0;i<nbiter;i++)
      {
        mydata1.datasets[0].xPos[i]=mydata1.xBegin+i*(mydata1.xEnd-mydata1.xBegin)/nbiter;
        mydata1.datasets[0].data[i]=(1/(gauss_var*Math.sqrt(2*Math.PI))) * Math.exp(-((mydata1.datasets[0].xPos[i]-gauss_mean)*(mydata1.datasets[0].xPos[i]-gauss_mean))/(2*gauss_var));
      }
      console.log(mydata1);
      var opt1 = {
        canvasBorders : true,
        canvasBordersWidth : 3,
        canvasBordersColor : "black",
        graphTitle : "Gauss Function - (0,1)",
        legend : true,
        datasetFill : false,
        annotateDisplay : true,
        pointDot :false,
        animationLeftToRight : true,
        animationEasing: "linear",
        yAxisMinimumInterval : 0.02,
        graphTitleFontSize: 18
      }

      const {labels, datasets} = this.props,
      //   lineData = {
      //     labels,
      //     datasets
      //   },
      //   lineOptions = {
      //     scaleShowGridLines: true,
      //     scaleGridLineColor: "rgba(0,0,0,.05)",
      //     scaleGridLineWidth: 1,
      //     bezierCurve: true,
      //     bezierCurveTension: 0.4,
      //     pointDot: true,
      //     pointDotRadius: 4,
      //     pointDotStrokeWidth: 1,
      //     pointHitDetectionRadius: 20,
      //     datasetStroke: true,
      //     datasetStrokeWidth: 3,
      //     datasetFill: true,
      //     responsive: true,
      //   },
        ctx = canvas.getContext("2d"),
        // lineChart = new Chart(ctx).Line(lineData, lineOptions);
        lineChart = new Chart(ctx).Line(mydata1, opt1);

      this.setState({
        lineChart
      });
      // console.log(lineData)
      // console.log(lineOptions)
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
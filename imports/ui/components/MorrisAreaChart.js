import React, {Component} from 'react';

export default class MorrisAreaChart extends Component {

  componentDidMount() {
    this.createMorrisAreaChart();
  }

  createMorrisAreaChart() {
    const chart = document.getElementById("morris-area-chart");

    Morris.Area({
      element: 'area-example',
      data: [
        { y: '2006', a: 100, b: 90 },
        { y: '2007', a: 75,  b: 65 },
        { y: '2008', a: 50,  b: 40 },
        { y: '2009', a: 75,  b: 65 },
        { y: '2010', a: 50,  b: 40 },
        { y: '2011', a: 75,  b: 65 },
        { y: '2012', a: 100, b: 90 }
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Series A', 'Series B']
    });
  }

  render() {
    return (
      <div>
        <div id="morris-area-chart"></div>
      </div>
    );
  }
}
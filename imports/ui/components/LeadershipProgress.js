import React, {Component} from 'react';

// components 
import IboxContentChartWithChosen from '/imports/ui/components/IboxContentChartWithChosen';
import IboxContentInline from '/imports/ui/components/IboxContentInline';

export default class LeadershipProgress extends Component {

  constructor() {
    super();

    this.state = {
    }
  }

  render() {
    const {label, preferences, data} = this.props;
    const {chart, metrics} = data;

    const chartContent = {};
    const metricsContent = [];
    const group1 = {};
    const group2 = {};
    const group3 = {};
    $.map(preferences, (value, key) => {
      // console.log(`key: ${key}, value: ${value}`);
      if(value) {
        switch(key) {
          case 'overall': {
            chartContent.overall = chart.overall;
            group1.overall = metrics.overall;
            break;
          }
          case 'purpose': {
            chartContent.purpose = chart.purpose;
            group1.purpose = metrics.purpose;
          }
          case 'mettings': {
            chartContent.mettings = chart.mettings;
            group1.mettings = metrics.mettings;
          }
          case 'rules': {
            chartContent.rules = chart.rules;
            group1.rules = metrics.rules;
          }
          case 'communications': {
            chartContent.communications = chart.communications;
            group2.communications = metrics.communications;
          }
          case 'leadership': {
            chartContent.leadership = chart.leadership;
            group2.leadership = metrics.leadership;
          }
          case 'workload': {
            chartContent.workload = chart.workload;
            group2.workload = metrics.workload;
          }
          case 'energy': {
            chartContent.energy = chart.energy;
            group2.energy = metrics.energy;
          }
          case 'stress': {
            chartContent.stress = chart.stress;
            group3.stress = metrics.stress;
          }
          case 'decision': {
            chartContent.decision = chart.decision;
            group3.decision = metrics.decision;
          }
          case 'respect': {
            chartContent.respect = chart.respect;
            group3.respect = metrics.respect;
          }
          case 'conflict': {
            chartContent.conflict = chart.conflict;
            group3.conflict = metrics.conflict;
          }
        }
      }
    });
    if (!_.isEmpty(group1)) {
      metricsContent.push(group1);
    }
    if (!_.isEmpty(group2)) {
      metricsContent.push(group2);
    }
    if (!_.isEmpty(group3)) {
      metricsContent.push(group3);
    }
    console.log(chartContent)
    console.log(metricsContent)

    return (
      <div className="ibox float-e-margins" style={{marginBottom: 18}}>
        <div className="ibox-title">
          <h5>{label}</h5>
        </div>
        <IboxContentChartWithChosen
          label="Half-year Metric Progress Chart"
          data={chart}
          value={chart.overall}
        />
        {metricsContent.map((content, key) => (
          <IboxContentInline
            key={key}
            ibcContent={content}
            classGrid="col-xs-3"
          />
        ))}
      </div>
    );
  }
}
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
    const {label, chart, metrics} = this.props;

    // content for metrics info
    const metricsContent = [];
    const group1 = {};
    const group2 = {};
    const group3 = {};
    if (!!metrics.overall) {
      group1.Overall = metrics.overall;
    }
    if (!!metrics.purpose) {
      group1.Purpose = metrics.purpose;
    }
    if (!!metrics.mettings) {
      group1.Mettings = metrics.mettings;
    }
    if (!!metrics.rules) {
      group1.Rules = metrics.rules;
    }
    if (!!metrics.communications) {
      group2.Communications = metrics.communications;
    }
    if (!!metrics.leadership) {
      group2.Leadership = metrics.leadership;
    }
    if (!!metrics.workload) {
      group2.Workload = metrics.workload;
    }
    if (!!metrics.energy) {
      group2.Energy = metrics.energy;
    }
    if (!!metrics.stress) {
      group3.Stress = metrics.stress;
    }
    if (!!metrics.decision) {
      group3.Decision = metrics.decision;
    }
    if (!!metrics.respect) {
      group3.Respect = metrics.respect;
    }
    if (!!metrics.conflict) {
      group3.Conflict = metrics.conflict;
    }
    if (!_.isEmpty(group1)) {
      metricsContent.push(group1);
    }
    if (!_.isEmpty(group2)) {
      metricsContent.push(group2);
    }
    if (!_.isEmpty(group3)) {
      metricsContent.push(group3);
    }

    return (
      <div className="ibox float-e-margins" style={{marginBottom: 18}}>
        <div className="ibox-title">
          <h5>{label}</h5>
        </div>
        <IboxContentChartWithChosen
          label="Half-year Metric Progress Chart"
          data={chart}
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
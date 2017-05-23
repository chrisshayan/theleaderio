import React, {Component} from 'react';

// components 
import IboxContentChartWithChosen from '/imports/ui/components/IboxContentChartWithChosen';
import IboxContentInline from '/imports/ui/components/IboxContentInline';
import EmptyBox from '/imports/ui/components/EmptyBox';
import Calendar from '/imports/ui/containers/calendar/Calendar';

export default class ProfileMetricsBox extends Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const
      {isPresent, label, preferences, data} = this.props,
      status = isPresent ? "current organization" : "latest organization"
      ;

    if (!_.isEmpty(data)) {
      const {chart, metrics} = data;

      const chartContent = chart;
      const metricsContent = [];
      const group1 = {};
      const group2 = {};
      const group3 = {};
      $.map(preferences, (value, key) => {
        if (value) {
          switch (key) {
            case 'overall': {
              // chartContent.overall = chart.overall;
              group1.overall = metrics.overall || 0;
              break;
            }
            case 'purpose': {
              // chartContent.purpose = chart.purpose;
              group1.purpose = metrics.purpose || 0;
              break;
            }
            case 'meetings': {
              // chartContent.meetings = chart.meetings;
              group1.meetings = metrics.meetings || 0;
              break;
            }
            case 'rules': {
              // chartContent.rules = chart.rules;
              group1.rules = metrics.rules || 0;
              break;
            }
            case 'communications': {
              // chartContent.communications = chart.communications;
              group2.communications = metrics.communications || 0;
              break;
            }
            case 'leadership': {
              // chartContent.leadership = chart.leadership;
              group2.leadership = metrics.leadership || 0;
              break;
            }
            case 'workload': {
              // chartContent.workload = chart.workload;
              group2.workload = metrics.workload || 0;
              break;
            }
            case 'energy': {
              // chartContent.energy = chart.energy;
              group2.energy = metrics.energy || 0;
              break;
            }
            case 'stress': {
              // chartContent.stress = chart.stress;
              group3.stress = metrics.stress || 0;
              break;
            }
            case 'decision': {
              // chartContent.decision = chart.decision;
              group3.decision = metrics.decision || 0;
              break;
            }
            case 'respect': {
              // chartContent.respect = chart.respect;
              group3.respect = metrics.respect || 0;
              break;
            }
            case 'conflict': {
              // chartContent.conflict = chart.conflict;
              group3.conflict = metrics.conflict || 0;
              break;
            }
            default: {
              // chartContent.overall = chart.overall;
              group1.overall = metrics.overall || 0;
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

      return (
        <div className="ibox float-e-margins" style={{marginBottom: 18}}>
          <div className="ibox-title">
            <span className="label label-info pull-right">{status}</span>
            <h5>{label}</h5>
          </div>
          <IboxContentChartWithChosen
            label=""
            data={chartContent}
            value={chartContent.overall}
          />
          {/*{metricsContent.map((content, key) => (*/}
            {/*<IboxContentInline*/}
              {/*key={key}*/}
              {/*ibcContent={content}*/}
              {/*classGrid="col-xs-3"*/}
            {/*/>*/}
          {/*))*/}
        </div>
      );
    } else {
      return (
        <div>
          <EmptyBox

          />
        </div>
      );
    }
  }
}
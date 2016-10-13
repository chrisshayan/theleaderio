import React, {Component} from 'react';

// components
import Indicator from '/imports/ui/common/LoadingIndicator';
import Chosen from '/imports/ui/components/Chosen';

// constants
import {JOB_FREQUENCY, DAY_OF_WEEK, DAY_OF_MONTH, HOUR_OF_DAY, MINUTE_OF_AN_HOUR} from '/imports/utils/defaults';
import * as ERROR_CODE from '/imports/utils/error_code';

export default class FormManageJob extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      error: "",
      type: "",
      schedule: {}
    };
  }

  componentWillMount() {
    this.setState({
      ready: false
    });
    if (!_.isEmpty(this.props.currentSchedule)) {
      this.setState({
        ready: true,
        schedule: this.props.currentSchedule
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ready: false
    });
    if (!_.isEmpty(nextProps.currentSchedule)) {
      this.setState({
        ready: true,
        schedule: nextProps.currentSchedule
      });
    }
  }

  _onSubmit() {
    const
      {schedule} = this.state,
      {type} = this.props
      ;
    this.props.onSubmit({type, schedule});
  }

  render() {
    const
      {
        type = "",
        currentSchedule = {}
      } = this.props,
      {
        ready,
        schedule
      } = this.state,
      frequency = {
        options: JOB_FREQUENCY,
        chosenClass: 'chosen-select form-control',
        isMultiple: false,
        placeHolder: 'Frequency',
        onChange: (selected) => {
          if (selected === "Every Month") {
            this.setState({
              schedule: {
                ...schedule,
                frequency: _.indexOf(JOB_FREQUENCY, selected),
                disableDayOfWeek: true,
                disableDayOfMonth: false
              }
            });
          } else {
            this.setState({
              schedule: {
                ...schedule,
                frequency: _.indexOf(JOB_FREQUENCY, selected),
                disableDayOfWeek: false,
                disableDayOfMonth: true
              }
            });
          }
        },
      },
      dayOfMonth = {
        options: DAY_OF_MONTH,
        chosenClass: 'chosen-select form-control',
        isMultiple: false,
        placeHolder: 'Day',
        onChange: (selected) => {
          this.setState({
            schedule: {
              ...schedule,
              day: (_.indexOf(DAY_OF_MONTH, selected) + 1)
            }
          });
        },
      },
      dayOfWeek = {
        options: DAY_OF_WEEK,
        chosenClass: 'chosen-select form-control',
        isMultiple: false,
        placeHolder: 'Day',
        onChange: (selected) => {
          this.setState({
            schedule: {
              ...schedule,
              day: _.indexOf(DAY_OF_WEEK, selected)
            }
          });
        },
      },
      hour = {
        options: HOUR_OF_DAY,
        chosenClass: 'chosen-select form-control',
        isMultiple: false,
        placeHolder: 'Hour',
        onChange: (selected) => {
          this.setState({
            schedule: {
              ...schedule,
              hour: _.indexOf(HOUR_OF_DAY, Number(selected))
            }
          });
        },
      },
      minute = {
        options: MINUTE_OF_AN_HOUR,
        chosenClass: 'chosen-select form-control',
        isMultiple: false,
        placeHolder: 'Minute',
        onChange: (selected) => {
          this.setState({
            schedule: {
              ...schedule,
              minute: _.indexOf(MINUTE_OF_AN_HOUR, Number(selected))
            }
          });
        }
      },
      styles = {
        button: {
          marginBottom: 0
        }
      }
      ;

    // console.log(ready)
    // console.log(type)
    // console.log(currentSchedule)

    if (ready) {
      return (
        <form action="" className="form-inline"
              onSubmit={(event) => {
                        event.preventDefault();
                        this._onSubmit();
                      }}
        >
          <div className="form-group">
            <Chosen
              options={frequency.options}
              defaultValue={!_.isEmpty(schedule) ? JOB_FREQUENCY[schedule.frequency] : ""}
              isMultiple={frequency.isMultiple}
              placeHolder={frequency.placeHolder}
              onChange={frequency.onChange}
            />
          </div>
          {" on "}
          <div className="form-group">
            <Chosen
              disabled={schedule.disableDayOfMonth}
              options={dayOfMonth.options}
              defaultValue={!_.isEmpty(schedule) ? DAY_OF_MONTH[schedule.day] : ""}
              isMultiple={dayOfMonth.isMultiple}
              placeHolder={dayOfMonth.placeHolder}
              onChange={dayOfMonth.onChange}
            />
          </div>
          {" "}
          <div className="form-group">
            <Chosen
              disabled={schedule.disableDayOfWeek}
              options={dayOfWeek.options}
              defaultValue={!_.isEmpty(schedule) ? DAY_OF_WEEK[schedule.day] : ""}
              isMultiple={dayOfWeek.isMultiple}
              placeHolder={dayOfWeek.placeHolder}
              onChange={dayOfWeek.onChange}
            />
          </div>
          {" at "}
          <div className="form-group">
            <Chosen
              options={hour.options}
              defaultValue={!_.isEmpty(schedule) ? HOUR_OF_DAY[schedule.hour] : ""}
              isMultiple={hour.isMultiple}
              placeHolder={hour.options[hour.options.length - 1]}
              onChange={hour.onChange}
            />
          </div>
          {" : "}
          <div className="form-group">
            <Chosen
              options={minute.options}
              defaultValue={!_.isEmpty(schedule) ? MINUTE_OF_AN_HOUR[schedule.minute] : ""}
              isMultiple={minute.isMultiple}
              placeHolder={minute.options[minute.options.length - 1]}
              onChange={minute.onChange}
            />
          </div>
          <div className="form-group pull-right">
            <button className="btn btn-sm btn-primary" type="submit" style={styles.button}>Save changes
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <Indicator />
      );
    }
  }
}
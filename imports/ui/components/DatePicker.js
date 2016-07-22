import React, { Component } from 'react';
import moment from 'moment';

class DatePicker extends Component {

	el = null;

	componentDidMount() {
		if(!this.props.disabled) {
			this.initDatePicker();
		}
	}

	componentDidUpdate(prevProps) {
		if(prevProps.disabled != this.props.disabled) {
			if(this.props.disabled) {
				$(this.refs.component).find(".input-group-addon").off();
			} else {
				this.initDatePicker();
			}
		}
	}

	initDatePicker() {
		this.el = $(this.refs.component);
		const option = this.props.option || {};
		this.el.datepicker(option).on('input change', _.debounce(e => {
			this._onChange(e.target.value);
		}, 200));
	}

	/**
	 * @event
	 * on date change
	 */
	_onChange = val => {
		const { isDateObject, onChange = () => null } = this.props;
		if (isDateObject) {
			onChange(moment(val, 'MM/DD/YYYY').toDate());
		} else {
			onChange(value);
		}
	}

	render() {
		const { label = '', value = '', error, isDateObject = false, disabled } = this.props;
		return (
			<div className={error ? 'form-group has-error' : 'form-group'}>
				<label className="font-noraml">
					{ label }
				</label>
				<div className="input-group date" ref={'component'}>
					<span className="input-group-addon">
						<i className="fa fa-calendar" />
					</span>
					<input 
						type="text" 
						className="form-control" 
						disabled={disabled}
						defaultValue={isDateObject ? new moment(value).format('MM/DD/YYYY') : value}
					/>
				</div>
				{error  
					? (<p className="help-block">{error}</p>) 
					: (<span className="help-block">format: mm/dd/yyyy</span>)
				}
			</div>
		);
	}
}

export default DatePicker;

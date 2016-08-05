import React, { Component, PropTypes } from 'react';

class FormInput extends Component {
	static propTypes = {
		label: PropTypes.string,
		defaultValue: PropTypes.string,
		value: PropTypes.string,
		placeholder: PropTypes.string,
		error: PropTypes.string,
		disabled: PropTypes.bool,
		multiline: PropTypes.bool,
		onChangeText: PropTypes.func,
	};

	static defaultProps = {
		label: '',
		defaultValue: '',
		value: '',
		placeholder: '',
		error: '',
		disabled: false,
		multiline: false,
		onChangeText: () => null,
	};

	render() {
		const { 
			label,
			value,
			placeholder, 
			error, 
			disabled,
			multiline,
			onChangeText,
		} = this.props;

		return (
			<div className={error ? 'form-group has-error': 'form-group'}>
				<label className="control-label">{ label }</label>
				{ multiline ? (
					<textarea 
						className="form-control"
						placeholder={placeholder}
						value={value}
						onChange={e => onChangeText(e.target.value)}
						disabled={!!disabled}
					/>
				) : (
					<input 
						type="text"
						className="form-control"
						placeholder={placeholder}
						value={value}
						onChange={e => onChangeText(e.target.value)}
						disabled={!!disabled}
					/>
				)}
				<p style={ styles.errorMsg }>{ error }</p>
			</div>
		);
	}
}

const styles = {
	errorMsg: {
		color: '#ed5565'
	}
};

export default FormInput;
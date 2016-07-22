import React, { Component } from 'react';

class FormInput extends Component {
	render() {
		const { 
			label,
			value, 
			placeholder, 
			error, 
			disabled,
			onChangeText = () => null 
		} = this.props;

		return (
			<div className={error ? 'form-group has-error': 'form-group'}>
				<label className="control-label">{ label }</label>

				<input 
					type="text"
					className="form-control"
					placeholder={placeholder}
					value={value}
					onChange={e => onChangeText(e.target.value)}
					disabled={!!disabled}
				/>
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
import React, { Component } from 'react';

class CheckBox extends Component {
	render() {
		const { 
			label,
			checked = false, 
			error, 
			disabled,
			onChange = () => null 
		} = this.props;

		return (
			<div className={error ? 'form-group has-error': 'form-group'}>
				{label && ( <label className="control-label">{ label }</label> )}

				<input 
					type="checkbox"
					className="form-control checkbox-primary"
					onChange={e => onChange(e.target.checked)}
					checked={checked}
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

export default CheckBox;
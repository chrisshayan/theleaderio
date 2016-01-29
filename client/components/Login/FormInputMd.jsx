FormInputMd = React.createClass({
	getValue() {
		return this.refs.element.value;
	},

	render() {
		const containerClass = classNames('md-form-group', {error: this.props['errorMsg']});

		return (
			<div className={containerClass}>
				<input
					ref="element"
					type={this.props.type || 'text'}
					className="md-input"
					disabled={this.props.disabled || false}
					defaultValue={this.props.defaultValue || ''} />
				<label>{this.props.label}</label>

				{this.props.errorMsg && (
					<p className="msg">{this.props.errorMsg}</p>
				)}
			</div>
		);
	}
});

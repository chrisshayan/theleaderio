import React, { Component } from 'react';
import { getErrors } from '/imports/utils';

class XEditable extends Component {
	state = {
		value: '',
		oldValue: '',
		error: '',
		isLoading: false,
		style: {},
		className: ['form-control', 'inline-editor']
	}

	componentDidMount() {
		const { value } = this.props;
		this.setState({
			oldValue: value,
			value
		});
	}

	componentWillReceiveProps(nextProps) {
		const { value } = nextProps;
		this.setState({
			oldValue: value,
			value
		});
	}

	onChange = e => {
		this.setState({ value: e.target.value });
	}

	onBlur = e => {
		if (!_.isEqual(this.state.oldValue, this.state.value)) {
			this.submit();
		} else {
			this.setState({error: '', isLoading: false});
		}
	}

	successEffect() {
		this.setState({
			className: this.state.className.filter(name => name != 'error')
		});
		this.setState({
			style: {
				transition: 'all .5s ease-in',
				background: 'rgba(24,166,137, 0.5)'
			}
		});
		setTimeout(() => {
			this.setState({
				style: {
				transition: 'all .5s ease-out',
				background: 'transparent'
				}
			});
		}, 300);
	}

	errorEffect() {
		this.setState({
			className: _.uniq([...this.state.className, 'error'])
		});
	}

	submit = () => {
		const { valueName, method, selector } = this.props;
		const { value } = this.state;

		let data = {
			...selector,
			[valueName]: value
		};
		this.setState({ isLoading: true });
		Meteor.call(method, data, (err) => {
			setTimeout(() => {
				this.setState({ isLoading: false });

				if (err) {
					var error = _.values(getErrors(err));
					if (error[0]) {
						this.setState({ error: error[0] });
						this.errorEffect();
						this.refs.txt.focus();
					}
				} else {
					this.setState({ error: '' });
					this.successEffect();
				}
			}, 300);
		});
	}

	render() {
		const { placeholder } = this.props;
		const { value, error, isLoading } = this.state;
		let className = ['form-control', 'inline-editor'];
		if(error) className.push('error');

		return (
			<div className="inline-editor-box">
				<input
					ref="txt"
		  		type="text"
		  		className={className.join(' ')}
		  		value={ value || '' }
		  		disabled={isLoading}
		  		onChange={this.onChange}
		  		onBlur={this.onBlur}
		  		style={this.state.style}
	  		/>
	  		{ error && ( <div className="error-msg">{ error }</div> )}
			</div>
		);
	}
}

export default XEditable;

AdminStatistics = React.createClass({
	getInitialState() {
		return {
			animateClass: ''
		}
	},
	componentDidMount() {
		this.setState({
			animateClass: 'fadeIn active'
		});
	},
	componentWillUnmount() {
		this.setState({
			animateClass: 'fadeOut'
		});
	},
	render() {
		const className = classNames('tab-pane', 'animated', this.state.animateClass);
		return (
			<div role="tabpanel" className={className}>
				<h1>AdminStatistics</h1>
			</div>
		);
	}
});
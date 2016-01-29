AdminUsersManagement = React.createClass({
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
		const {size, columns, dataSource} = this.props;
		const className = classNames('tab-pane', 'animated', this.state.animateClass);
		return (
			<div role="tabpanel" className={className}>
				<DataTable
					width={size.width-45}
					height={500}
					columns={columns}
					dataSource={dataSource}
					/>
			</div>
		);
	}
});
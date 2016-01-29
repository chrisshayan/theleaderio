const {Cell} = FixedDataTable;

LinkCell = React.createClass({
	render() {
		const {rowIndex, data, columnKey, ...props} = this.props;
		const value = data[rowIndex] && data[rowIndex][columnKey] ? data[rowIndex][columnKey] : '';
		return (
			<Cell {...props}>
				<a href={value}>{value}</a>
			</Cell>
		);
	}
});
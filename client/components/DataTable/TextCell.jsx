const {Cell} = FixedDataTable;

TextCell = React.createClass({
	render() {
		const {rowIndex, data, columnKey, ...props} = this.props;
		const value = data[rowIndex] && data[rowIndex][columnKey] ? data[rowIndex][columnKey] : '';
		return (
			<Cell {...props}>
				{value}
			</Cell>
		);
	}
});
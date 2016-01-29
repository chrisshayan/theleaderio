const {Cell} = FixedDataTable;

ImageCell = React.createClass({
	render() {
		const {rowIndex, data, columnKey, size, ...props} = this.props;
		const value = data[rowIndex] && data[rowIndex][columnKey] ? data[rowIndex][columnKey] : '';
		return (
			<Cell {...props}>
				<div style={{width: '100%', margin: '0 auto', textAlign: 'center'}}>
					<img src={value} width={size.width} height={size.height} />
				</div>
			</Cell>
		);
	}
});
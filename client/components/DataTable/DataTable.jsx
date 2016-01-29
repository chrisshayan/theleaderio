const {Table, Column, Cell} = FixedDataTable;

DataTable = React.createClass({
	propTypes: {
		columns: React.PropTypes.array.isRequired,
		dataSource: React.PropTypes.array.isRequired,
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,

	},

	getInitialState() {
		return {
			columnWidths: {}
		};
	},

	componentWillMount() {
		const columnWidths = {};
		this.props.columns.map((col) => {
			columnWidths[col.field] = col.width || 100;
		});
		this.setState({ columnWidths });
	},

	columnHeader(column) {
		return <Cell>{column ? column.label : ''}</Cell>;
	},

	cell(column) {
		if(_.isFunction(column.type) ) {
			const Element = column.type;
			return <Element data={this.props.dataSource}/>;
		} else {
			switch (column.type) {
				case 'link':
					return <LinkCell data={this.props.dataSource}/>;
				case 'image':
					const size = column.image || {width: 32, height: 32};
					return <ImageCell data={this.props.dataSource} size={size}/>;
				default:
					return <TextCell data={this.props.dataSource}/>
			}
		}
	},

	columnWidth(column, columnWidths) {
		return (column && columnWidths) && (column.field && columnWidths[column.field])
			? columnWidths[column.field]
			: 100;
	},

	getColumns() {
		const {columns} = this.props;
		const {columnWidths} = this.state;

		return columns.map((column, key) => (
			<Column
				key={key}
				columnKey={column.field}
				header={this.columnHeader(column)}
				width={this.columnWidth(column, columnWidths)}
				height={column.height}
				cell={this.cell(column)}
				isResizable={column.resizable}
			/>
		));
	},

	_onColumnResizeEndCallback(newColumnWidth, columnKey) {
		this.setState(({columnWidths}) => ({
			columnWidths: {
				...columnWidths,
				[columnKey]: newColumnWidth,
			}
		}));
	},

	render() {
		const {columns, dataSource, width, height} = this.props;
		const {columnWidths} = this.state;
		return (
			<Table
				rowHeight={50}
				headerHeight={50}
				rowsCount={dataSource.length}
				onColumnResizeEndCallback={this._onColumnResizeEndCallback}
				isColumnResizing={false}
				width={width}
				height={height}
				{...this.props}
			>
				{this.getColumns()}
			</Table>
		);
	}
});
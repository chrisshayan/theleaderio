const {Table, Column, Cell} = FixedDataTable;

var SortTypes = {
	ASC: 'ASC',
	DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
	return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

SortHeaderCell = React.createClass({

	render() {
		var {sortDir, children, ...props} = this.props;
		return (
			<Cell {...props}>
				<a onClick={this._onSortChange}>
					{children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
				</a>
			</Cell>
		);
	},

	_onSortChange(e) {
		e.preventDefault();

		if (this.props.onSortChange) {
			this.props.onSortChange(
				this.props.columnKey,
				this.props.sortDir ?
					reverseSortDirection(this.props.sortDir) :
					SortTypes.DESC
			);
		}
	}
});
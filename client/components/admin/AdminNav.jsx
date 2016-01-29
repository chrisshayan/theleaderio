AdminNav = React.createClass({
	onClick(action, e) {
		e.preventDefault();
		this.props.onSelect && this.props.onSelect(action);
	},

	render() {
		const {menuItems, currentAction} = this.props;
		return (
			<ul className="nav nav-md nav-tabs nav-lines b-info">
				{menuItems.map((item, key) => (
					<li key={key} className={item.action === currentAction ? 'active': ''}>
						<a href="#" onClick={(e) => this.onClick(item.action, e)}>
							{item.label}
						</a>
					</li>
				))}
			</ul>
		);
	}
});
import React, { Component } from 'react';

class Box extends Component {
	render() {
		const { title = '', subtitle, tools, children } = this.props;
		return (
			<div className="ibox float-e-margins">
				{/* Box title */}
				<div className="ibox-title">
					<h5>
						{ title }
						{ subtitle && (<small>{ subtitle }</small>) }
					</h5>
					{ tools && (<div className="ibox-tools">{ tools }</div>)}
				</div>

				{/* Box content */}
				<div className="ibox-content">
					{ children }
				</div>
			</div>
		);
	}
}

export default Box;
import React, { Component } from 'react';

class Tabs extends Component {
	constructor(props) {
		super(props);

		let currentTab = 1;
		if(props.currentTab) {
			currentTab = props.currentTab;
		} else if(props.tabs && props.tabs[0]) {
			currentTab = props.tabs[0].key;
		}

		this.state = {
			currentTab,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentTab && nextProps.currentTab != this.state.currentTab) {
			this.setState({ currentTab: nextProps.currentTab });
		}
	}

	componentDidMount() {
		$('[data-toggle="tooltip"]').tooltip();
	}

	/**
	 * @event 
	 * Listen on user select tab
	 */
	_onSelect = (e, tab) => {
		e.preventDefault();
		const {
			beforeSelect = () => null,
			afterSelect = () => null,
			onChangeTab,
		} = this.props;

		if (tab.disabled) return false;

		if(onChangeTab) {
			onChangeTab(tab.key);
		} else {
			beforeSelect(tab);
			this.setState({ currentTab: tab.key });
			afterSelect(tab);
		}
	}

	/**
	 * api to help parent can control current tab
	 */
	moveTo(currentTab) {
		this.setState({ currentTab });
	}

	render() {
		const { tabs = [] } = this.props;
		const { currentTab } = this.state;

		let content = null;
		_.each(tabs, tab => {
			if (tab.key == currentTab && !tab.disabled) {
				content = tab.component;
			}
		});

		return (
			<div className="tabs-container">
			  <ul className="nav nav-tabs">
			  	{ tabs.map((tab, key) => (
			  		<li key={tab.key} className={tab.key == currentTab ? 'active': ''}>
				    	<a 
				    		style={tab.disabled ? {cursor: 'not-allowed'} : {}} 
				    		onClick={e => this._onSelect(e, tab)}
				    		data-toggle={tab.tooltip ? 'tooltip' : ''}
				    		data-placement="top" 
				    		title={tab.tooltip || ''}
			    		>
			    			{ tab.title }
		    			</a>
			    	</li>	
			  	)) }
			  </ul>
			  <div className="tab-content">
			    <div className="tab-pane active">
			      <div className="panel-body gray-bg">
			      	{ content }
			      </div>
			    </div>
			  </div>
			</div>
		);
	}
}

export default Tabs;

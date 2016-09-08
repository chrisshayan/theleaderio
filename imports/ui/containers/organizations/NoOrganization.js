import React from 'react';

export default () => (
	<div style={styles.container}>
		<i className="fa fa-folder-o" style={styles.icon}></i>
		<h2 style={styles.msg}>There is no organization.</h2>
	</div>
);

const styles = {
	container: {
		width: '80%',
		height: '300px',
		margin: '0 auto',
		border: '2px dashed #ddd',
		padding: 50,
		textAlign: 'center'
	},
	msg: {
		textAlign: 'center'
	},
	icon: {
		fontSize: 40,
		color: '#ddd'
	}
};
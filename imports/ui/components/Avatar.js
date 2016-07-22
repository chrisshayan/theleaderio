import React from 'react';
import { getRandomColor } from '/imports/utils';

export default ({ letter = '', url = '', size = 80 }) => (
	<div style={styles.container(size, url)}>
		{ letter }
	</div>
);

const styles = {
	container(size, url = '') {
		return {
			width: size,
			height: size,
			borderRadius: size,
			backgroundColor: 'RGBA(24,166,137, 0.8)',
			backgroundImage: `url(${url})`,
			backgroundSize: 'cover',
			color: '#fff',
			textAlign: 'center',
			lineHeight: size + 'px',
			fontSize: Math.round((size * 20)/48),
			display: 'inline-block'
		};
	}
};

/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import './style.scss';

export default function Tooltip( { content } ) {
	return (
		<div className="tooltip">
			<div className="tooltip__trigger">?</div>
			<div className="tooltip__content">{ content }</div>
		</div>
	);
}

Tooltip.propTypes = {
	content: PropTypes.object,
};

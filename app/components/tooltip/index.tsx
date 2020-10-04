/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import './style.scss';

interface TooltipProps {
	content: string | JSX.Element
}

Tooltip.propTypes = {
	content: PropTypes.object,
};

export default function Tooltip( { content }: TooltipProps ): JSX.Element {
	return (
		<div className="tooltip">
			<div className="tooltip__trigger">?</div>
			<div className="tooltip__content">{ content }</div>
		</div>
	);
}

/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Tooltip from 'components/tooltip';
import './style.scss';

export default function Label( { forField, tooltip = null, children } ) {
	const hasTooltip = null === tooltip ? '' : 'has-tooltip';
	return (
		<div className={ `form-field ${ hasTooltip }` }>
			<label htmlFor={ forField }>{ children }</label>
			{ tooltip && <Tooltip content={ tooltip } /> }
		</div>
	);
}

Label.propTypes = {
	tooltip: PropTypes.object,
};

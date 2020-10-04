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

interface LabelProps {
	children: string;
	forField: string;
	tooltip?: string | JSX.Element;
}

Label.propTypes = {
	children: PropTypes.string,
	forField: PropTypes.string,
	tooltip: PropTypes.string,
};

export default function Label( { forField, tooltip = null, children }: LabelProps ): JSX.Element {
	const hasTooltip = null === tooltip ? '' : 'has-tooltip';
	return (
		<div className={ `form-field ${ hasTooltip }` }>
			<label htmlFor={ forField }>{ children }</label>
			{ tooltip && <Tooltip content={ tooltip } /> }
		</div>
	);
}

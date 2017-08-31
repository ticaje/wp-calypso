/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop, identity } from 'lodash';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';

class RemoveButton extends Component {
	static propTypes = {
		onRemove: PropTypes.func,
		translate: PropTypes.func
	};

	static defaultProps = {
		onRemove: noop,
		translate: identity,
	};

	render() {
		const { onRemove, translate } = this.props;

		if ( ! onRemove ) {
			return;
		}

		return (
			<Button
				onClick={ onRemove }
				compact
				className="remove-button"
			>
				<span className="remove-button__label screen-reader-text">
					{ translate( 'Remove' ) }
				</span>

				<Gridicon
					icon="cross"
					size={ 24 }
					className="remove-button__icon"
				/>
			</Button>
		);
	}
}

export default localize( RemoveButton );

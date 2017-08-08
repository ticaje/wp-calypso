/**
 * External dependencies
 */
import Dialog from 'components/dialog';
import React from 'react';
import FormTextInput from 'components/forms/form-text-input';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import { identity, noop } from 'lodash';
import { spy } from 'sinon';

/**
 * Internal dependencies
 */
import { EmbedDialog } from '../dialog';

describe( 'EmbedDialog', function() {
	it( 'should render', function() {
		const url = 'https://www.youtube.com/watch?v=JkOIhs2mHpc',
			wrapper = shallow(
			<EmbedDialog
				embedUrl={ url }
				onCancel={ noop }
				onUpdate={ noop }
				translate={ identity }
			/>
		);

		assert.isFalse( wrapper.instance().props.isVisible );
		assert.strictEqual( wrapper.find( '.embed__title' ).length, 1 );
		assert.strictEqual( wrapper.find( FormTextInput ).length, 1 );
		assert.strictEqual( wrapper.find( FormTextInput ).get( 0 ).props.defaultValue, url );
	} );

	it( "should update the input field's value when input changes", function() {
		const originalUrl = 'https://www.youtube.com/watch?v=ghrL82cc-ss',
			newUrl = 'https://videopress.com/v/DNgJlco8',
			wrapper = shallow(
				<EmbedDialog
					embedUrl={ originalUrl }
					onCancel={ noop }
					onUpdate={ noop }
					translate={ identity }
				/>
			),
			mockChangeEvent = {
				target: {
					value: newUrl,
					focus: noop,
				}
			};
		let inputField = wrapper.find( FormTextInput ).get( 0 );

		assert.strictEqual( inputField.props.defaultValue, originalUrl );
		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		inputField = wrapper.find( FormTextInput ).get( 0 );
		assert.strictEqual( inputField.props.defaultValue, newUrl );
	} );

	it( 'should return the new url to onUpdate when updating', function() {
		const originalUrl = 'https://www.youtube.com/watch?v=R54QEvTyqO4',
			newUrl = 'https://videopress.com/v/x4IYthy7',
			mockChangeEvent = {
				target: {
					value: newUrl,
					focus: noop,
				}
			};
		let currentUrl = originalUrl;
		const onUpdate = ( url ) => {
			currentUrl = url;
		};
		const wrapper = shallow(
			<EmbedDialog
				embedUrl={ originalUrl }
				onCancel={ noop }
				onUpdate={ onUpdate }
				translate={ identity }
			/>
		);

		assert.strictEqual( currentUrl, originalUrl );
		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		wrapper.instance().onUpdate();
		assert.strictEqual( currentUrl, newUrl );
	} );

	it( 'should not return the new url to onUpdate when canceling', function() {
		const originalUrl = 'https://www.youtube.com/watch?v=JkOIhs2mHpc',
			newUrl = 'https://videopress.com/v/GtWYbzhZ',
			mockChangeEvent = {
				target: {
					value: newUrl,
					focus: noop,
				}
			},
			noopSpy = spy( noop );
		let currentUrl = originalUrl;
		const onUpdate = ( url ) => {
			currentUrl = url;
		};
		const wrapper = shallow(
			<EmbedDialog
				embedUrl={ originalUrl }
				onCancel={ noopSpy }
				onUpdate={ onUpdate }
				translate={ identity }
			/>
		);

		assert.strictEqual( currentUrl, originalUrl );
		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		assert.isFalse( noopSpy.called );
		wrapper.find( Dialog ).simulate( 'cancel' );
		assert.isTrue( noopSpy.called );
		assert.strictEqual( currentUrl, originalUrl );
	} );
} );

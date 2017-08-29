/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { renderWithReduxStore } from 'lib/react-helpers';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import Button from 'components/button';
import FormTextInput from 'components/forms/form-text-input';
import EmbedView from '../view';

import EmbedViewManager from 'components/tinymce/plugins/wpcom-view/views/embed'

// lint branch before commit
// add jsdoc to all functions
// add readme to give high-level overview of what it is and how to use it
// add unit tests

class EmbedDialog extends Component {
	static propTypes = {
		embedUrl: PropTypes.string,
		isVisible: PropTypes.bool,
		onInsert: PropTypes.func.isRequired,
			// change to not required and set default to noop? or go the other direction and make embedurl and siteid required too?
		siteId: PropTypes.number,
	};

	static defaultProps = {
		embedUrl: '',
		isVisible: false,
		siteId: 0,
	};

	state = {
		embedUrl: this.props.embedUrl,
		isVisible: this.props.isVisible,
	};

	constructor( props ) {
		super( ...arguments );

		this.embedViewManager = new EmbedViewManager();
		this.embedView = this.embedViewManager.getComponent();

		//this.embedViewManager.addListener( 'change', this.foo, this.props.store );  // maybe this is wrong, don't wanna listen for changes on the viewmanager, but on something else? need to remove this when closing dialog?
	}

	foo = ( event ) => {
		//console.log( 'foo eve', event );  // causes max stack error
	};

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
		} );

		//this.embedViewManager.onChange();
		this.embedViewManager.fetchEmbed( event.target.value );

		let node = event.target.parentElement.querySelector( '.embed-dialog__preview' ); // maybe pass in as param or something
		//console.log('node embedd', node );

		renderWithReduxStore(
			React.createElement( this.embedView, {
				content: event.target.value,
				siteId: this.props.siteId,
			} ),
			node,
			this.props.store
		);
		// this is inserting an frame into the div, but it has no src and only a <script> in the body
			// probably b/c setHtml() isn't getting called, how to make that happen?
			// maybe still need to add a listener somewhere and have that dispatch an action when the url changes, and tehn that'd have a callback that would update the html when it receives the embed? take another look at how the existing embedviewmanager works

		// need to debounce or something so doesn't update every single keypress
	};

	onCancel = () => {
		this.setState( { isVisible: false } );
	};

	onUpdate = () => {
		this.props.onInsert( this.state.embedUrl );
		this.setState( { isVisible: false } );
	};

	render() {
		return (
			<Dialog
				className="embed-dialog"
				isVisible={ this.state.isVisible }
				onClose={ this.onCancel }
				buttons={ [
					<Button onClick={ this.onCancel }>
						Cancel
					</Button>,
					<Button primary onClick={ this.onUpdate }>
						Update
					</Button>
				] }>
				<h3 className="embed-dialog__title">Embed URL</h3>

				<FormTextInput
					defaultValue={ this.state.embedUrl }
					onChange={ this.onChangeEmbedUrl }
				/>

				<div className="embed-dialog__preview"></div>
				{/*
				<EmbedView
					siteId={ this.props.siteId }
					content={ this.state.embedUrl }
				/>*/}

				{/*
				test videos
					https://www.youtube.com/watch?v=R54QEvTyqO4
					https://www.youtube.com/watch?v=ghrL82cc-ss
					https://www.youtube.com/watch?v=JkOIhs2mHpc

					iCvmsMzlF7o&
					get some others video platforms, and maybe some non-video ones too

				also verify that only whitelisted embeds will work, and that all other user input is discarded to avoid security issues
					make sure there aren't any execution sinks, etc

				need to check if embedmarkup.body exists before using it. is there a js equivalent to php's ?? coalecense operator?

				localize strings and test in other locale
				*/}
			</Dialog>
		);
	}
}

export default EmbedDialog;

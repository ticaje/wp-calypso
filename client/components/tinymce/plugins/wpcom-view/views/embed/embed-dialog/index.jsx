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
import EmbedViewManager from 'components/tinymce/plugins/wpcom-view/views/embed'

// lint branch before commit
// add jsdoc to all functions
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
		this.embedViewManager.updateSite( this.props.siteId );
		this.embedView = this.embedViewManager.getComponent();
	}

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
		} );

		this.embedViewManager.fetchEmbed( event.target.value );

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
				additionalClassNames="embed-dialog__modal"
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
					className="embed-dialog__url"
					defaultValue={ this.state.embedUrl }
					onChange={ this.onChangeEmbedUrl }
				/>

				<this.embedView content={ this.state.embedUrl } />

				{/*
				exception thrown when change it twice in a row. - only in FF
					maybe related to needing to debounce?

				Warning: unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.
					wrapConsole/<
					app:///./client/components/webpack-build-monitor/index.jsx:174:3
					printWarning
					app:///./node_modules/fbjs/lib/warning.js:35:7
					warning
					app:///./node_modules/fbjs/lib/warning.js:59:7
					unmountComponentAtNode
					app:///./node_modules/react-dom/lib/ReactMount.js:443:15
					wpview/</<
			   >>>	app:///./client/components/tinymce/plugins/wpcom-view/plugin.js:287:5
					...


				test videos
					https://www.youtube.com/watch?v=R54QEvTyqO4
					https://www.youtube.com/watch?v=ghrL82cc-ss
					https://www.youtube.com/watch?v=JkOIhs2mHpc

					iCvmsMzlF7o&
					get some others video platforms, and maybe some non-video ones too

				also verify that only whitelisted embeds will work, and that all other user input is discarded to avoid security issues
					make sure there aren't any execution sinks, etc

				localize strings and test in other locale
				*/}
			</Dialog>
		);
	}
}

export default EmbedDialog;

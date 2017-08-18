/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import Button from 'components/button';
import FormTextInput from 'components/forms/form-text-input';
import PostEditEmbedsStore from 'lib/embeds/store';

// lint branch before commit
// add jsdoc to all functions
// add readme to give high-level overview of what it is and how to use it
// add unit tests

class EmbedDialog extends Component {
	static propTypes = {
		embedUrl: PropTypes.string,
		isVisible: PropTypes.bool,
		onInsert: PropTypes.func.isRequired,
	};

	static defaultProps = {
		embedUrl: '',
		isVisible: false,
	};

	state = {
		embedUrl: this.props.embedUrl,
		embedMarkup: PostEditEmbedsStore.get( this.props.embedUrl ),
		isVisible: this.props.isVisible,
	};

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
			embedMarkup: PostEditEmbedsStore.get( event.target.value ),
		} );

		// this is breaking. embedurl gets set correctly, but embedmarkup is an empty object
			// maybe it's async and need to wait on it?
		// need to debounce or something so not every single second
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

				<div className="embed-dialog__preview" dangerouslySetInnerHTML={ { __html: this.state.embedMarkup.body } } />
				{/*
				test videos
					https://www.youtube.com/watch?v=R54QEvTyqO4
					https://www.youtube.com/watch?v=ghrL82cc-ss
					https://www.youtube.com/watch?v=JkOIhs2mHpc
					get some others video platforms, and maybe some non-video ones too

				explain why it's safe to use dangersouslysetinnerhtml here. but first verify that it actually is safe
					if it is safe, add an ignore for the linter

				also verify that only whitelisted embeds will work, and that all other user input is discarded to avoid security issues

				need to check if embedmarkup.body exists before using it. is there a js equivalent to php's ?? coalecense operator?

				localize strings and test in other locale
				*/}
			</Dialog>
		);
	}
}

export default EmbedDialog;

/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import Button from 'components/button';
import FormTextInput from 'components/forms/form-text-input';
import PostEditEmbedsStore from 'lib/embeds/store';

class EmbedDialog extends Component {
	static propTypes = {
		isVisible: PropTypes.bool,
		embedUrl: PropTypes.string,
		//onClose: PropTypes.func,
	};

	static defaultProps = {
		isVisible: false,
		embedUrl: '',
		//onClose: noop,
	};

	state = {
		embedUrl: this.props.embedUrl,
		embedMarkup: PostEditEmbedsStore.get( this.props.embedUrl ),
	};

	onUpdateEmbed = ( event ) => {
		console.log('on update');
		// set to state. this.embedUrl ?
		// update tinymce content w/ state.embedUrl & re-render the embed inside the tinymce component
		this.props.onClose();
	};

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
			embedMarkup: PostEditEmbedsStore.get( event.target.value ),
		} );

		// this is breaking. embedurl gets set correctly, but embedmarkup is an empty object
		// re-reder preview - should happen automatically
		// need to debounce or something so not every single second
	};

	render() {
		return (
			<Dialog
				isVisible={ this.props.isVisible }
				onClose={ this.props.onClose }
				buttons={ [
					<Button onClick={ this.props.onClose }>
						Cancel
					</Button>,
					<Button primary onClick={ this.onUpdateEmbed }>
						Update
					</Button>
				] }
			>
				<h3>Embed URL</h3>

				<FormTextInput
					defaultValue={ this.state.embedUrl }
					onChange={ this.onChangeEmbedUrl }
				/>

				<div className="embed-dialog-preview" dangerouslySetInnerHTML={ { __html: this.state.embedMarkup.body } } />
			</Dialog>
		);

		{/*
		solved problems below w/ PostEditEmbedStore?
		better way to set the preview content other than dangerouslysetinnerhtml?


		which component to use to embed the url?
			will it work with all supported embeds, in addition to youtube?
			how does core do it? calypso probably has similar thing
			<ResizableIframe src={ this.state.embedUrl } frameBorder="0" seamless width="100%" />

		security issue above with src="user input", need to use wpcom oembed provider whitelist.
			lib/embeds/list-store ?
		also want iframe sandbox params etc?
		also need to transform to canonical embeddable URL. youtube will block main url via x-frame-options, have to use `/embed/{id}` url
		shouldn't all those issues be handled by whatever component embeds the url?

		localize strings
		*/}
	}
}

export default EmbedDialog;

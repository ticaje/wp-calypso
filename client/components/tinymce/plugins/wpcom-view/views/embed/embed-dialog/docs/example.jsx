/**
 * External dependencies
 */
import React, { PureComponent } from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import EmbedDialog from 'components/tinymce/plugins/wpcom-view/views/embed/embed-dialog/';

class EmbedDialogExample extends PureComponent {
	state = {
		embedUrl: 'https://www.youtube.com/watch?v=_hWhPBfsbK0',
		showDialog: false,
	}

	openDialog = () => this.setState( { showDialog: true } );
	updateEmbedUrl = ( newEmbedUrl ) => this.setState( { embedUrl: newEmbedUrl } );

	// not working

	render() {
		return (
			<Card>
				<Button onClick={ this.openDialog }>Open Embed Dialog</Button>
				<EmbedDialog
					embedUrl={ this.state.embedUrl }
					isVisible={ this.state.showDialog }
				    onInsert={ this.updateEmbedUrl }
				/>

				<p>Embed URL is { this.state.embedUrl }.</p>
			</Card>
		);
	}
}

export default EmbedDialogExample;

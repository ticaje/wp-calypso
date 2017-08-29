/**
 * External dependencies
 */
import ReactDom from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { Container } from 'flux/utils';
import { pick } from 'lodash';

/**
 * Internal dependencies
 */
import ResizableIframe from 'components/resizable-iframe';
import EmbedsStore from 'lib/embeds/store';
import generateEmbedFrameMarkup from 'lib/embed-frame-markup';

class EmbedView extends Component {
	static getStores() {
		return [ EmbedsStore ];
	}

	static calculateState( state, props ) {
		return EmbedsStore.get( props.content );

		// problem is that calculateState isn't getting called when props changes
			// it's a built-in flux thing, so it should get called automatically? but maybe need to do something to trigger it?
			// how does it get called when the component initially renders, or when the tab switches from html to visual?

		// whatever changes you make, make sure they don't have unintended conseuqnces for other usages of this component
	}

	componentDidMount() {
		// Rendering the frame follows a specific set of steps, whereby an
		// initial rendering pass is made, at which time the frame is rendered
		// in a second pass, before finally setting the frame markup.
		//
		// TODO: Investigate and evaluate whether we need to avoid rendering
		//       the iframe on the initial render pass
		this.setState( { // eslint-disable-line react/no-did-mount-set-state
			wrapper: this.refs.view
		}, this.setHtml );
	}

	componentWillReceiveProps( nextProps ) {
		return; // prob don't need to do anything in here if using embedviewmanager

		if ( nextProps.content === this.props.content ) {
			return;
		}

//		console.log( 'com will rec. calc state:' );

		//this.setState( { body: EmbedsStore.get( nextProps.content ) } );
		//this.setState( { body: EmbedView.calculateState( this.state, nextProps ) } );    // might need to do this AFTER props received

		//const body = "<span class=\"embed-youtube\" style=\"text-align:center; display: block;\"><iframe class='youtube-player' type='text/html' width='640' height='390' src='https://www.youtube.com/embed/iCvmsMzlF7o' allowfullscreen='true' style='border:0;'></iframe></span>";
		const body = EmbedView.calculateState( this.state, nextProps );
		this.setState( { body: body } );

		// so now everything is setup, but current problem is that calcstate is returning empty object
			// maybe b/c not designed to be called directly, or need to pass it somethind different? figure out how it's called for the initial tinymce render and compare to this

		// maybe need to dispatch an action to fetch the embed, and maybe hook into the RECEIVE_EMBED too?
			// maybe embedviewmanager should dispatch it?
				// if so, maybe EmbedDialog needs to include EmbedViewMangager instead of EmbedView directly?
				// it doesn't have a render() function though, so how is it used?


		// maybe use lib/embed/actions.fetch() instead of posteditembedstore.get?
			// maybe, but would need to dispatch action rather than calling directly
	}

	componentDidUpdate( prevProps, prevState ) {
		/*console.log( 'embedview compdid update - bodies: ' );
		console.log( this.state.body );
		console.log( prevState.body );*/

		//console.log( this.calculateState );
		//this.calculateState();  // neds to be async?

		// need to understand how this works more. this fires right after the state is updated? or after new props received? prob state
		// if disable this, need to undersatnd why it was there in the first place. prob don't disable, but add new condition, like if props.content different thatn previous
		// maybe need to track props.content as state now? but shouldn't have to, right? this whole component should re-render when the props change from the parent being re-rendered

		// how does state.body get updated? by calculateState? how does that get called?
//prevState.body = 'old temp';
		if ( this.state.body !== prevState.body ) {
			this.setHtml();
		}

		this.constrainEmbedDimensions();
	}

	constrainEmbedDimensions() {
		if ( ! this.refs.iframe ) {
			return;
		}

		const view = ReactDom.findDOMNode( this.refs.view );
		const iframe = ReactDom.findDOMNode( this.refs.iframe );
		if ( ! iframe.contentDocument ) {
			return;
		}

		const embed = iframe.contentDocument.querySelector( 'iframe' );

		if ( ! embed || ! embed.width ) {
			return;
		}

		const width = parseInt( embed.width, 10 );
		if ( width <= view.clientWidth ) {
			return;
		}
		embed.style.width = view.clientWidth + 'px';

		if ( embed.height ) {
			const proportion = parseInt( embed.height, 10 ) / width;
			embed.style.height = Math.round( view.clientWidth * proportion ) + 'px';
		}
	}

	setHtml() {
		if ( ! this.state.body || ! this.refs.iframe ) {
			return;
		}

		const iframe = ReactDom.findDOMNode( this.refs.iframe );
		if ( ! iframe.contentDocument ) {
			return;
		}

		const markup = generateEmbedFrameMarkup( pick( this.state, 'body', 'scripts', 'styles' ) );
		iframe.contentDocument.open();
		iframe.contentDocument.write( markup );
		iframe.contentDocument.body.style.width = '100%';
		iframe.contentDocument.body.style.overflow = 'hidden';
		iframe.contentDocument.close();
	}

	renderFrame() {
		if ( ! this.state.wrapper ) {
			return;
		}

		return <ResizableIframe ref="iframe" onResize={ this.props.onResize } frameBorder="0" seamless width="100%" />;
	}

	render() {
		return (
			<div ref="view" className="wpview-content wpview-type-embed">
				{ this.renderFrame() }
			</div>
		);
	}

}

EmbedView.propTypes = {
	siteId: PropTypes.number,
	content: PropTypes.string,
	onResize: PropTypes.func
};

EmbedView.defaultProps = {
	onResize: () => {}
};

const EmbedViewContainer = Container.create( EmbedView, { withProps: true } );
export default EmbedViewContainer;

/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { SetupPath, Steps } from './constants';
import Confirmation from './confirmation';
import DocumentHead from 'components/data/document-head';
import ExtensionRedirect from 'blocks/extension-redirect';
import Intro from './intro';
import Main from 'components/main';
import PageSetup from './page-setup';
import Wizard from 'components/wizard';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';

const SetupWizard = ( {
	siteId,
	slug,
	stepName = Steps.INTRO,
	translate,
} ) => {
	const steps = [ Steps.INTRO, Steps.PAGE_SETUP, Steps.CONFIRMATION ];
	const components = {
		[ Steps.INTRO ]: <Intro />,
		[ Steps.PAGE_SETUP ]: <PageSetup />,
		[ Steps.CONFIRMATION ]: <Confirmation />,
	};
	const mainClassName = 'wp-job-manager__setup';

	return (
		<Main className={ mainClassName }>
			<ExtensionRedirect
				minimumVersion="1.28.0"
				pluginId="wp-job-manager"
				siteId={ siteId } />
			<DocumentHead title={ translate( 'Setup' ) } />
			<Wizard
				basePath={ `${ SetupPath }/${ slug }` }
				components={ components }
				forwardText={ translate( 'Continue' ) }
				hideNavigation={ true }
				steps={ steps }
				stepName={ stepName } />
		</Main>
	);
};

const mapStateToProps = state => ( {
	siteId: getSelectedSiteId( state ),
	slug: getSelectedSiteSlug( state ),
} );

SetupWizard.propTypes = {
	siteId: PropTypes.number,
	slug: PropTypes.string,
	stepName: PropTypes.string,
	translate: PropTypes.func.isRequired,
};

export default connect( mapStateToProps )( localize( SetupWizard ) );

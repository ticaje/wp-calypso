/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import edits from './edits-reducer';
import list from './list-reducer';

export default combineReducers( {
	edits,
	list,
} );


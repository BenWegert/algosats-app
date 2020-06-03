import { combineReducers } from 'redux';
// Imports: Reducers
import persistReducers from './persistReducers';
import reducers from './reducers';

// Redux: Root Reducer
const rootReducer = combineReducers({
	persistReducers: persistReducers,
	reducers: reducers,
});
// Exports
export default rootReducer;
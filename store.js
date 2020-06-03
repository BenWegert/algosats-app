// Imports: Dependencies
import { AsyncStorage } from 'react-native';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
// Imports: Redux
import rootReducer from './reducers/index';
// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'primary',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'theme',
    'lock',
    'refresh',
    'jwt'
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [
    'test',
  ],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Redux: Store
const store = createStore(
  persistedReducer
);
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {
  store,
  persistor,
};
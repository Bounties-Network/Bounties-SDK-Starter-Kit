import handleReducer from './Handle';
import handleSagas from './Handle/sagas';

export const reducers = { handle: handleReducer };
export const sagaWatchers = [ ...handleSagas ];
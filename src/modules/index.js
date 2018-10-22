import handleReducer from './Handle';
import handleSagas from './Handle/sagas';

import loginWalkthroughReducer from './LoginWalkthrough/reducer';
import loginWalkthroughSagas from './LoginWalkthrough/sagas';

export const reducers = { handle: handleReducer, loginContainer: loginWalkthroughReducer };
export const sagaWatchers = [ ...handleSagas, ...loginWalkthroughSagas ];
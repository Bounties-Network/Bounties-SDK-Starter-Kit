import { takeLatest, put, select } from 'redux-saga/effects';
import { actions, actionTypes, selectors } from '@bounties-network/modules';
import { actions as loginUIActions } from './reducer';

const { LOGIN_SUCCESS } = actionTypes.authentication;
const { resetLoginState } = actions.authentication;
const { showLogin } = loginUIActions;

function* loginSuccess() {
  yield put(showLogin(false));
}

export function* watchLogin() {
  yield takeLatest(LOGIN_SUCCESS, loginSuccess);
}

export default [watchLogin];

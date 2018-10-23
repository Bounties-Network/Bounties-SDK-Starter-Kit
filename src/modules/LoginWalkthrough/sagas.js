import { takeLatest, put } from 'redux-saga/effects';
import { actionTypes } from '@bounties-network/modules';
import { actions as loginUIActions } from './reducer';

const { LOGIN_SUCCESS } = actionTypes.authentication;
const { showLogin } = loginUIActions;

function* loginSuccess() {
  yield put(showLogin(false));
}

export function* watchLogin() {
  yield takeLatest(LOGIN_SUCCESS, loginSuccess);
}

export default [watchLogin];

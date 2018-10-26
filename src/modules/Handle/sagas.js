import React from 'react';
import { actions as modulesActions, actionTypes as modulesActionTypes, selectors, request, sagas, helpers } from 'bounties';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { actionTypes, actions } from './';
import { handleOnChainSelector } from './selectors';
import config from '../config.json';
import { toast as callToast } from 'react-toastify';
import { Toast } from '@bounties-network/components';

const {
  SAVE_HANDLE,
  SAVE_ONCHAIN_HANDLE,
  SAVE_HANDLE_SUCCESS
} = actionTypes;

const {
  loadHandleSuccess,
  loadHandleFail,
  loadOnChainHandleSuccess,
  loadOnChainHandleFail,
  saveHandleSuccess,
  saveHandleFail,
  saveOnChainHandleSuccess,
  saveOnChainHandleFail,
  saveOnChainHandleTxCompleted
} = actions;

const { setPendingWalletConfirm, setPendingReceipt, setTransactionError } = modulesActions.transaction;
const { getContractClient, getWeb3Client } = sagas.client;
const { promisifyContractCall } = helpers;
const { ADD_TRANSACTION, SET_TRANSACTION_COMPLETED } = modulesActionTypes.transaction;
const { GET_CURRENT_USER_SUCCESS, LOGIN_SUCCESS } = modulesActionTypes.authentication;
const { getTransactionSelector, transactionsInitiatedSelector } = selectors.transaction;
const { networkSelector } = selectors.client


function* getUserAddress() {
  const { proxiedWeb3 } = yield call(getWeb3Client)
  const accounts = yield proxiedWeb3.eth.getAccounts();
  return accounts[0];
}

export function* loadHandle(action) {
  if (action.type === GET_CURRENT_USER_SUCCESS && !action.user) {
    yield put(loadHandleFail());
  }

  try {
    yield put(loadHandleSuccess(action.user.username));
  } catch (e) {
    yield put(loadHandleFail(e));
  }
}

export function* loadOnChainHandle(action) {
  if (action.type === GET_CURRENT_USER_SUCCESS && !action.user) {
    yield put(loadOnChainHandleFail());
  }

  try {
    const userAddress = yield getUserAddress();

    const directoryContract = yield call(
      getContractClient,
      config.deployments.directory,
      config.interfaces.directory
    );

    const result = yield call(directoryContract.handles(userAddress).call)

    yield put(loadOnChainHandleSuccess(result));
  } catch (e) {
    console.log(e)
    yield put(loadOnChainHandleFail(e));
  }
}

export function* saveHandle(action) {
  const { handle } = action;

  try {
    const userAddress = yield getUserAddress();
    let endpoint = `user/${userAddress}/`;
    const result = yield call(request, endpoint, 'PUT', { data: { username: handle } });

    yield put(saveHandleSuccess(result.username));
  } catch (e) {
    console.log(e);
    yield put(saveHandleFail(e));
  }
}

export function* saveOnchainHandle(action) {
  const { handle } = action;

  yield put(setPendingWalletConfirm());

  yield call(getWeb3Client);
  const userAddress = yield select(selectors.client.addressSelector);

  const directoryContract = yield call(
    getContractClient,
    config.deployments.directory,
    config.interfaces.directory
  );

  try {
    const txHash = yield call(
      promisifyContractCall(directoryContract.setHandle, { from: userAddress }),
      handle
    );

    yield put(setPendingReceipt(txHash));
    yield put(saveOnChainHandleSuccess(txHash));
  } catch (e) {
    console.log(e);
    yield put(setTransactionError());
    yield put(saveOnChainHandleFail(e));
  }
}

export function* checkTransactionHash(action) {
  const { txHash } = action;
  const onChainHandleState = yield select(handleOnChainSelector);

  if (txHash === onChainHandleState.txHash) {
    yield put(saveOnChainHandleTxCompleted());
  }
}

let pendingToasts = {};
export function* showTransactionNotification(action) {
  let txHash = 'offchain';
  let postedLink = '';
  let postedMessage = 'Handle saved successfully to server';
  let toastType = Toast.TYPE.SUCCESS;

  if (action.type !== SAVE_HANDLE_SUCCESS) {
    txHash = action.txHash;

    const transactionsInitiated = yield select(transactionsInitiatedSelector);
    if (!transactionsInitiated) {
      return null;
    }

    const currentTransaction = yield select(getTransactionSelector(txHash));

    const network = yield select(networkSelector);
    const baseUrl = network === 'mainNet' ? 'https://etherscan.io/tx/' : 'https://rinkeby.etherscan.io/tx/';

    postedLink = (
      <a href={baseUrl + txHash} target="_blank" without rel="noopener noreferrer" style={{ color: 'inherit' }}>
        View on etherscan
      </a>
    );

    postedMessage = 'Transaction complete';
    toastType = Toast.TYPE.SUCCESS;

    if (!currentTransaction.completed) {
      postedMessage = 'Processing transaction';
      toastType = Toast.TYPE.TRANSACTION;
    }
  }

  const prevToastID = pendingToasts[txHash];
  if (prevToastID) {
    callToast.dismiss(prevToastID);
  }

  const id = yield call(Toast, toastType, postedMessage, postedLink);
  pendingToasts[txHash] = id;
}

export function* watchLoadHandle() {
  yield takeLatest([GET_CURRENT_USER_SUCCESS, LOGIN_SUCCESS], loadHandle);
}

export function* watchLoadOnChainHandle() {
  yield takeLatest([GET_CURRENT_USER_SUCCESS, LOGIN_SUCCESS], loadOnChainHandle);
}

export function* watchSaveHandle() {
  yield takeLatest(SAVE_HANDLE, saveHandle)
}

export function* watchSaveHandleOnChain() {
  yield takeLatest(SAVE_ONCHAIN_HANDLE, saveOnchainHandle)
}

export function* watchCompletedTransactions() {
  yield takeLatest(SET_TRANSACTION_COMPLETED, checkTransactionHash);
}

export function* watchForTransactionToasts() {
  yield takeLatest(
    [ADD_TRANSACTION, SET_TRANSACTION_COMPLETED, SAVE_HANDLE_SUCCESS],
    showTransactionNotification
  );
}


// export function* watchPostComment() {
//   yield takeLatest(POST_COMMENT, postNewComment);
// }

export default [
  watchLoadHandle,
  watchSaveHandle,
  watchSaveHandleOnChain,
  watchLoadOnChainHandle,
  watchCompletedTransactions,
  watchForTransactionToasts
];
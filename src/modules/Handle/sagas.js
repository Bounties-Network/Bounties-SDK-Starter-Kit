import { actions as modulesActions, actionTypes as modulesActionTypes, selectors, request, sagas, helpers } from '@bounties-network/modules';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { actionTypes, actions } from './';
import { handleOnChainSelector } from './selectors';
import config from '../config.json';

const {
  LOAD_HANDLE,
  LOAD_ONCHAIN_HANDLE,
  SAVE_HANDLE,
  SAVE_ONCHAIN_HANDLE
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
const { getContractClient, getWeb3Client, getWalletAddress } = sagas.client;
const { promisify, promisifyContractCall } = helpers;
const { SET_TRANSACTION_COMPLETED } = modulesActionTypes.transaction;
const { SET_ADDRESS } = modulesActionTypes.client;

export function* loadHandle(action) {
  const { bountyId } = action;

  // try {  const directoryContract = yield call(
  //   getContractClient,
  //   config.deployments.directory,
  //   config.interfaces.directory
  // );
  //   const endpoint = `bounty/${bountyId}/comment/?limit=${LIMIT}`;
  //   const comments = yield call(request, endpoint, 'GET');

  //   yield put(loadCommentsSuccess(comments.results, comments.count));
  // } catch (e) {
  //   yield put(loadCommentsFail(e));
  // }
}

export function* loadOnChainHandle(action) {
  try {
    const { proxiedWeb3 } = yield call(getWeb3Client)
    const accounts = yield proxiedWeb3.eth.getAccounts();
    const userAddress = accounts[0];

    console.log(userAddress)

    const directoryContract = yield call(
      getContractClient,
      config.deployments.directory,
      config.interfaces.directory
    );

    console.log(directoryContract)

    console.log('prepping call')
    const result = yield call(directoryContract.handles(userAddress).call)
    console.log('result', result, typeof result);

    yield put(loadOnChainHandleSuccess(result));
  } catch (e) {
    console.log(e)
    yield put(loadOnChainHandleFail(e));
  }
}


// export function* postNewComment(action) {
//   const { bountyId, text } = action;

//   try {
//     let endpoint = `bounty/${bountyId}/comment/`;
//     const comment = yield call(request, endpoint, 'POST', { data: { text } });

//     yield put(postCommentSuccess(comment));
//   } catch (e) {
//     console.log(e);
//     yield put(postCommentFail(e));
//   }
// }

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

  console.log(txHash, onChainHandleState)

  if (txHash === onChainHandleState.txHash) {
    yield put(saveOnChainHandleTxCompleted());
  }

}

export function* watchLoadHandle() {
  yield takeLatest(SET_ADDRESS, loadHandle);
}

export function* watchLoadOnChainHandle() {
  yield takeLatest(SET_ADDRESS, loadOnChainHandle);
}

export function* watchSaveHandleOnChain() {
  yield takeLatest(SAVE_ONCHAIN_HANDLE, saveOnchainHandle)
}

export function* watchCompletedTransactions() {
  yield takeLatest(SET_TRANSACTION_COMPLETED, checkTransactionHash);
}

// export function* watchPostComment() {
//   yield takeLatest(POST_COMMENT, postNewComment);
// }

export default [
  watchLoadHandle,
  watchSaveHandleOnChain,
  watchLoadOnChainHandle,
  watchCompletedTransactions
];
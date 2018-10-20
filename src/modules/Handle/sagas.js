import { selectors, request, sagas, helpers } from '@bounties-network/modules';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { actionTypes, actions } from './';
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
  saveOnChainHandleFail
} = actions;

const { getContractClient, getWeb3Client } = sagas.client;
const { promisifyContractCall } = helpers;

export function* loadHandle(action) {
  const { bountyId } = action;

  // try {
  //   const endpoint = `bounty/${bountyId}/comment/?limit=${LIMIT}`;
  //   const comments = yield call(request, endpoint, 'GET');

  //   yield put(loadCommentsSuccess(comments.results, comments.count));
  // } catch (e) {
  //   yield put(loadCommentsFail(e));
  // }
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

  // yield put(setPendingWalletConfirm());

  console.log(handle)

  const userAddress = yield select(selectors.client.addressSelector);
  yield call(getWeb3Client);

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

    // yield put(setPendingReceipt(txHash));
    yield put(saveOnChainHandleSuccess(handle));
  } catch (e) {
    console.log(e);
    // yield put(setTransactionError());
    yield put(saveOnChainHandleFail(e));
  }
}

export function* watchLoadHandle() {
  yield takeLatest(LOAD_HANDLE, loadHandle);
}

export function* watchSaveHandleOnChain() {
  yield takeLatest(SAVE_ONCHAIN_HANDLE, saveOnchainHandle)
}

// export function* watchPostComment() {
//   yield takeLatest(POST_COMMENT, postNewComment);
// }

export default [watchLoadHandle, watchSaveHandleOnChain];
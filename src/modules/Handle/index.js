import { actionTypes as modulesActionTypes } from '@bounties-network/modules';

const { GET_CURRENT_USER_SUCCESS, LOGIN_SUCCESS } = modulesActionTypes.authentication;
const defaultHandleState = {
  loading: false,
  error: false,
  saving: false,
  saveError: false,
  handle: null
}
const initialState = {
  onchain: defaultHandleState,
  offchain: defaultHandleState
};

// load off-chain
const LOAD_HANDLE         = 'handle/LOAD_HANDLE';
const LOAD_HANDLE_SUCCESS = 'handle/LOAD_HANDLE_SUCCESS';
const LOAD_HANDLE_FAIL    = 'handle/LOAD_HANDLE_FAIL';
const loadHandle          = ()     => ({ type: LOAD_HANDLE });
const loadHandleSuccess   = handle => ({ type: LOAD_HANDLE_SUCCESS, handle });
const loadHandleFail      = error  => ({ type: LOAD_HANDLE_FAIL, error });

// load on-chain
const LOAD_ONCHAIN_HANDLE         = 'handle/LOAD_ONCHAIN_HANDLE';
const LOAD_ONCHAIN_HANDLE_SUCCESS = 'handle/LOAD_ONCHAIN_HANDLE_SUCCESS';
const LOAD_ONCHAIN_HANDLE_FAIL    = 'handle/LOAD_ONCHAIN_HANDLE_FAIL';
const loadOnChainHandle           = ()     => ({ type: LOAD_ONCHAIN_HANDLE });
const loadOnChainHandleSuccess    = handle => ({ type: LOAD_ONCHAIN_HANDLE_SUCCESS, handle });
const loadOnChainHandleFail       = error  => ({ type: LOAD_ONCHAIN_HANDLE_FAIL, error });

// save off-chain
const SAVE_HANDLE         = 'handle/SAVE_HANDLE';
const SAVE_HANDLE_SUCCESS = 'handle/SAVE_HANDLE_SUCCESS';
const SAVE_HANDLE_FAIL    = 'handle/SAVE_HANDLE_FAIL';
const saveHandle          = handle => ({ type: SAVE_HANDLE, handle });
const saveHandleSuccess   = handle => ({ type: SAVE_HANDLE_SUCCESS, handle });
const saveHandleFail      = error  => ({ type: SAVE_HANDLE_FAIL, error });

// save on-chain
const SAVE_ONCHAIN_HANDLE         = 'handle/SAVE_ONCHAIN_HANDLE';
const SAVE_ONCHAIN_HANDLE_SUCCESS = 'handle/SAVE_ONCHAIN_HANDLE_SUCCESS';
const SAVE_ONCHAIN_HANDLE_FAIL    = 'handle/SAVE_ONCHAIN_HANDLE_FAIL';
const SAVE_ONCHAIN_HANDLE_TX_COMPLETED = 'handle/SAVE_ONCHAIN_HANDLE_TX_COMPLETED';
const saveOnChainHandle            = handle => ({ type: SAVE_ONCHAIN_HANDLE, handle });
const saveOnChainHandleSuccess     = txHash => ({ type: SAVE_ONCHAIN_HANDLE_SUCCESS, txHash });
const saveOnChainHandleTxCompleted = ()     => ({ type: SAVE_ONCHAIN_HANDLE_TX_COMPLETED })
const saveOnChainHandleFail        = error  => ({ type: SAVE_ONCHAIN_HANDLE_FAIL, error });

function HandleReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        offchain: { ...state.offchain, loading: true, error: false },
        onchain: { ...state.onchain, loading: true, saveError: false }
      }

    case LOAD_HANDLE:
      return {
        ...state,
        offchain: { ...state.offchain, loading: true, error: false }
      }
    case LOAD_HANDLE_SUCCESS:
      return {
        ...state,
        offchain: { ...defaultHandleState, handle: action.handle }
      }
    case LOAD_HANDLE_FAIL:
      return {
        ...state,
        offchain: { ...defaultHandleState, error: true }
      }

    case LOAD_ONCHAIN_HANDLE:
      return {
        ...state,
        onchain: { ...defaultHandleState, loading: true, error: false }
      }
    case LOAD_ONCHAIN_HANDLE_SUCCESS:
      return {
        ...state,
        onchain: { ...state.onchain, loading: false, handle: action.handle }
      }
    case LOAD_ONCHAIN_HANDLE_FAIL:
      return {
        ...state,
        onchain: { ...defaultHandleState, loading: false, error: true }
      }

    case SAVE_HANDLE:
      return {
        ...state,
        offchain: { ...state.offchain, saving: true, error: false }
      }
    case SAVE_HANDLE_SUCCESS:
      return {
        ...state,
        offchain: { ...defaultHandleState, handle: action.handle }
      }
    case SAVE_HANDLE_FAIL:
      return {
        ...state,
        offchain: { ...state.offchain, saving: false, error: true }
      }

    case SAVE_ONCHAIN_HANDLE:
      return {
        ...state,
        onchain: { ...state.onchain, saving: true, error: false }
      }
    case SAVE_ONCHAIN_HANDLE_SUCCESS:
      return {
        ...state,
        onchain: { ...state.onchain, txHash: action.txHash }
      }
    case SAVE_ONCHAIN_HANDLE_TX_COMPLETED:
      return {
        ...state,
        onchain: { ...state.onchain, saving: false, error: false }
      }
    case SAVE_ONCHAIN_HANDLE_FAIL:
      return {
        ...state,
        onchain: { ...state.onchain, saving: false, error: true }
      }

    default:
      return state;
  }
}

export const actions = {
  loadHandle,
  loadHandleSuccess,
  loadHandleFail,
  loadOnChainHandle,
  loadOnChainHandleSuccess,
  loadOnChainHandleFail,
  saveHandle,
  saveHandleSuccess,
  saveHandleFail,
  saveOnChainHandle,
  saveOnChainHandleSuccess,
  saveOnChainHandleFail,
  saveOnChainHandleTxCompleted
};

export const actionTypes = {
  LOAD_HANDLE,
  LOAD_HANDLE_SUCCESS,
  LOAD_HANDLE_FAIL,
  LOAD_ONCHAIN_HANDLE,
  LOAD_ONCHAIN_HANDLE_SUCCESS,
  LOAD_ONCHAIN_HANDLE_FAIL,
  SAVE_HANDLE,
  SAVE_HANDLE_SUCCESS,
  SAVE_HANDLE_FAIL,
  SAVE_ONCHAIN_HANDLE,
  SAVE_ONCHAIN_HANDLE_SUCCESS,
  SAVE_ONCHAIN_HANDLE_FAIL,
  SAVE_ONCHAIN_HANDLE_TX_COMPLETED
};

export default HandleReducer;
import { createSelector } from 'reselect';

export const rootHandleSelector = state => state.handle;

export const handleSelector = createSelector(
  rootHandleSelector,
  handle => handle.offchain
);

export const handleOnChainSelector = createSelector(
  rootHandleSelector,
  handle => handle.onchain
);
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  UnlockWallet,
  AddressMismatch,
  ErrorModal,
  WrongNetwork
} from './components';
import modulesConfig, { actions, selectors } from '@bounties-network/modules';

const authActions = actions.authentication
const {
  getCurrentUserSelector,
  logoutStateSelector
} = selectors.authentication;

const {
  addressSelector,
  walletLockedSelector,
  hasWalletSelector
} = selectors.client;

class LoginLockComponent extends React.Component {
  componentDidMount() {
    if (window.ethereum) {
      window.ethereum.enable();
    }
  }

  render() {
    const {
      walletLocked,
      walletAddress,
      userAddress,
      img,
      logout,
      loggingOut,
      resetLogoutState,
      network,
      isCorrectNetwork,
      error
    } = this.props;

    const config = {
      showUnlockWallet: false,
      showError: false,
      showMismatch: false,
      showWrongNetwork: false
    };

    if (walletLocked || !walletAddress) {
      config.showUnlockWallet = true;
    } else if (error) {
      config.showError = true;
    } else if (!isCorrectNetwork) {
      config.showWrongNetwork = true;
    } else if (
      userAddress &&
      userAddress.toLowerCase() !== walletAddress.toLowerCase()
    ) {
      config.showMismatch = true;
    }

    return (
      <React.Fragment>
        <UnlockWallet
          visible={config.showUnlockWallet}
          pageLevel
          closable={false}
        />
        <WrongNetwork
          visible={config.showWrongNetwork}
          pageLevel
          network={network}
          closable={false}
        />
        <ErrorModal visible={config.showError} onClose={resetLogoutState} />
        <AddressMismatch
          closable={false}
          visible={config.showMismatch}
          currentAddress={walletAddress}
          previousAddress={userAddress}
          img={img}
          logout={()=>{console.log('logging out', logout);logout()}}
          loggingOut={loggingOut}
          pageLevel
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const user = getCurrentUserSelector(state);
  const logoutState = logoutStateSelector(state);
  const network = state.client.network;

  return {
    hasWallet: hasWalletSelector(state),
    walletLocked: walletLockedSelector(state),
    walletAddress: addressSelector(state),
    userAddress: user && user.public_address,
    network: network,
    isCorrectNetwork: modulesConfig.settings.requiredNetwork
      ? network === modulesConfig.settings.requiredNetwork
      : network === 'mainNet' || network === 'rinkeby',
    img: user && user.small_profile_image_url,
    error: logoutState.error,
    loggingOut: logoutState.loading
  };
};

const LoginLock = compose(
  connect(
    mapStateToProps,
    {
      logout: authActions.logout,
      resetLogoutState: authActions.resetLogoutState
    }
  )
)(LoginLockComponent);

LoginLock.propTypes = {
  hasWallet: PropTypes.bool,
  walletLocked: PropTypes.bool,
  walletAddress: PropTypes.string,
  userAddress: PropTypes.string,
  img: PropTypes.string,
  logout: PropTypes.func,
  loggingOut: PropTypes.bool,
  resetLogoutState: PropTypes.func,
  error: PropTypes.string
};

export default LoginLock;
